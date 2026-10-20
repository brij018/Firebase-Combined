import React, { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
} from "firebase/auth";
import { auth, googleAuthProvider } from "../config/firebase";
import authContext from "./auth-context";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = () => {
    return signInWithPopup(auth, googleAuthProvider);
  };

  const loginWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signupWithEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginAnonymouslyUser = () => {
    return signInAnonymously(auth);
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    loginAnonymouslyUser,
    logout,
  };

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export default AuthProvider;
