import React, { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { LargeText } from '../components/Text/LargeText';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { MediumText } from '../components/Text/MediumText';
import { GreenLargeButton } from '../components/Buttons/GreenLargeButton';
import BackButton from '../components/Buttons/BackButton';
import Spacer from '../components/Styling/Spacer';
import DividerWithText from '../components/Styling/Divider';
import PasswordInput from '../components/InputFields/PasswordInput';
import TextInputField from '../components/InputFields/TextInputField';
import FaceBookLogin from '../components/Buttons/FacebookLoginButton';
import { useUserContext } from '../components/Context/userContext';
import { FirebaseError } from 'firebase/app';

export default function LogInScreen() {
    
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { registerUser, logoutUser } = useUserContext();

    const onSubmit = async () => {
        try {
            if (email && password && name && lastName) {
            console.log("Email" + email + "prøver å logge inn")
            await registerUser({email, password, name, lastName});
            console.log("her er brukeren" + FIREBASE_AUTH.currentUser?.email)
            } 
        } catch (error) {
            console.log(error);
            alert('Sign up failed');
        }
    }


    const handleSignout = async () => {
        await logoutUser();
        console.log("User signed out");
        console.log(FIREBASE_AUTH.currentUser + ": current user");
    }
    

    return (
        <View style={styles.container}>
            <View style={styles.topText}>
                <LargeText children={"MoneySplit"} />
                <View style={styles.signUp}>
                    <BackButton />
                    <Spacer size={45} horizontal={true}/>
                    <MediumText children={"Sign Up"} />
                </View>
            </View>
            <TextInputField value={name} placeholder='First name' onChangeText={setName}/>
            <TextInputField value={lastName} placeholder='Last name' onChangeText={setLastName}/>
            <TextInputField value={email} placeholder='Email' onChangeText={setEmail}/>
            
            <PasswordInput value={password} placeholder='Password' onChangeText={setPassword} />
            <Spacer size={21} horizontal={false}/>
            
            <GreenLargeButton title='Sign Up' onPress={onSubmit}></GreenLargeButton>
            <DividerWithText title={'Or sign up with'}/>
            <Button title='sign out' onPress={handleSignout} />
            <FaceBookLogin/>
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
