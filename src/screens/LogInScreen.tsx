import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, Image, Text} from 'react-native';
import { LargeText } from '../components/Text/LargeText';
import {signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { MediumText } from '../components/Text/MediumText';
import { GreenLargeButton } from '../components/Buttons/GreenLargeButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { XSmallText } from '../components/Text/XSmallText';
import { SignInButton } from '../components/Buttons/SignInButton';
import * as FaceBook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';

import { ForgotPasswordButton } from '../components/Buttons/ForgotPasswordButton';
import DividerWithText from '../components/Styling/Divider';
import Spacer from '../components/Styling/Spacer';
import TextInputField from '../components/InputFields/TextInputField';
import PasswordInput from '../components/InputFields/PasswordInput';
import { FaceBookLogin } from '../components/Buttons/FacebookLoginButton';

type RootStackParamList = {
    LogIn: undefined;
    SignUp: undefined;
  };
  
  type LogInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LogIn'>;
  
  type Props = {
    navigation: LogInScreenNavigationProp;
  };

  WebBrowser.maybeCompleteAuthSession();

export default function LogInScreen({ navigation }: Props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);
  
    const auth = FIREBASE_AUTH;

    const [request, response, promptAsync] = FaceBook.useAuthRequest({
        clientId: "1414315359174188",
    })

    useEffect(() => {
        if(response && response.type === "success" && response.authentication) {
            (async () => {
                if (response.authentication) {
                    const userInfoResponse = await fetch(
                        `https://graph.facebook.com/me?access_token=${response.authentication.accessToken}&fields=id,name,picture.type(large)`
                );
                const userInfo = await userInfoResponse.json();
                setUser(userInfo);
                console.log(userInfo.name + "userinfo")
                }
            })();
        }
    }, [response])

    const handlePressAsync = async () => {
        const result = await promptAsync();
        if(result.type !== 'success') {
            alert('Uh no, something went wrong!');
            return;
        }
    }


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
           
            <TextInputField value={email} placeholder='Email' onChangeText={setEmail} />
            <PasswordInput  value={password} placeholder='Password' onChangeText={setPassword} />
            <Spacer size={24} horizontal={false}/>
           
            <View style={styles.rememberForgot}>
                <XSmallText children={"Remember me"}/>
                <Spacer size={14} horizontal={true} />
                <ForgotPasswordButton title={"Forgot Password?"} onClick={forgotPassword} />  
            </View>
            
            <GreenLargeButton title='Sign In' onClick={signIn} />
            <DividerWithText title={"Or login with"}/>
            
            <View style={styles.container}>
                {user ? (
                    <Profile user={user}></Profile>
                ) : (
                    <FaceBookLogin title='FaceBook' onClick={handlePressAsync}/>
                )
            }
            </View>

            <View style={styles.registeredText}>
                <XSmallText children={"Don´t have an account? "} />
                <SignInButton title={"Sign Up"} onClick={() => navigation.navigate('SignUp')} />
            </View>

        </View>
    )
};

interface User {
    name: string,
    id: string
}
interface ProfileProps {
    user: User
}
function Profile( { user }: ProfileProps) {
    return(
        <View style={styles.profile}>
            <Text>Name: {user.name}</Text>
            <Text>ID: {user.id}</Text>
        </View>
    )
}

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
