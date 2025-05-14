import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { supabase } from '../lib/supabase';
import { stripe } from '../lib/stripe';
import { posthog } from '../lib/posthog';
import toast from 'react-hot-toast';
import zxcvbn from 'zxcvbn';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: string | null;
}

export function AuthModal({ isOpen, onClose, selectedPlan }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'credentials' | 'details'>('credentials');
  const [fullName, setFullName] = useState('');
  const [childAge, setChildAge] = useState('');

  const passwordScore = zxcvbn(password);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordScore.score < 2) {
      toast.error('Please choose a stronger password');
      return;
    }

    setLoading(true);
    posthog.capture('signup_started', { selectedPlan });

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            child_age: childAge,
            selected_plan: selectedPlan
          }
        }
      });

      if (error) throw error;

      if (selectedPlan) {
        const stripeInstance = await stripe;
        if (!stripeInstance) throw new Error('Stripe failed to initialize');

        const priceId = selectedPlan.toLowerCase() === 'monthly' 
          ? 'prod_RkcmFAgddLLJfn' 
          : 'prod_RkcnX78pXVNKpu';

        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceId,
            email,
            name: fullName
          }),
        });

        const { sessionId } = await response.json();
        await stripeInstance.redirectToCheckout({ sessionId });
      }

      toast.success('Account created successfully!');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  {step === 'credentials' ? 'Create your account' : 'Complete your profile'}
                </Dialog.Title>

                <form onSubmit={handleSignUp} className="space-y-4">
                  {step === 'credentials' ? (
                    <>
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
                            Password should be at least 8 characters with numbers and special characters
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep('details')}
                        disabled={!email || !password || passwordScore.score < 2}
                        className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                      >
                        Continue
                      </button>
                    </>
                  ) : (
                    <>
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
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => setStep('credentials')}
                          className="flex-1 rounded-md bg-gray-100 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-100"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={loading || !fullName || !childAge}
                          className="flex-1 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                        >
                          {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}