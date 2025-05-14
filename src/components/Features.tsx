import React from 'react';
import { Check, X } from 'lucide-react';

export function Features() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            From Anxious to Confident
          </h2>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-0">
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-6">Before BabyGPT</h3>
              <ul className="space-y-4">
                {[
                  'Late-night Google spirals',
                  'Conflicting advice from forums',
                  'Waiting for pediatrician calls',
                  'Information overload',
                  'Stress and uncertainty',
                ].map((item) => (
                  <li key={item} className="flex items-center text-black">
                    <X className="h-5 w-5 text-red-500 font-bold mr-2" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-6">With BabyGPT</h3>
              <ul className="space-y-4">
                {[
                  'Instant, reliable answers',
                  'Research-backed guidance',
                  '24/7 peace of mind',
                  'Clear, actionable advice',
                  'Confident parenting decisions',
                ].map((item) => (
                  <li key={item} className="flex items-center text-black">
                    <Check className="h-5 w-5 text-green-500 font-bold mr-2" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}