import React, { useEffect, useState } from 'react'
import {View, StyleSheet} from 'react-native'

import { colors } from '../utils/colors'
import { MediumText, MediumTextWhite } from './Text/MediumText';
import { XSmallText, XSmallTextWhite } from './Text/XSmallText';
import { PaymentType, UserType } from '../utils/types';
import { FIREBASE_AUTH } from '../../firebaseConfig';

type paymentProps = {
    id: string
    payment: PaymentType; 
    partOfPayment: boolean;
    currency: string; //get from Split
    creatorData?: UserType;
}

const Payment = (props: paymentProps) => {

    const id = props.id
  
    const participantsMap = props.payment.participants instanceof Map
    ? props.payment.participants
    : new Map(Object.entries(props.payment.participants || {})); 

    const email = FIREBASE_AUTH.currentUser?.email;
    const share = participantsMap.get(email as string)
    
    return (
        ((props.partOfPayment) ?
        
        (<View id={id} style={styles.bluePayment}>
            <MediumTextWhite>{`${props.payment.amount} ${props.currency}`}</MediumTextWhite>
            <XSmallTextWhite>{`${props.payment.title}`}</XSmallTextWhite>
            <XSmallTextWhite>{`${props.creatorData?.firstName} ${props.creatorData?.lastName}`}</XSmallTextWhite>

            <XSmallTextWhite>{`Your share is ${share} ${props.currency}`}</XSmallTextWhite>
        </View>) 
        :
        (<View id={id} style={styles.greyPaymentLeft}>
            <MediumText>{`${props.payment.amount} ${props.currency}`}</MediumText>
            <XSmallText>{`${props.payment.title}`}</XSmallText>
            <XSmallText>{`${props.creatorData?.firstName} ${props.creatorData?.lastName}`}</XSmallText>

            <XSmallText>{`Your share is ${share} ${props.currency}`}</XSmallText>
        </View>)) 
  )
}
export default Payment


const styles = StyleSheet.create({
    bluePayment: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderRadius: 10,
        backgroundColor: colors.blue,
        height: 100,
        maxHeight: 150, 
        width: 300, 
        padding: 12,
        margin: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 1.5,
    },
    greyPaymentLeft: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderRadius: 10,
        backgroundColor: colors.graylight,
        height: 125, 
        minHeight: 125, 
        maxHeight: 150,
        width: 300, 
        padding: 12,
        margin: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 1.5,
    },
  });