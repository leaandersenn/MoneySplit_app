import React, { createContext, useContext, useEffect, useState } from "react";
import { FIREBASE_AUTH, db } from "../../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithCredential,
  signOut,
  FacebookAuthProvider
} from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { FirebaseUser, UserContextType } from "../types";
// import * as FaceBook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
// import { AccessToken, LoginManager } from 'react-native-fbsdk-next'

WebBrowser.maybeCompleteAuthSession();

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  error: "",
  signInUser: async () => {},
  registerUser: async () => {},
  logoutUser: async () => {},
  forgotPassword: async () => {},
/*   signInWithFacebook: async () => {} */
});

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }: any) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
//   const [request, response, promptAsync] = FaceBook.useAuthRequest({
//     clientId: "1414315359174188",
//   });
  WebBrowser.maybeCompleteAuthSession();

  // Listen to the Firebase Auth state and set the user
  useEffect(() => {
    const unsubscribe = onFirebaseAuthStateChanged(FIREBASE_AUTH, (authUser) => {
      setUser(authUser);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

 /*  //Handle SignIn/LogIn with Facebook
  const signInWithFacebook = async () => {
    setLoading(true);
    try {
      console.log("inne i try")
      await LoginManager.logInWithPermissions(['public_profile', 'email']);
      console.log("Kommer u hit da")
      const data = await AccessToken.getCurrentAccessToken();
      console.log("prøver her da")
      console.log(data + " data")
      if (!data) {
        console.log("data er null");
        return;
      }
      console.log("halla")
      const facebookCredential = FacebookAuthProvider.credential(data.accessToken);
      console.log("halla" + facebookCredential.accessToken);
      const response = await signInWithCredential(FIREBASE_AUTH, facebookCredential);
    
      console.log(response);
     
      return response;
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  } */

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
      console.log(authUser);
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
/*     signInWithFacebook */
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};