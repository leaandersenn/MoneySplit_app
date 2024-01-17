import React, { createContext, useContext, useEffect, useState } from "react";
import { FIREBASE_AUTH, db } from "../../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseUser, UserContextType } from "../types";
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  error: "",
  signInUser: async () => {},
  registerUser: async () => {},
  logoutUser: async () => {},
  forgotPassword: async () => {},
});

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }: any) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  WebBrowser.maybeCompleteAuthSession();

  // Listen to the Firebase Auth state and set the user
  useEffect(() => {
    const unsubscribe = onFirebaseAuthStateChanged(FIREBASE_AUTH, (authUser) => {
      setUser(authUser);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

  // Function to register a new user
  const registerUser = async ({ email, password, firstName, lastName }: any) => {
    setLoading(true);
    try {
      console.log("Inne i registerUser");
      const userCredentials = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const authUser = userCredentials.user;
      await setDoc(doc(db, "Users", authUser.uid), {
        email,
        firstName,
        lastName
      });
      console.log(authUser);
      console.log("sjekk databasen da HORE")
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to sign in a user
  const signInUser = async ({ email, password }: any) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to sign out a user
  const logoutUser = async () => {
    setLoading(true);
    try {
      await signOut(FIREBASE_AUTH);
    } catch (error: any) {
      setError(error.message);
    } finally {
        setLoading(false);
    }
  };

  // Function to handle forgotten password
  const forgotPassword = async ({ email }: any) => {
    try {
      await sendPasswordResetEmail(FIREBASE_AUTH, email);
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (initializing) return null;

  const contextValue = {
    user,
    loading,
    error,
    signInUser,
    registerUser,
    logoutUser,
    forgotPassword,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};