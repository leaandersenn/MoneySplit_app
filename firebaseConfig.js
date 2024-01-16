import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD_aJLN16EskdvdNBBM87IQIvLah-A2_l4",
  authDomain: "moneysplit-64ca6.firebaseapp.com",
  projectId: "moneysplit-64ca6",
  storageBucket: "moneysplit-64ca6.appspot.com",
  messagingSenderId: "533403659744",
  appId: "1:533403659744:web:60451f06372536ea608f85",
  measurementId: "G-9SFG3P6Z4H"
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const FIREBASE_AUTH = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

/* export const FIREBASE_AUTH = getAuth(app); */

//IOS: 1001490262412-mbgr5gbmocg1aets8sq6ha22p91n9je8.apps.googleusercontent.com