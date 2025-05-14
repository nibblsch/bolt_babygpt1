import React from 'react';
import { Menu, X } from 'lucide-react';
import { Disclosure } from '@headlessui/react';
import { useAuth } from '../hooks/useAuth';

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'FAQ', href: '#faq' },
];

export function Header() {
  const { user, signIn, signOut } = useAuth();

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState({}, '', href);
    }
  };

  return (
    <Disclosure as="nav" className="bg-white shadow-sm fixed w-full top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <a href="/" className="text-2xl font-bold text-indigo-600">
                    BabyGPT
                  </a>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => scrollToSection(e, item.href)}
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {user ? (
                  <button
                    onClick={signOut}
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                ) : (
                  <button
                    onClick={signIn}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    Sign in
                  </button>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(e, item.href);
                  }}
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              {user ? (
                <Disclosure.Button
                  as="button"
                  onClick={signOut}
                  className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                >
                  Sign out
                </Disclosure.Button>
              ) : (
                <Disclosure.Button
                  as="button"
                  onClick={signIn}
                  className="block w-full px-4 py-2 text-left text-base font-medium text-indigo-600 hover:bg-gray-50"
                >
                  Sign in
                </Disclosure.Button>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}