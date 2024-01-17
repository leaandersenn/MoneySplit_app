import React, { useState } from 'react';
import { Button, StyleSheet, View, Text, useColorScheme} from 'react-native';
import { LargeText } from '../components/Text/LargeText';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { MediumText } from '../components/Text/MediumText';
import { GreenLargeButton } from '../components/Buttons/GreenLargeButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { XSmallText } from '../components/Text/XSmallText';
import { SignInButton } from '../components/Buttons/SignInButton';
import { ForgotPasswordButton } from '../components/Buttons/ForgotPasswordButton';
import DividerWithText from '../components/Divider';
import Spacer from '../components/Spacer';
import TextInputField from '../components/InputFields/TextInputField';
import PasswordInput from '../components/InputFields/PasswordInput';
import { useUserContext } from '../components/Context/userContext';
import GitHubLoginButton from '../components/Buttons/GitHubLoginButton';

type RootStackParamList = {
    LogIn: undefined;
    SignUp: undefined;
    AfterLogin: undefined;
    HomeScreen: undefined;
  };
  
  type LogInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LogIn'>;
  
  type Props = {
    navigation: LogInScreenNavigationProp;
  };

export default function LogInScreen({ navigation }: Props): JSX.Element  {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signInUser, forgotPassword, logoutUser } = useUserContext();
    const onSubmit = async () => {
        try {
            if (email && password) {
            console.log("Email" + email + "prøver å logge inn")
            await signInUser({email, password})
                .then(() => navigation.navigate('HomeScreen'));
            console.log("her er brukeren" + FIREBASE_AUTH.currentUser?.email)
        } 
        } catch (error) {
        console.log(error);
        alert('Sign up failed');
        }
    };

    const forgotPasswordHandler = async () => {
        if (email)
        forgotPassword(email).then(() => {
            setEmail("");
        });
    };

    const handleSignout = async () => {
        logoutUser();
        console.log("User signed out");
        console.log(FIREBASE_AUTH.currentUser + ": current user");
    }

    return (
        <View style={styles.container}>
            <View style={styles.topText}>
                <LargeText children={"MoneySplit"} />
                <MediumText children={"Sign In"} />
            </View>
           
            <TextInputField value={email} placeholder='Email' onChangeText={setEmail} />
            <PasswordInput  value={password} placeholder='Password' onChangeText={setPassword} />
            <Spacer size={24} horizontal={false}/>
           
            <View style={styles.rememberForgot}>
                <XSmallText children={"Remember me"}/>
                <Spacer size={14} horizontal={true} />
                <ForgotPasswordButton title={"Forgot Password?"} onClick={forgotPasswordHandler} />  
            </View>
            
            <GreenLargeButton title='Sign In' onClick={onSubmit} />
            <Button title='sign out' onPress={handleSignout} />
            <DividerWithText title={"Or login with"}/>
            <GitHubLoginButton navigation={navigation}/>
            
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
    rememberForgot: {
        flexDirection: 'row',
        alignContent: 'center',
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
    },
    profile: {
        alignItems: 'center'
    }
});