// src/services/emailService.js (REFACTORED)
// ============================================
import nodemailer from "nodemailer";
import { EMAIL_TEMPLATES } from "../constants/emailTemplates.js";
import { logger } from "../utils/logger.js";

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  return transporter;
};

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    logger.success(`Email sent to ${to}`);
    return true;
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export const emailService = {
  async sendOtpEmail(email, otp) {
    return sendEmail(
      email,
      "Email Verification - ShopHub",
      EMAIL_TEMPLATES.OTP(otp)
    );
  },

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    return sendEmail(
      user.email,
      "Password Reset Request - ShopHub",
      EMAIL_TEMPLATES.PASSWORD_RESET(user.name, resetUrl)
    );
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
      logger.warn("Confirmation email failed but password was changed");
      return false;
    }
  },

  async sendContactEmails(contactData) {
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
  },

  async sendContactReply(contact, reply) {
    return sendEmail(
      contact.email,
      `Re: ${contact.subject}`,
      EMAIL_TEMPLATES.CONTACT_REPLY(contact.firstName, contact.subject, reply)
    );
  },
};
