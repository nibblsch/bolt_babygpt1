import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { stripe } from '../lib/stripe';
import toast from 'react-hot-toast';

const plans = [
  {
    name: 'Monthly',
    price: '$29.99',
    period: '/month',
    priceId: 'prod_RkcmFAgddLLJfn',
    features: [
      'Unlimited AI consultations',
      '24/7 availability',
      'Research-backed answers',
      'Cancel anytime'
    ]
  },
  {
    name: 'Annual',
    price: '$23.99',
    period: '/month',
    priceId: 'prod_RkcnX78pXVNKpu',
    badge: 'Best Value',
    discount: 'Save 20%',
    features: [
      'All Monthly features',
      'Priority support',
      'Exclusive content',
      'Personalized insights'
    ]
  }
];

export function Pricing() {
  const { user, signIn } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, planName: string) => {
    if (!user) {
      signIn(planName);
      return;
    }

    try {
      setLoading(priceId);
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
        }),
      });

      const { sessionId } = await response.json();
      const stripeInstance = await stripe;
      
      if (!stripeInstance) {
        throw new Error('Stripe failed to initialize');
      }

      const { error } = await stripeInstance.redirectToCheckout({ sessionId });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to start subscription. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div id="pricing" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            30-Day Money-Back Guarantee - Love it or get a full refund
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="relative flex flex-col rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200"
            >
              {plan.badge && (
                <div className="absolute -top-4 right-8 rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold text-white">
                  {plan.badge}
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-lg font-semibold leading-8 text-gray-900">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-lg font-semibold leading-8 text-gray-600">
                    {plan.period}
                  </span>
                </div>
                {plan.discount && (
                  <p className="mt-2 text-sm text-indigo-600">{plan.discount}</p>
                )}
              </div>
              <ul className="space-y-4 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-indigo-600 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.priceId, plan.name)}
                disabled={loading === plan.priceId}
                className="mt-8 block w-full rounded-md bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === plan.priceId ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  'Get Started'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}