// src/services/emailService.js (SendGrid REST API - NO SMTP)
// ============================================
import sgMail from "@sendgrid/mail";
import { EMAIL_TEMPLATES } from "../constants/emailTemplates.js";
import { logger } from "../utils/logger.js";

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("📧 SendGrid initialized with REST API");
} else {
  console.error("❌ SENDGRID_API_KEY not found in environment variables");
}

/**
 * Send email using SendGrid REST API (not SMTP)
 * This avoids Railway's SMTP port blocking issues
 */
const sendEmail = async (to, subject, html, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const msg = {
        to,
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER || "noreply@shophub.com",
        subject,
        html,
      };

      await sgMail.send(msg);
      
      logger.success(`✅ Email sent to ${to} via SendGrid API (attempt ${attempt}/${retries})`);
      return true;
    } catch (error) {
      logger.error(`❌ Attempt ${attempt}/${retries} failed for ${to}: ${error.message}`);
      
      // Log detailed error from SendGrid
      if (error.response) {
        console.error("SendGrid error details:", error.response.body);
      }

      // If this was the last attempt, throw error
      if (attempt === retries) {
        throw new Error(`Failed to send email after ${retries} attempts: ${error.message}`);
      }

      // Wait before retrying (1s, 2s, 3s)
      const waitTime = 1000 * attempt;
      logger.info(`⏳ Retrying in ${waitTime / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
};

export const emailService = {
  async sendOtpEmail(email, otp) {
    try {
      return await sendEmail(
        email,
        "Email Verification - ShopHub",
        EMAIL_TEMPLATES.OTP(otp)
      );
    } catch (error) {
      logger.error(`Failed to send OTP email: ${error.message}`);
      throw error;
    }
  },

  async sendPasswordResetEmail(user, resetToken) {
    try {
      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
      return await sendEmail(
        user.email,
        "Password Reset Request - ShopHub",
        EMAIL_TEMPLATES.PASSWORD_RESET(user.name, resetUrl)
      );
    } catch (error) {
      logger.error(`Failed to send password reset email: ${error.message}`);
      throw error;
    }
  },

  async sendPasswordChangeConfirmation(user) {
    try {
      await sendEmail(
        user.email,
        "Password Changed Successfully - ShopHub",
        EMAIL_TEMPLATES.PASSWORD_CHANGED(user.name)
      );
      return true;
    } catch (error) {
      logger.warn(`Confirmation email failed but password was changed: ${error.message}`);
      return false; // Don't fail the password change if email fails
    }
  },

  async sendContactEmails(contactData) {
    try {
      // Send to admin
      await sendEmail(
        process.env.ADMIN_EMAIL,
        `New Contact Form: ${contactData.subject}`,
        EMAIL_TEMPLATES.CONTACT_ADMIN(
          contactData.firstName,
          contactData.lastName,
          contactData.email,
          contactData.phone,
          contactData.subject,
          contactData.message
        )
      );

      // Send confirmation to user
      await sendEmail(
        contactData.email,
        "We received your message - ShopHub",
        EMAIL_TEMPLATES.CONTACT_USER(contactData.firstName, contactData.subject)
      );

      return true;
    } catch (error) {
      logger.error(`Failed to send contact emails: ${error.message}`);
      throw error;
    }
  },

  async sendContactReply(contact, reply) {
    try {
      return await sendEmail(
        contact.email,
        `Re: ${contact.subject}`,
        EMAIL_TEMPLATES.CONTACT_REPLY(contact.firstName, contact.subject, reply)
      );
    } catch (error) {
      logger.error(`Failed to send contact reply: ${error.message}`);
      throw error;
    }
  },
};
