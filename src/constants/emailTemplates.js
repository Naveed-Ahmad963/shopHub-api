// src/constants/emailTemplates.js
// ============================================
export const EMAIL_TEMPLATES = {
  OTP: (otp) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px solid #667eea; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 4px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>🔐 Email Verification</h1></div>
        <div class="content">
          <h2>Verify Your Email Address</h2>
          <p>Use this OTP to complete verification:</p>
          <div class="otp-box">
            <p style="margin: 0; color: #999; font-size: 14px;">Enter this code:</p>
            <div class="otp-code">${otp}</div>
          </div>
          <div class="warning">
            <strong>⏰ Important:</strong> This OTP will expire in <strong>10 minutes</strong>.
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">Never share this OTP with anyone.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ShopHub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  PASSWORD_RESET: (name, resetUrl) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>🔐 Password Reset Request</h1></div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>You requested to reset your password. Click below to create a new one:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset My Password</a>
          </div>
          <div class="warning">
            <strong>⏰ Important:</strong> This link expires in <strong>15 minutes</strong>.
          </div>
          <p>If the button doesn't work, copy this link:<br><span style="word-break: break-all; color: #667eea;">${resetUrl}</span></p>
          <p><strong>Didn't request this?</strong> You can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ShopHub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  PASSWORD_CHANGED: (name) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .success { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px; color: #155724; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>✅ Password Changed Successfully</h1></div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <div class="success">
            <strong>Success!</strong> Your password has been changed successfully.
          </div>
          <p>You can now log in with your new password.</p>
          <p><strong>Didn't make this change?</strong> Contact support immediately at ${
            process.env.ADMIN_EMAIL
          }</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ShopHub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  CONTACT_ADMIN: (firstName, lastName, email, phone, subject, message) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 3px solid #667eea; padding-bottom: 10px;">New Contact Form Submission</h2>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <p><strong>Subject:</strong> ${subject}</p>
      </div>
      <div style="background-color: #fff3cd; padding: 20px; border-left: 4px solid #ffc107; border-radius: 4px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Message:</h3>
        <p style="line-height: 1.6; color: #555; white-space: pre-wrap;">${message}</p>
      </div>
      <p style="color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
        Received on: ${new Date().toLocaleString()}
      </p>
    </div>
  `,

  CONTACT_USER: (firstName, subject) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #667eea;">Thank You for Contacting ShopHub!</h2>
      <p>Hi ${firstName},</p>
      <p>We have received your message and appreciate you reaching out to us. Our team will review your inquiry and get back to you soon.</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Your Reference:</strong></p>
        <p style="color: #667eea; font-size: 14px;">Subject: ${subject}</p>
      </div>
      <p>If you have any additional information, feel free to reply to this email.</p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        Best regards,<br>ShopHub Support Team<br>support@shophub.com
      </p>
    </div>
  `,

  CONTACT_REPLY: (firstName, subject, reply) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #667eea;">Response to Your Inquiry</h2>
      <p>Hi ${firstName},</p>
      <p>Thank you for contacting ShopHub. Here's our response:</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-left: 4px solid #667eea; border-radius: 4px; margin: 20px 0;">
        <p style="line-height: 1.6; color: #555; white-space: pre-wrap;">${reply}</p>
      </div>
      <p>If you have further questions, feel free to reply to this email.</p>
      <p style="color: #999; font-size: 12px; margin-top: 30px;">
        Best regards,<br>ShopHub Support Team
      </p>
    </div>
  `,
};
