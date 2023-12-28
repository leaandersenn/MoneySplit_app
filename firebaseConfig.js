import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";

// Optionally import services 
//import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD_aJLN16EskdvdNBBM87IQIvLah-A2_l4",
  authDomain: "moneysplit-64ca6.firebaseapp.com",
  projectId: "moneysplit-64ca6",
  storageBucket: "moneysplit-64ca6.appspot.com",
  messagingSenderId: "533403659744",
  appId: "1:533403659744:web:60451f06372536ea608f85",
  measurementId: "G-9SFG3P6Z4H"
};

export const analytics = getAnalytics(app);

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);