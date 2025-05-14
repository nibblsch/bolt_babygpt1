import React from 'react';

const testimonials = [
  {
    quote: "What I love most about BabyGPT is that it's backed by actual scientific research, not random internet advice. As a first-time mom, knowing the answers come from pediatric studies gives me peace of mind.",
    author: "Sarah Johnson",
    role: "Mom of 2-month-old",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    quote: "I was skeptical about using AI for parenting advice, but BabyGPT has been a lifesaver during those 3 AM feeding questions. It's like having a pediatrician and experienced parent on call 24/7.",
    author: "Michael Chen",
    role: "Dad of 6-month-old twins",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    quote: "The cost worried me at first, but BabyGPT has saved us countless pediatrician visits for minor concerns. It helps us know when something's normal and when we actually need to see a doctor.",
    author: "Emily Rodriguez",
    role: "Mom of 9-month-old",
    image: "https://images.unsplash.com/photo-1623782750020-ae60c2512d7c?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

export function Testimonials() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by 1,000+ Parents
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Evidence-Based Parenting Support
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.author} className="flex flex-col justify-between bg-white p-6 shadow-lg ring-1 ring-gray-200 rounded-2xl">
              <blockquote className="text-gray-700">
                "{testimonial.quote}"
              </blockquote>
              <div className="mt-6 flex items-center gap-x-4">
                <img
                  className="h-12 w-12 rounded-full bg-gray-50"
                  src={testimonial.image}
                  alt=""
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}