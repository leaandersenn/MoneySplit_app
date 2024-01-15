import React, { Fragment, useState } from 'react';
import { Button, StyleSheet, Switch, TextInput, View } from 'react-native';
import { LargeText } from '../components/Text/LargeText';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCredential } from "firebase/auth";
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { MediumText } from '../components/Text/MediumText';
import { initializeAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { GreenLargeButton } from '../components/Buttons/GreenLargeButton';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import { XSmallText } from '../components/Text/XSmallText';
import { SignInButton } from '../components/Buttons/SignInButton';
import { SmallText } from '../components/Text/SmallText';
import { ForgotPasswordButton } from '../components/Buttons/ForgotPasswordButton';
import DividerWithText from '../components/Divider';
import Spacer from '../components/Spacer';

type RootStackParamList = {
    LogIn: undefined;
    SignUp: undefined;
  };
  
  type LogInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LogIn'>;
  
  type Props = {
    navigation: LogInScreenNavigationProp;
  };

export default function LogInScreen({ navigation}: Props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error) {
            console.log(error);
            alert('Email or password is wrong');
    }
}

    const forgotPassword = () => {
        console.log("Forgot password")
        /* Handle forgot password */
    }
  
    return (
        <View style={styles.container}>
            <View style={styles.topText}>
                <LargeText children={"MoneySplit"} />
                <MediumText children={"Sign In"} />
            </View>
            <TextInput style={styles.input} value={email} placeholder='Email' onChangeText={(text) => setEmail(text) } />
            <TextInput style={styles.input} secureTextEntry={true} value={password} placeholder='Password' onChangeText={(text) => setPassword(text) } />
            <View style={styles.rememberForgot}>
                <XSmallText children={"Remember me"}/>
                <Spacer size={14} horizontal={'horizontal'} />
                <ForgotPasswordButton title={"Forgot Password?"} onClick={forgotPassword} />  
            </View>
            <GreenLargeButton title='Sign In' onClick={signIn} />
            <DividerWithText title={"Or login with"}/>


            {/* TODO: ADD in Google Component*/}
            <GreenLargeButton title='Log In with Google' onClick={signIn} />

            <View style={styles.registeredText}>
                <XSmallText children={"Don´t have an account? "} />
                <SignInButton title={"Sign Up"} onClick={() => navigation.navigate('SignUp')} />
            </View>
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
        marginBottom: 24
    },
    rememberForgot: {
        flexDirection: 'row',
        alignContent: 'center',
        marginBottom: 21,
    },
    registeredText: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 35,
        color: '#808080'
    },
    topText: {
        marginBottom: 56,
        gap: 36,
        alignItems: 'center'
    }
});
