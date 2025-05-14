import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const signIn = (plan?: string) => {
    setSelectedPlan(plan || null);
    setShowAuthModal(true);
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN') {
        setShowAuthModal(false);
        toast.success('Successfully signed in');
      } else if (event === 'SIGNED_OUT') {
        toast.success('Successfully signed out');
      }
    });

    checkSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    loading,
    showAuthModal,
    setShowAuthModal,
    selectedPlan,
    setSelectedPlan,
    signIn,
    signOut
  };
}