import React, { useState } from 'react'
import {View, StyleSheet} from 'react-native'

import { colors } from '../utils/colors'
import { MediumText, MediumTextWhite } from './Text/MediumText';
import { XSmallText, XSmallTextWhite } from './Text/XSmallText';
import { PaymentType } from '../utils/types';






type paymentProps = {
    id: string
    payment: PaymentType; 
    partOfPayment: boolean;
    currency: string; //get from Split
    //creatorData?: UserType
}


//TODO: finn ut hvordan man får userID til innlogget bruker
//Bruk så dette til å sjekke denne mot props.creator, og userID-ene i props.participants ... Legg til "Your part is"

//Lagde brukeren oppgjøret, skal kortet være lysegrått. 

const Payment = (props: paymentProps) => {
    const id = props.id
    
    
    return (
        ((props.partOfPayment) ?
        
        (<View id={id} style={styles.bluePayment}>
            <MediumTextWhite>{`${props.payment.amount} ${props.currency}`}</MediumTextWhite>
            <XSmallTextWhite>{`${props.payment.title}`}</XSmallTextWhite>
            {/* <XSmallTextWhite>{`${props.creatorData?.firstName} ${props.creatorData?.lastName}`}</XSmallTextWhite> */}

            <XSmallTextWhite>{`Your share is x ${props.currency}`}</XSmallTextWhite>
        </View>) 
        :
        (<View id={id} style={styles.greyPaymentLeft}>
            <MediumText>{`${props.payment.amount} ${props.currency}`}</MediumText>
            <XSmallText>{`${props.payment.title}`}</XSmallText>
            {/* <XSmallText>{`${props.creatorData?.firstName} ${props.creatorData?.lastName}`}</XSmallText> */}

            <XSmallText>{'Your share is ' }</XSmallText>
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