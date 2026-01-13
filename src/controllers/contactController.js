// src/controllers/contactController.js (REFACTORED)
// ============================================
import Contact from "../models/contactModel.js";
import asyncHandler from "express-async-handler";
import {
  validateEmail,
  validateMessage,
  validateRequiredFields,
} from "../utils/validators.js";
import { sendSuccess, sendError } from "../utils/responses.js";
import { emailService } from "../services/emailService.js";
import { MESSAGES } from "../constants/messages.js";

export const submitContactForm = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, subject, message } = req.body;

  // Validate required fields
  validateRequiredFields({ firstName, lastName, email, subject, message }, [
    "firstName",
    "lastName",
    "email",
    "subject",
    "message",
  ]);

  const validatedEmail = validateEmail(email);
  validateMessage(message);

  const contact = await Contact.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: validatedEmail,
    phone: phone?.trim() || "",
    subject: subject.trim(),
    message: message.trim(),
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  // Send notification emails
  await emailService.sendContactEmails({
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    subject: contact.subject,
    message: contact.message,
  });

  sendSuccess(res, 201, MESSAGES.CONTACT.SUBMISSION_SUCCESS, {
    contactId: contact._id,
  });
});

export const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });

  sendSuccess(res, 200, "Contacts retrieved", {
    count: contacts.length,
    contacts,
  });
});

export const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return sendError(res, 404, MESSAGES.CONTACT.NOT_FOUND);
  }

  contact.status = "read";
  await contact.save();

  sendSuccess(res, 200, "Contact retrieved", { contact });
});

export const replyToContact = asyncHandler(async (req, res) => {
  const { reply } = req.body;
  validateRequiredFields({ reply }, ["reply"]);

  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return sendError(res, 404, MESSAGES.CONTACT.NOT_FOUND);
  }

  await emailService.sendContactReply(contact, reply);

  contact.reply = reply;
  contact.status = "replied";
  contact.repliedAt = Date.now();
  await contact.save();

  sendSuccess(res, 200, MESSAGES.CONTACT.REPLY_SENT, { contact });
});

export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    return sendError(res, 404, MESSAGES.CONTACT.NOT_FOUND);
  }

  sendSuccess(res, 200, "Contact deleted successfully");
});
