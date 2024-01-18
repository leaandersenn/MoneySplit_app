
import {describe, expect, test} from '@jest/globals';
import { addDoc, collection } from 'firebase/firestore';

// -------------- FIREBASE CONFIG ---------------- //
// Because jest is not able to import the config from firebaseConfig.ts, we need to copy it here

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

// ---------------------------------------------- //

describe('createNewSplit', () => {
  it('should create a new split and add it to the Splits collection', async () => {
    
    const mockSplit = {
      name: "Pizza",
      creationDate: new Date(),
      currency: "NOK",
      cardColor: "pink",
      users: "RafwXzbJQ1cGYNSlpZ2O",
    };

    const result = await addDoc(collection(db, 'Splits'), mockSplit);

    console.log('Result: ', result);
    
    expect(result).toEqual(mockSplit);
  });
});