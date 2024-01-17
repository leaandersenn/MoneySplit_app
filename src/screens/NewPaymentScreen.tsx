import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';


import TextInputField from '../components/InputFields/TextInputField';
import { XSmallText } from '../components/Text/XSmallText';
import { SmallText } from '../components/Text/SmallText';
import { MediumText } from '../components/Text/MediumText';
import { BlueLargeButton } from '../components/Buttons/BlueLargeButton';
import BackButton from '../components/Buttons/BackButton';
import { colors } from '../utils/colors';

import { db } from '../../firebaseConfig'
import { DocumentReference, addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './HomeScreen';
import ToggleSwitch from '../components/ToggleSwitch';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';



type NewPaymentRouteProp = RouteProp<RootStackParamList, 'NewPayment'>
type SplitScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'NewPayment'>

type NewPaymentScreenProps = {
  route: NewPaymentRouteProp
  navigation: SplitScreenNavigationProp
}


export default function NewPaymentScreen({route, navigation}: NewPaymentScreenProps) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null)
    const [selectedUsers, setSelectedUsers] = useState(new Set<DocumentReference>())
    const [participants, setParticipants] = useState<Map<string, number>>()


    const { split } = route.params
    const { users } = route.params

    // -------- TODODS -------- //
    // Fetch which user is logged in
    // Connect from Split View to set "Add Payment" in context of a Split and add it to the header
    // Fetch all users in the split to choose which users who are part of the payment
    // Add new document to the Payments collection
    // Add payment-id to user's and split
    // If currency is not selected, the currency of the split is used
    // Currency converter, fetch Splits currency and convert accordingly

    const handleSelectUser = (userEmail: string) => {
        const newParticipants = new Map(participants);
    
        if (newParticipants.has(userEmail)) {
            newParticipants.delete(userEmail);
        } else {
            newParticipants.set(userEmail, 11); // should first set the number automatically (equal divison between all selected participants). The user should be able to edit this.
        }
    
        setParticipants(newParticipants);
    };
    

    const handleCreatePayment = async () => {
        if (!amount || !selectedCurrency) {
          // Handle missing input, e.g., show an alert
          alert('Please fill all the fields')
          return;
        }
    
        try {
            console.log(participants)
          const paymentData = {
            amount: parseFloat(amount),
            currency: selectedCurrency,
            title: description,
            dateCreated: new Date(),
            //creator: , //also update the creator's 'payments' list with the DocumentReference newPaymentRef
            relatedSplit: Object.freeze(split.id),
            participants: Object.fromEntries(participants!)
          };
    
          const newPaymentRef = await addDoc(collection(db, 'Payments'), paymentData);
          console.log('newPaymentRef: ' )
          console.log(newPaymentRef.path)

          console.log('paymentData.relatedSplit')
          console.log(paymentData.relatedSplit.path)
            await updateDoc(paymentData.relatedSplit, {
                paymentsID: arrayUnion(newPaymentRef)
            });

            alert('Payment added successfully');
        } catch (error) {
          console.error('Error adding payment:', error);
          alert('Error adding payment');
        }
        navigation.goBack()
      };

    const currencyOptions = [
        { label: 'NOK', value: 'NOK' },
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'GBP', value: 'GBP' }
      ]



    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <BackButton color={colors.tertiary}/>
            </View>

            <MediumText>New Payment</MediumText>
            <SmallText>in {split.name}</SmallText>
                
            <View style={styles.amountContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="0"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                />
                 <RNPickerSelect
                    style={{ inputIOS: styles.input }}
                    onValueChange={(value) => { setSelectedCurrency(value) }}
                    items={currencyOptions}
                    placeholder={{ label: `$`, value: null }}
                    value={selectedCurrency}
                /> 
            </View>
        
        <TextInputField 
            placeholder={'Add description'} 
            value={description} 
            onChangeText={setDescription}
        />

        <XSmallText>Who is part of the payment?</XSmallText>

        <FlatList
                data={users}
                keyExtractor={(item) => item.email}
                renderItem={({ item }) => (
                    <View style={styles.checkboxStyle}>
                        <ToggleSwitch
                            onValueChange={() => handleSelectUser(item.email)}
                        />
                        <XSmallText>{item.firstName} {item.lastName}</XSmallText>
                    </View>
                )}
            /> 

        <BlueLargeButton
            title="Add Payment"
            onClick={handleCreatePayment}
        />
        
    </View>
  );
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20, 
        paddingTop: 100, 
        paddingBottom: 200
    },

    checkboxStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5
    },

    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },

    input: {
        fontSize: 60,
        padding: 10,
        fontFamily: 'Quicksand',
    },
    title:{
        marginTop: 15, 
        marginLeft: 20,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignContent: 'flex-start'
      }
});