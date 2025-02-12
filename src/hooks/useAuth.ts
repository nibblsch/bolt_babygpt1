import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const signIn = () => {
    console.log('signIn method called');
    console.log('Current showAuthModal state:', showAuthModal);
    setShowAuthModal(true);
    console.log('AuthModal should now be visible');
  };

  const signOut = async () => {
    console.log('signOut method called');
    setLoading(true);
    
  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        
        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            toast.success('Successfully signed in');
            setShowAuthModal(false);
            break;
          case 'SIGNED_OUT':
            toast.success('Successfully signed out');
            break;
          case 'SIGN_IN_ERROR':
            toast.error('Error signing in');
            break;
        }
      }
    );

    checkSession();

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('User successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    showAuthModal,
    setShowAuthModal,
    signIn,
    signOut
  };
}