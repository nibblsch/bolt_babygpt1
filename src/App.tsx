import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Testimonials } from './components/Testimonials';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { MedicalDisclaimer } from './components/MedicalDisclaimer';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './hooks/useAuth';

function App() {
  const { showAuthModal, setShowAuthModal, signIn, signOut  } = useAuth();

  return (
    <div className="min-h-screen bg-white pt-16">
      <Toaster position="top-center" />
      <Header />
      <main>
        <section id="hero">
          <Hero />
        </section>
        <section id="features">
          <Features />
        </section>
        <section id="testimonials">
          <Testimonials />
        </section>
        <section id="pricing">
          <Pricing />
        </section>
        <section id="faq">
          <FAQ />
        </section>
        <MedicalDisclaimer />
      </main>
      <button onClick={signIn} className="bg-blue-500 text-white p-2 rounded-md">
        Sign In
      </button>

      <button onClick={signOut} className="bg-red-500 text-white p-2 rounded-md ml-4">
        Sign Out
      </button>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

export default App;