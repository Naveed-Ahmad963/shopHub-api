// src/services/emailService.js
import nodemailer from "nodemailer";
import { EMAIL_TEMPLATES } from "../constants/emailTemplates.js";
import { logger } from "../utils/logger.js";

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    // Check if SendGrid is configured
    if (process.env.SENDGRID_API_KEY) {
      transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        secure: false,
        auth: {
          user: "apikey", // literally "apikey"
          pass: process.env.SENDGRID_API_KEY,
        },
      });
      logger.info("📧 Using SendGrid for emails");
    } else {
      // Fallback to Gmail
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
      logger.info("📧 Using Gmail for emails");
    }
  }
  return transporter;
};

const sendEmail = async (to, subject, html, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const transporter = getTransporter();
      
      // Use SendGrid sender or Gmail
      const from = process.env.SENDGRID_API_KEY
        ? "ShopHub <noreply@shophub.com>"
        : process.env.EMAIL_USER;

      await transporter.sendMail({
        from,
        to,
        subject,
        html,
      });

      logger.success(`✅ Email sent to ${to}`);
      return true;
    } catch (error) {
      logger.error(`❌ Attempt ${attempt}/${retries} failed: ${error.message}`);
      
      if (attempt === retries) {
        throw new Error(`Failed to send email: ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
};

export const emailService = {
  async sendOtpEmail(email, otp) {
    return sendEmail(email, "Email Verification - ShopHub", EMAIL_TEMPLATES.OTP(otp));
  },
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    return sendEmail(user.email, "Password Reset Request - ShopHub", EMAIL_TEMPLATES.PASSWORD_RESET(user.name, resetUrl));
  },
  async sendPasswordChangeConfirmation(user) {
    try {
      await sendEmail(user.email, "Password Changed Successfully - ShopHub", EMAIL_TEMPLATES.PASSWORD_CHANGED(user.name));
      return true;
    } catch (error) {
      logger.warn("Confirmation email failed but password was changed");
      return false;
    }
  },
  async sendContactEmails(contactData) {
    await sendEmail(process.env.ADMIN_EMAIL, `New Contact Form: ${contactData.subject}`, EMAIL_TEMPLATES.CONTACT_ADMIN(contactData.firstName, contactData.lastName, contactData.email, contactData.phone, contactData.subject, contactData.message));
    await sendEmail(contactData.email, "We received your message - ShopHub", EMAIL_TEMPLATES.CONTACT_USER(contactData.firstName, contactData.subject));
    return true;
  },
  async sendContactReply(contact, reply) {
    return sendEmail(contact.email, `Re: ${contact.subject}`, EMAIL_TEMPLATES.CONTACT_REPLY(contact.firstName, contact.subject, reply));
  },
};
