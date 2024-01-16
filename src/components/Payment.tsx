import React from 'react'
import {View, StyleSheet} from 'react-native'

import { colors } from '../utils/colors'
import { MediumText, MediumTextWhite } from './Text/MediumText';
import { XSmallText, XSmallTextWhite } from './Text/XSmallText';
import { SmallText, SmallTextWhite } from './Text/SmallText';
import { PaymentType } from '../utils/types';




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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
  });



type paymentProps = {
    id: string
    payment: PaymentType; 
    partOfPayment: boolean;
    yourPartIs: string;
}


//TODO: finn ut hvordan man får userID til innlogget bruker
//Bruk så dette til å sjekke denne mot props.creator, og userID-ene i props.participants ...

//Lagde brukeren oppgjøret, skal kortet være lysegrått. 

const Payment = (props: paymentProps) => {
    const id = props.id

  return (
    ((props.partOfPayment) ?

    (<View style={styles.bluePayment}>
        <MediumTextWhite>{`${props.payment.sumOfPayment} ${props.payment.currency}`}</MediumTextWhite>
        <XSmallTextWhite>{`${props.payment.title}`}</XSmallTextWhite>
        <XSmallTextWhite>{`${props.payment.creator}`}</XSmallTextWhite>

        <XSmallTextWhite>{`Your share is ${Object.keys(props.yourPartIs)[0]} ${props.payment.currency}`}</XSmallTextWhite>
    </View>) 
    :
    (<View style={styles.greyPaymentLeft}>
        <MediumText>{`${props.payment.sumOfPayment} ${props.payment.currency}`}</MediumText>
        <XSmallText>{`${props.payment.title}`}</XSmallText>
        <XSmallText>{`${props.payment.creator}`}</XSmallText>

        <XSmallText>{'Your share is ' }</XSmallText>
    </View>)) 
  )
}

export default Payment