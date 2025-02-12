// src/services/stripeClientService.ts
import { stripe } from '../lib/stripe';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

// Define types for better type safety
interface SubscriptionPlan {
  priceId: string;
  name: string;
  price: number;
}

export class StripeService {
  // Main method to handle subscription checkout
  static async initiateCheckout(
    user: { id: string; email?: string }, 
    priceId: string
  ) {
    // Validate user and price ID
    if (!user || !priceId) {
      toast.error('Invalid subscription details');
      return null;
    }

    try {
      // Create checkout session via backend API
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          email: user.email,
        }),
      });

      // Handle API response errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Checkout failed');
      }

      // Extract session ID from response
      const { sessionId } = await response.json();

      // Initialize Stripe and redirect to checkout
      const stripeInstance = await stripe;
      if (!stripeInstance) {
        throw new Error('Stripe failed to initialize');
      }

      // Redirect to Stripe Checkout
      const { error } = await stripeInstance.redirectToCheckout({ sessionId });
      
      // Handle Stripe redirect errors
      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      // Log and display user-friendly error
      console.error('Subscription initiation error:', error);
      toast.error('Failed to start subscription. Please try again.');
      return null;
    }
  }

  // Method to check user's current subscription status
  static async checkSubscriptionStatus(userId: string) {
    try {
      // Fetch subscription status from Supabase
      const { data, error } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return {
        isActive: data?.status === 'active',
        endsAt: data?.current_period_end 
          ? new Date(data.current_period_end) 
          : null
      };
    } catch (error) {
      console.error('Subscription status check failed:', error);
      return null;
    }
  }

  // Available subscription plans
  static plans: SubscriptionPlan[] = [
    {
      priceId: 'price_monthly',
      name: 'Monthly Plan',
      price: 29.99
    },
    {
      priceId: 'price_annual',
      name: 'Annual Plan',
      price: 23.99
    }
  ];
}
