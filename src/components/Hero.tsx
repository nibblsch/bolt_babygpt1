import React from 'react';
import { ArrowRight, Brain, Clock, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Hero() {
  const { signIn } = useAuth();

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your Personal AI-Powered Parenting Expert
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Get instant, reliable answers to all your parenting questions - from feeding schedules to sleep training. Available 24/7.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
              onClick={() => signIn()}
              className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get Started Now <ArrowRight className="ml-2 inline-block h-5 w-5" />
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500">Sign-ups are currently limited</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col items-center">
            <Brain className="h-12 w-12 text-indigo-600" />
            <h3 className="mt-4 text-lg font-semibold">Evidence-Based Guidelines</h3>
          </div>
          <div className="flex flex-col items-center">
            <Shield className="h-12 w-12 text-indigo-600" />
            <h3 className="mt-4 text-lg font-semibold">Pediatrician-Reviewed</h3>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="h-12 w-12 text-indigo-600" />
            <h3 className="mt-4 text-lg font-semibold">24/7 Availability</h3>
          </div>
        </div>
      </div>
    </div>
  );
}