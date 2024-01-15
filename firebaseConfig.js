import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";

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
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const FIREBASE_AUTH = getAuth(app);

//IOS: 874747941299-rttok4bo7msjkk6dvf0h9aso8bbpeako.apps.googleusercontent.com