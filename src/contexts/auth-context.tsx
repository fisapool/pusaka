
// src/contexts/auth-context.tsx
"use client";

import * as React from 'react';
// Firebase User type is no longer needed as we are removing authentication
// import type { User } from 'firebase/auth'; 
// Firebase auth and related imports are no longer needed
// import { auth } from '@/lib/firebase';
// import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';
// import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: null; // User will always be null
  loading: boolean; // Loading will always be false
  signInWithGoogle: () => Promise<void>; // Will be a no-op
  signOut: () => Promise<void>; // Will be a no-op
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // User state is no longer managed
  // const [user, setUser] = React.useState<User | null>(null);
  // const [loading, setLoading] = React.useState(true);

  // useEffect for onAuthStateChanged is removed
  // React.useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser);
  //     setLoading(false);
  //   });
  //   return () => unsubscribe();
  // }, []);

  const signInWithGoogle = async () => {
    console.warn("Authentication has been removed. signInWithGoogle is a no-op.");
    // setLoading(true);
    // try {
    //   const provider = new GoogleAuthProvider();
    //   await signInWithPopup(auth, provider);
    // } catch (error) {
    //   console.error("Detailed error during signInWithGoogle:", error);
    // }
  };

  const signOut = async () => {
    console.warn("Authentication has been removed. signOut is a no-op.");
    // setLoading(true);
    // try {
    //   await firebaseSignOut(auth);
    // } catch (error) {
    //   console.error("Error signing out:", error);
    // }
  };
  
  return (
    <AuthContext.Provider value={{ user: null, loading: false, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    // This error might still occur if AuthProvider is not wrapping the component calling useAuth
    // However, we are removing AuthProvider from the root layout.
    // If any component still tries to useAuth, it will get default values.
    // A more robust removal might involve removing useAuth calls or providing a default non-functional context.
    // For this pass, we'll keep the hook but it will return a non-authenticated state.
     console.warn('useAuth called outside of AuthProvider, or AuthProvider was removed. Returning default non-authenticated state.');
     return { user: null, loading: false, signInWithGoogle: async () => {}, signOut: async () => {} };
  }
  return context;
}
