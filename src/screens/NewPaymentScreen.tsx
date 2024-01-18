import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import TextInputField from '../components/InputFields/TextInputField';
import { XSmallText } from '../components/Text/XSmallText';
import { SmallText } from '../components/Text/SmallText';
import { MediumText } from '../components/Text/MediumText';
import { BlueLargeButton } from '../components/Buttons/BlueLargeButton';
import BackButton from '../components/Buttons/BackButton';
import { colors } from '../utils/colors';
import { FIREBASE_AUTH, db } from '../../firebaseConfig'
import { addDoc, arrayUnion, collection, updateDoc } from 'firebase/firestore';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './HomeScreen';
import ToggleSwitch from '../components/ToggleSwitch';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Spacer from '../components/Spacer';

// -------- TODODS -------- //
// Connect from Split View to set "Add Payment" in context of a Split and add it to the header
// If currency is not selected, the currency of the split is used
// Currency converter, fetch Splits currency and convert accordingly

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
    const [participants, setParticipants] = useState<Map<string, number>>()

    console.log(FIREBASE_AUTH.currentUser?.email)
    const { split } = route.params
    const { users } = route.params
    const { userId } = route.params

    const currencyOptions = [
        { label: 'NOK', value: 'NOK' },
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'GBP', value: 'GBP' }
      ]



    const handleSelectUser = (userEmail: string) => {
        const newParticipants = new Map(participants);
        if (newParticipants.has(userEmail)) {
            newParticipants.delete(userEmail);
        } else {
            newParticipants.set(userEmail, 11); // should first set the number automatically (equal divison between all selected participants). The user should be able to edit this.
        }
        setParticipants(newParticipants);
        //Object.fromEntries(newParticipants)
    };
    

    const handleCreatePayment = async () => {
        if (!amount || !selectedCurrency) {
          alert('Please fill all the fields')
          return;
        }
        try {
            console.log('NewPaymentScreen: participants' + participants)
          const paymentData = {
            amount: parseFloat(amount),
            currency: selectedCurrency,
            title: description,
            dateCreated: new Date(),
            creator: userId,
            relatedSplit: Object.freeze(split.id),
            participants: Object.fromEntries(participants!)
          };
    
          const newPaymentRef = await addDoc(collection(db, 'Payments'), paymentData)
          console.log('newPaymentRef: ' )
          console.log(newPaymentRef.path)
          console.log('paymentData.relatedSplit')
          console.log(paymentData.relatedSplit.path)

          await updateDoc(paymentData.relatedSplit, {
            paymentsID: arrayUnion(newPaymentRef)
        });
        alert('Payment added successfully')
        } catch (error) {
          console.error('Error adding payment:', error)
          alert('Error adding payment')
        }
        navigation.goBack()
      };

    return (
        <View style={styles.container}>
            <View style={styles.back}>
                <BackButton color={colors.tertiary}/>
            </View>

            <View style={styles.title}>
                <MediumText>New Payment</MediumText>
                <SmallText>in {split.name}</SmallText>
            </View>
                
            <View style={styles.padded}>
                <View style={styles.amountContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="0"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                    />
                    <SelectDropdown
                        data={currencyOptions}
                        onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index);
                            setSelectedCurrency(selectedItem.value);
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            return selectedItem.label;
                        }}
                        rowTextForSelection={(item, index) => {
                            return item.label;
                        }}
                        defaultValueByIndex={0} 
                    />
                </View>
            
            <TextInputField 
                placeholder={'Add description'} 
                value={description} 
                onChangeText={setDescription}
            />

            <XSmallText>Who is part of the payment?</XSmallText>
            
            <View style={styles.contents}>
            {users.map((user) => (
                <View key={user.email} style={styles.checkboxStyle}>
                <ToggleSwitch
                    onValueChange={() => handleSelectUser(user.email)}
                />
                <Spacer horizontal={true} size={5}></Spacer>
                <XSmallText>{user.firstName} {user.lastName}</XSmallText>
                </View>
            ))}
            </View>
        </View>

        <View style={styles.bottomButton}>
            <BlueLargeButton
                title="Add Payment"
                onClick={handleCreatePayment}
            />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        padding: 20, 
        paddingTop: 100, 
        paddingBottom: 200
    },
    contents: {
        padding: 20, 
        alignContent: 'center'
    },
    center:{
        justifyContent: 'center',
        alignContent: 'center',
    },
    padded:{
        marginTop: 20,
        marginBottom: 20,
        padding: 20
    },
    back:{
        marginTop: 15, 
        marginBottom: 15,
        flexDirection: 'row',
        alignContent: 'flex-start'
      },
      title:{
        marginTop: 15, 
        marginBottom: 30,
        flexDirection: 'column',
        alignItems: 'center'
      },
      centerItem:{
        marginTop: 15, 
        marginBottom: 15,
        flexDirection: 'column',
        alignItems: 'center'
      },
      bottomButton:{
        marginTop: 75, 
        marginBottom: 15,
        flexDirection: 'column',
        alignItems: 'center'
      },
      row:{
        flexDirection: 'row', 
        alignContent: 'center'
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
});