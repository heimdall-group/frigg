import env from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import Stripe from 'stripe';

import {
  stripe_handleSubscriptionCreated,
  stripe_handleSubscriptionUpdated,
  stripe_handleSubscriptionDeleted,
  stripe_handleInvoiceFailed,
  stripe_handleInvoicePaid,
  stripe_handleRequiresAction,
} from './functions/stripe.js';

env.config();

const stripe_api_key = process.env.STRIPE_SECRET_KEY;
const stripe_webhook_secret = process.env.STRIPE_WEBHOOK_SECRET_KEY;
const mongoose_key = process.env.MONGO_URL;
const port = process.env.SERVICES_WEBHOOKS_PORT;
const app = express();
const stripe = Stripe(stripe_api_key);

app.use((req, result, next) => {
    if (req.originalUrl === '/stripe') {
      next();
    } else {
      express.json()(req, result, next);
    }
  }
);

(async function() {
  try {
    await mongoose.connect(mongoose_key);
    console.log("DB connection true");
  } catch (err) {
    console.error("DB connection false", err);
  }
}());

app.post('/stripe',express.raw({ type: 'application/json' }), (req, result) => {
    let event = req.body;
    if (stripe_webhook_secret) {
      const signature = req.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          stripe_webhook_secret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return result.sendStatus(400);
      }
    }

  let subscription;
  let status;
  let customer;
  switch (event.type) {
    case 'customer.subscription.deleted':
      subscription = event.data.object;
      status = subscription.status;
      customer = event.data.object.customer;
      stripe_handleSubscriptionDeleted(subscription, customer);
      break;
    case 'customer.subscription.created':
      subscription = event.data.object;
      status = subscription.status;
      customer = event.data.object.customer;
      stripe_handleSubscriptionCreated(subscription, customer);
      break;
    case 'customer.subscription.updated':
      subscription = event.data.object;
      status = subscription.status;
      customer = event.data.object.customer;
      stripe_handleSubscriptionUpdated(subscription, customer);
      break;
    case 'invoice.paid':
      subscription = event.data.object;
      status = subscription.status;
      customer = event.data.object.customer;
      stripe_handleInvoicePaid(subscription, customer);
      break;
    case 'invoice.payment_action_required':
      subscription = event.data.object;
      status = subscription.status;
      customer = event.data.object.customer;
      stripe_handleRequiresAction(subscription, customer);
      break;
    case 'invoice.payment_failed':
      subscription = event.data.object;
      status = subscription.status;
      customer = event.data.object.customer;
      stripe_handleInvoiceFailed(subscription, customer);
      break;
  }
    result.send();
  }
);

app.listen(port, () => console.log('Running on port: ', port));