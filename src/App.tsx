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
  const { showAuthModal, setShowAuthModal, selectedPlan } = useAuth();

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
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        selectedPlan={selectedPlan}
      />
    </div>
  );
}

export default App;