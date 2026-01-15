// src/services/emailService.js
import nodemailer from "nodemailer";
import { EMAIL_TEMPLATES } from "../constants/emailTemplates.js";
import { logger } from "../utils/logger.js";

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    try {
      if (process.env.SENDGRID_API_KEY) {
        transporter = nodemailer.createTransport({
          host: "smtp.sendgrid.net",
          port: 587,
          secure: false,
          auth: {
            user: "apikey",
            pass: process.env.SENDGRID_API_KEY,
          },
        });
        console.log("📧 Using SendGrid for emails");
      } else {
        transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
          tls: { rejectUnauthorized: false },
          connectionTimeout: 10000,
        });
        console.log("📧 Using Gmail for emails");
      }
    } catch (error) {
      console.error("❌ Failed to create email transporter:", error.message);
      throw error;
    }
  }
  return transporter;
};

const sendEmail = async (to, subject, html, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const transporter = getTransporter();
      
      const from = process.env.SENDGRID_API_KEY
        ? "ShopHub <noreply@shophub.com>"
        : process.env.EMAIL_USER;

      await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      console.log(`✅ Email sent to ${to}`); // Fixed: parentheses not backticks
      return true;
    } catch (error) {
      console.error(`❌ Attempt ${attempt}/${retries} failed: ${error.message}`); // Fixed
      
      if (attempt === retries) {
        throw new Error(`Failed to send email: ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
};

export const emailService = {
  async sendOtpEmail(email, otp) {
    try {
      return await sendEmail(email, "Email Verification - ShopHub", EMAIL_TEMPLATES.OTP(otp));
    } catch (error) {
      console.error("Failed to send OTP email:", error.message);
      throw error;
    }
  },
  
  async sendPasswordResetEmail(user, resetToken) {
    try {
      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
      return await sendEmail(user.email, "Password Reset Request - ShopHub", EMAIL_TEMPLATES.PASSWORD_RESET(user.name, resetUrl));
    } catch (error) {
      console.error("Failed to send password reset email:", error.message);
      throw error;
    }
  },
  
  async sendPasswordChangeConfirmation(user) {
    try {
      await sendEmail(user.email, "Password Changed Successfully - ShopHub", EMAIL_TEMPLATES.PASSWORD_CHANGED(user.name));
      return true;
    } catch (error) {
      console.warn("Confirmation email failed but password was changed");
      return false;
    }
  },
  
  async sendContactEmails(contactData) {
    try {
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
      
      await sendEmail(
        contactData.email,
        "We received your message - ShopHub",
        EMAIL_TEMPLATES.CONTACT_USER(contactData.firstName, contactData.subject)
      );
      
      return true;
    } catch (error) {
      console.error("Failed to send contact emails:", error.message);
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
      console.error("Failed to send contact reply:", error.message);
      throw error;
    }
  },
};
