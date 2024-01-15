import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { LargeText } from '../components/Text/LargeText';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { MediumText } from '../components/Text/MediumText';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { GreenLargeButton } from '../components/Buttons/GreenLargeButton';
import BackButton from '../components/Buttons/BackButton';
import Spacer from '../components/Spacer';
import DividerWithText from '../components/Divider';
import PasswordInput from '../components/PasswordInput';


export default function LogInScreen() {
    
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checkPassword, setCheckPassword] = useState('');
    const [loading, setLoading] = useState(false);
  
    const auth = FIREBASE_AUTH;

    const signUp = async () => {
        if (password !== checkPassword) {
            alert('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error) {
            console.log(error);
            alert('Sign in failed');
        } finally {
            setLoading(false);
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

            <TextInput style={styles.input} value={name} placeholder='First name' onChangeText={(text) => setName(text) }></TextInput>
            <TextInput style={styles.input} value={lastName} placeholder='Last name' onChangeText={(text) => setLastName(text) }></TextInput>

            <TextInput style={styles.input} value={email} placeholder='Email' onChangeText={(text) => setEmail(text) }></TextInput>
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
    input: {
        backgroundColor: 'rgba(217, 217, 217, 0.39)',
        width: 324, 
        height: 48,
        borderRadius: 20,
        paddingLeft: 20,
        marginBottom: 21,
    },
    user: {
        display: 'flex',
        flexDirection: 'row',
    },
    topText: {
        marginBottom: 56,
        gap: 36,
    },
    signUp: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        /* justifyContent: 'flex-start' */
    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    searchIcon: {
        padding: 10,
    },
    input2: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#424242',
    },
});
