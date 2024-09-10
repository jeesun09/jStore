import Stripe from "stripe";
import "dotenv/config.js";
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
