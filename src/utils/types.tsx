import { DocumentReference } from "firebase/firestore";
import { ReactNode } from "react";
import { StyleProp, TextStyle } from "react-native";


//StyleProps

export interface TextProps {
    textStyles?: StyleProp<TextStyle>;
    children: ReactNode;
}



//Types

export type PaymentType = {
    id: string,
    creator: number;
    sumOfPayment: number;
    title: string;
    participants: Map<string, number>;
    relatedSplit: DocumentReference; 
}

export type UserType = {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    splits: DocumentReference[],
    payments: DocumentReference[]
}