import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import { BlueLargeButton } from '../components/Buttons/BlueLargeButton';

import { MediumTextBold } from '../components/Text/MediumText';
import TextInputField from '../components/InputFields/TextInputField';
import { XSmallText } from '../components/Text/XSmallText';
import { SmallText } from '../components/Text/SmallText';

import { db } from '../../firebaseConfig'
import { addDoc, collection } from 'firebase/firestore';

export default function NewPaymentScreen() {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null)

    // -------- TODODS -------- //
    // Fetch which user is logged in
    // Connect from Split View to set "Add Payment" in context of a Split and add it to the header
    // Fetch all users in the split to choose which users who are part of the payment
    // Add new document to the Payments collection
    // Add payment-id to user's and split
    // If currency is not selected, the currency of the split is used
    // Currency converter, fetch Splits currency and convert accordingly

    const handleCreatePayment = async () => {
        if (!amount || !selectedCurrency) {
          // Handle missing input, e.g., show an alert
          alert('Please fill all the fields');
          return;
        }
    
        try {
          const paymentData = {
            amount: parseFloat(amount),
            currency: selectedCurrency,
            description: description,
            dateCreated: new Date(),
            //relatedSplit:
            //participants:
          };
    
          await addDoc(collection(db, 'Payments'), paymentData);
          alert('Payment added successfully');
        } catch (error) {
          console.error('Error adding payment:', error);
          alert('Error adding payment');
        }
      };

    const currencyOptions = [
        { label: 'NOK', value: 'NOK' },
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'GBP', value: 'GBP' }
      ]

    return (
        <View style={styles.container}>

            <MediumTextBold>New Payment</MediumTextBold>
            <SmallText>in ...</SmallText>
                
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
                    placeholder={{ label: '$', value: null }}
                    value={selectedCurrency}
                />
            </View>
        
        <TextInputField 
            placeholder={'Add description'} 
            value={description} 
            onChangeText={setDescription}
        />

        <XSmallText>Who is part of the payment?</XSmallText>

        {/* <FlatList
        data={filteredUsers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <CheckBox
              checked={isUserSelected(item)}
              onPress={() => handleSelectUser(item)}
            />
            <XSmallText>{item.firstName} {item.lastName}</XSmallText>
          </View>
        )}
      /> */}
        
        <XSmallText>Users...</XSmallText>

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
        padding: 20
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
});
