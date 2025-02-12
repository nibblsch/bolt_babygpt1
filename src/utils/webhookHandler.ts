// src/utils/stripeWebhookHandler.ts
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Initialize Supabase client with service role
const supabase = createClient(
  process.env.SUPABASE_URL!, 
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Main webhook event handler
export async function handleStripeWebhook(webhookEvent: Stripe.Event) {
  // Log the event type for debugging
  console.log(`Processing webhook event: ${webhookEvent.type}`);

  // Handle different Stripe event types
  switch (webhookEvent.type) {
    case 'checkout.session.completed':
      const session = webhookEvent.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
      break;

    case 'customer.subscription.created':
      const subscription = webhookEvent.data.object as Stripe.Subscription;
      await handleSubscriptionCreated(subscription);
      break;

    case 'customer.subscription.updated':
      const updatedSubscription = webhookEvent.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(updatedSubscription);
      break;

    default:
      console.log(`Unhandled event type: ${webhookEvent.type}`);
  }
}

// Handle completed checkout session
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id;
  const customerId = session.customer as string;

  if (!userId) {
    console.warn('No user ID found in checkout session');
    return;
  }

  // Update user's subscription status
  const { error: userUpdateError } = await supabase
    .from('users')
    .update({ 
      stripe_customer_id: customerId,
      subscription_status: 'active'
    })
    .eq('id', userId);

  if (userUpdateError) {
    console.error('Failed to update user subscription:', userUpdateError);
  }

  // Insert subscription record
  const { error: subscriptionError } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: session.subscription as string,
      status: 'active',
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });

  if (subscriptionError) {
    console.error('Failed to create subscription record:', subscriptionError);
  }
}

// Handle new subscription creation
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const status = subscription.status;

  // Retrieve user ID associated with the customer
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (userError || !userData) {
    console.error('Could not find user for customer ID:', customerId);
    return;
  }

  // Insert new subscription record
  const { error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userData.id,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      status: status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000)
    });

  if (error) {
    console.error('Failed to create subscription record:', error);
  }
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const status = subscription.status;

  // Update existing subscription record
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000)
    })
    .eq('stripe_customer_id', customerId);

  if (error) {
    console.error('Failed to update subscription record:', error);
  }
}
