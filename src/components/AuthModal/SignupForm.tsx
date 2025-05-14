import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { posthog } from '../../lib/posthog';
import { stripe } from '../../lib/stripe';
import { Check, X } from 'lucide-react';
import zxcvbn from 'zxcvbn';

interface SignupFormProps {
  step: 'initial' | 'details' | 'checkout';
  setStep: (step: 'initial' | 'details' | 'checkout') => void;
  selectedPlan?: string;
  onClose: () => void;
}

export function SignupForm({ step, setStep, selectedPlan, onClose }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [plan, setPlan] = useState(selectedPlan || 'monthly');
  const [loading, setLoading] = useState(false);

  const passwordScore = zxcvbn(password);

  const getPasswordStrengthColor = () => {
    switch (passwordScore.score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordScore.score < 2) {
      toast.error('Please choose a stronger password');
      return;
    }

    setLoading(true);
    posthog.capture('signup_step', { step: 'initial' });

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      setStep('details');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    posthog.capture('signup_step', { step: 'details' });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: user.id,
            full_name: fullName,
            child_age_months: parseInt(childAge),
            selected_plan: plan
          }
        ]);

      if (error) throw error;
      setStep('checkout');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to save details');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    posthog.capture('signup_step', { step: 'checkout' });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const stripeInstance = await stripe;
      if (!stripeInstance) throw new Error('Stripe failed to initialize');

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan === 'monthly' ? 'prod_RkcmFAgddLLJfn' : 'prod_RkcnX78pXVNKpu',
          userId: user.id,
          customerName: fullName,
        }),
      });

      const { sessionId } = await response.json();
      const { error } = await stripeInstance.redirectToCheckout({ sessionId });
      
      if (error) throw error;
      
      posthog.capture('signup_step', { step: 'checkout_complete' });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'initial') {
    return (
      <form onSubmit={handleInitialSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
          <div className="mt-2 h-2 rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all ${getPasswordStrengthColor()}`}
              style={{ width: `${(passwordScore.score + 1) * 25}%` }}
            />
          </div>
          {password && passwordScore.score < 2 && (
            <p className="mt-1 text-sm text-red-600">
              Password should contain at least 8 characters, including numbers and special characters
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    );
  }

  if (step === 'details') {
    return (
      <form onSubmit={handleDetailsSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="childAge" className="block text-sm font-medium text-gray-700">
            Child's Age (in months)
          </label>
          <input
            type="number"
            id="childAge"
            value={childAge}
            onChange={(e) => setChildAge(e.target.value)}
            min="0"
            max="120"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subscription Plan
          </label>
          <div className="mt-2 space-y-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="monthly"
                checked={plan === 'monthly'}
                onChange={(e) => setPlan(e.target.value)}
                className="form-radio text-indigo-600"
              />
              <span className="ml-2">Monthly ($29.99/month)</span>
            </label>
            <br />
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="annual"
                checked={plan === 'annual'}
                onChange={(e) => setPlan(e.target.value)}
                className="form-radio text-indigo-600"
              />
              <span className="ml-2">Annual ($23.99/month - Save 20%)</span>
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Continue to Payment'}
        </button>
      </form>
    );
  }

  return (
    <div className="text-center">
      <p className="mb-4">Ready to complete your subscription?</p>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </div>
  );
}