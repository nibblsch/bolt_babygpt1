import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { SignupForm } from './SignupForm';
import { posthog } from '../../lib/posthog';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: string;
}

export function AuthModal({ isOpen, onClose, selectedPlan }: AuthModalProps) {
  const [step, setStep] = useState<'initial' | 'details' | 'checkout'>('initial');

  React.useEffect(() => {
    if (isOpen) {
      posthog.capture('signup_step', { step: 'start_signup' });
    }
  }, [isOpen]);

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
                  {step === 'initial' ? 'Create your account' : 
                   step === 'details' ? 'Personal Details' :
                   'Payment Information'}
                </Dialog.Title>
                <SignupForm 
                  step={step}
                  setStep={setStep}
                  selectedPlan={selectedPlan}
                  onClose={onClose}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}