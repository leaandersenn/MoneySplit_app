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
    currency: string;
    title: string;
    participants: Map<string, string>;
    relatedSplitsId: string[];
}