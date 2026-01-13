// src/services/paymentService.js
// ============================================
import Stripe from "stripe";
import { logger } from "../utils/logger.js";

let stripeInstance = null;

const getStripe = () => {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_SECRET_KEY;

    if (!apiKey) {
      logger.error("STRIPE_SECRET_KEY is not defined in environment variables");
      throw new Error(
        "STRIPE_SECRET_KEY is not defined. Please add it to your .env file: STRIPE_SECRET_KEY=sk_test_..."
      );
    }

    stripeInstance = new Stripe(apiKey);
  }
  return stripeInstance;
};

export const paymentService = {
  async createPaymentIntent(amount, orderId, userId, currency = "usd") {
    try {
      const stripe = getStripe();

      // Convert amount to cents (Stripe requires smallest currency unit)
      const amountInCents = Math.round(amount * 100);

      // IMPORTANT: All metadata values MUST be strings
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: currency.toLowerCase(),
        metadata: {
          orderId: String(orderId), // Convert to string
          userId: String(userId), // Convert to string
        },
        automatic_payment_methods: { enabled: true },
      });

      logger.success(`Payment intent created: ${paymentIntent.id}`);
      return paymentIntent;
    } catch (err) {
      logger.error(`Payment intent creation failed: ${err.message}`);
      throw new Error(`Failed to create payment intent: ${err.message}`);
    }
  },

  async verifyPaymentIntent(paymentIntentId) {
    try {
      const stripe = getStripe();
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );
      logger.success(`Payment intent verified: ${paymentIntentId}`);
      return paymentIntent;
    } catch (err) {
      logger.error(`Payment intent verification failed: ${err.message}`);
      throw new Error(`Failed to verify payment intent: ${err.message}`);
    }
  },

  async handleWebhookEvent(event) {
    try {
      switch (event.type) {
        case "payment_intent.succeeded":
          logger.success(`Payment succeeded: ${event.data.object.id}`);
          return await this.handlePaymentSucceeded(event.data.object);

        case "payment_intent.payment_failed":
          logger.error(`Payment failed: ${event.data.object.id}`);
          return await this.handlePaymentFailed(event.data.object);

        default:
          logger.warn(`Unhandled event type: ${event.type}`);
          return null;
      }
    } catch (err) {
      logger.error(`Webhook handling error: ${err.message}`);
      throw err;
    }
  },

  async handlePaymentSucceeded(paymentIntent) {
    logger.success(`Payment succeeded: ${paymentIntent.id}`);
    // Update order status if needed
    return paymentIntent;
  },

  async handlePaymentFailed(paymentIntent) {
    logger.error(`Payment failed: ${paymentIntent.id}`);
    // Update order status if needed
    return paymentIntent;
  },
};
