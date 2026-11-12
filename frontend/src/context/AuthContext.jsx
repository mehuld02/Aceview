// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Provide both the user and the loading state
  const value = {
    user,
    loading, // <-- FIX 1
  };

  return (
    <AuthContext.Provider value={value}>
      {children} {/* <-- FIX 2 */}
    </AuthContext.Provider>
  );
}