import { DocumentReference } from "firebase/firestore";
import { ReactNode } from "react";
import { StyleProp, TextStyle } from "react-native";


//StyleProps

export interface TextProps {
    textStyles?: StyleProp<TextStyle>;
    children: ReactNode;
}



//Types
export type UserType = {
    id: string, 
    firstName: string, 
    lastName: string, 
    email: string, 
    payments: DocumentReference[] //refs to payments user owns
    splits: DocumentReference[] //refs to splits user participates in --> if we have this, we will have to iterate through all Users and update their splits-list whenever a new Split is added...
}


export type PaymentType = {
    id: string,
    creator: string; 
    dateCreated: Date;
    amount: number;
    title: string;
    participants: Map<string, number>;
    relatedSplit: DocumentReference; 
}


export type SplitType = {
    id: DocumentReference,
    name: string,
    creationDate: Date,
    currency: string,
    cardColor: string,
    paymentsID: DocumentReference[], 
    users: string[]; 
}

export type Debt = { //will be used as: to type a parameter (an array) for SplitCard, and for a Split (to be used in the Debt Simplification Algorithm)
    isOwed: DocumentReference, 
    owes: DocumentReference, 
    sum: number,
    currency: string, 
}