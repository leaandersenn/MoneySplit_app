import React, { useState } from 'react';
import { View, TextInput, StyleSheet, FlatList } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';


import TextInputField from '../components/InputFields/TextInputField';
import { XSmallText } from '../components/Text/XSmallText';
import { SmallText } from '../components/Text/SmallText';

import { db } from '../../firebaseConfig'
import { DocumentReference, addDoc, collection } from 'firebase/firestore';
import { MediumText } from '../components/Text/MediumText';
import { BlueLargeButton } from '../components/Buttons/BlueLargeButton';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './HomeScreen';
import BackButton from '../components/Buttons/BackButton';
import { colors } from '../utils/colors';
import ToggleSwitch from '../components/ToggleSwitch';
import { UserType } from '../utils/types';



type NewPaymentRouteProp = RouteProp<RootStackParamList, 'NewPayment'>

type NewPaymentScreenProps = {
  route: NewPaymentRouteProp
}


export default function NewPaymentScreen({route}: NewPaymentScreenProps) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null)
    const [selectedUsers, setSelectedUsers] = useState(new Set<DocumentReference>())
    const [participants, setParticipants] = useState<DocumentReference[]>()

    const navigation = useNavigation();

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

    const handleSelectUser = (ref: DocumentReference) => {
        if (!selectedUsers) {
            console.error("selectedUsers is undefined");
            return;
        }
        const newSelectedUsers = new Set(selectedUsers);
        if (selectedUsers && selectedUsers.has(ref)) {
            newSelectedUsers.delete(ref);
        } else {
            newSelectedUsers.add(ref);
        }
        setSelectedUsers(newSelectedUsers);

        const participantsArray = Array.from(newSelectedUsers)
        console.log('participantsArray:'+ participantsArray)
        setParticipants(participantsArray)
        console.log('participants'+ participantsArray)
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
            description: description,
            dateCreated: new Date(),
            relatedSplit: split.id,
            participants: participants
          };
          console.log('paymentData: ' + paymentData)
    
          await addDoc(collection(db, 'Payments'), paymentData);
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
                            onValueChange={() => handleSelectUser(item.id)}
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
