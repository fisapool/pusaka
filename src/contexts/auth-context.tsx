
// src/contexts/auth-context.tsx
"use client";

import * as React from 'react';
import type { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
import { Button } from '@/components/ui/button'; // For potential direct use or styling reference
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle setting the user
    } catch (error) {
      console.error("Detailed error during signInWithGoogle:", error); // Added more detailed logging
      // Optionally, show a toast message to the user.
      // For example, if using a toast system like the one in this app:
      // import { toast } from '@/hooks/use-toast';
      // toast({
      //   title: "Sign-in Error",
      //   description: (error as Error).message || "Could not sign in with Google. Please check console for details.",
      //   variant: "destructive",
      // });
    } finally {
      // setLoading(false); // onAuthStateChanged will set loading to false after user state is updated
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will handle setting user to null
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
       // setLoading(false); // onAuthStateChanged will set loading to false
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
