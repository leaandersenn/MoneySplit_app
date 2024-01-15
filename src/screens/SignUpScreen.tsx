import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LargeText } from '../components/Text/LargeText';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { MediumText } from '../components/Text/MediumText';

import { GreenLargeButton } from '../components/Buttons/GreenLargeButton';
import BackButton from '../components/Buttons/BackButton';
import Spacer from '../components/Spacer';
import DividerWithText from '../components/Divider';
import PasswordInput from '../components/InputFields/PasswordInput';
import TextInputField from '../components/InputFields/TextInputField';


export default function LogInScreen() {
    
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');

  
    const auth = FIREBASE_AUTH;

    const signUp = async () => {
        if (password === checkPassword) {
            try {
                const response = await createUserWithEmailAndPassword(auth, email, password);
                console.log(response);
            } catch (error) {
                console.log(error);
                alert('Sign up failed');
            } 
        } else {
            alert('Passwords do not match')
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.topText}>
                <LargeText children={"MoneySplit"} />
                <View style={styles.signUp}>
                    <BackButton />
                    <Spacer size={45} horizontal={'horizontal'}/>
                    <MediumText children={"Sign Up"} />
                </View>
            </View>
            <TextInputField value={name} placeholder='First name' onChangeText={setName}/>
            <TextInputField value={name} placeholder='Last name' onChangeText={setLastName}/>
            <TextInputField value={name} placeholder='Email' onChangeText={setEmail}/>
            
            <PasswordInput value={password} placeholder='Password' onChangeText={setPassword} />
            <Spacer size={21} />
            <PasswordInput value={checkPassword} placeholder='Confirm Password' onChangeText={setCheckPassword} />
            <Spacer size={21} />
            
            <GreenLargeButton title='Sign Up' onClick={signUp}></GreenLargeButton>
            <DividerWithText title={'Or sign up with'}/>

            {/* TODO: Switch with Google */}
            <GreenLargeButton title='Google' onClick={signUp}></GreenLargeButton>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#ffff',
    alignItems: 'center',
    justifyContent: 'center',
    },
    topText: {
        marginBottom: 56,
        gap: 36,
    },
    signUp: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
});
