import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Disclosure, Transition } from '@headlessui/react';

const faqs = [
  {
    question: 'Is BabyGPT a replacement for medical advice?',
    answer: 'No, BabyGPT is not a replacement for professional medical care. While we provide evidence-based guidance for common parenting questions, you should always consult your pediatrician for medical concerns. We help you make informed decisions and know when to seek professional medical attention.'
  },
  {
    question: 'How accurate is the advice from BabyGPT?',
    answer: 'All advice provided by BabyGPT is based on peer-reviewed pediatric research and clinical guidelines. Our content is regularly reviewed by practicing pediatricians and child development experts. We maintain strict standards for accuracy and only provide information backed by scientific evidence.'
  },
  {
    question: 'What if I\'m not satisfied with the service?',
    answer: 'We offer a 30-day money-back guarantee. If you\'re not completely satisfied with BabyGPT, simply contact our support team within 30 days of your purchase for a full refund, no questions asked.'
  },
  {
    question: 'How does the subscription work?',
    answer: 'You can choose between monthly or annual billing. The subscription gives you unlimited access to BabyGPT\'s AI parenting assistant. You can cancel anytime, and with our 30-day money-back guarantee, there\'s no risk in trying the service.'
  },
  {
    question: 'Is my data secure and private?',
    answer: 'Yes, we take data privacy very seriously. All communications are encrypted, and we never share your personal information with third parties. We comply with HIPAA guidelines and other relevant privacy regulations to ensure your data remains secure and confidential.'
  },
  {
    question: 'Can I use BabyGPT on multiple devices?',
    answer: 'Yes, your subscription allows you to access BabyGPT from any device - smartphone, tablet, or computer. Simply log in to your account to get instant access to our AI parenting assistant, wherever you are.'
  }
];

export function FAQ() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-16">
            Frequently Asked Questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                        <span className="text-base font-semibold leading-7">
                          {faq.question}
                        </span>
                        <span className="ml-6 flex h-7 items-center">
                          <ChevronDown
                            className={`h-6 w-6 transform ${
                              open ? 'rotate-180' : ''
                            } text-gray-600`}
                            aria-hidden="true"
                          />
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Disclosure.Panel as="dd" className="mt-2 pr-12">
                        <p className="text-base leading-7 text-gray-600">
                          {faq.answer}
                        </p>
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}