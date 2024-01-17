import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, View} from 'react-native';
import { LargeText } from '../components/Text/LargeText';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { MediumText } from '../components/Text/MediumText';
import { GreenLargeButton } from '../components/Buttons/GreenLargeButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { XSmallText } from '../components/Text/XSmallText';
import { SignInButton } from '../components/Buttons/SignInButton';
import { ForgotPasswordButton } from '../components/Buttons/ForgotPasswordButton';
import DividerWithText from '../components/Styling/Divider';
import Spacer from '../components/Styling/Spacer';
import TextInputField from '../components/InputFields/TextInputField';
import PasswordInput from '../components/InputFields/PasswordInput';
import FaceBookLogin from '../components/Buttons/FacebookLoginButton';
import { useUserContext } from '../components/Context/userContext';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { FacebookAuthProvider, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as FaceBook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import Auth from 'firebase/auth';
import { GoogleSignin, statusCodes, GoogleSigninButton } from '@react-native-google-signin/google-signin';


WebBrowser.maybeCompleteAuthSession();

type RootStackParamList = {
    LogIn: undefined;
    SignUp: undefined;
    AfterLogin: undefined;
  };
  
  type LogInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LogIn'>;
  
  type Props = {
    navigation: LogInScreenNavigationProp;
  };

  GoogleSignin.configure({
    webClientId: '533403659744-sop0u9rb68nmlcn6jrjkj4to45hrplmb.apps.googleusercontent.com',
  });

export default function LogInScreen({ navigation }: Props) {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState(null);


    const { signInUser, forgotPassword, logoutUser, signInWithFacebook } = useUserContext();

    const [request, response, promptAsync] = FaceBook.useAuthRequest({
        clientId: "1414315359174188",
      });

    const google = async () => {
        // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  const signIn = signInWithCredential(FIREBASE_AUTH, googleCredential);
        signIn.then(re => {
            console.log(re + "re");
        })
    }

    useEffect(() => {
        if(response && response.type === 'success' && response.authentication) {
            (async () => {
                const userInfoResponse = await fetch(
                    `https://graph.facebook.com/me?access_token=${response.authentication?.accessToken}&fields=id,name` 
                );
                const userInfo = await userInfoResponse.json();
                console.log(userInfo + "userInfo");
                setUser(userInfo);
                console.log(user + "user");
            })();
        }
    }, [response])

    const onSubmit = async () => {
        try {
            if (email && password) {
            console.log("Email" + email + "prøver å logge inn")
            await signInUser({email, password});
            console.log("her er brukeren" + FIREBASE_AUTH.currentUser?.email)
            navigation.navigate('AfterLogin');
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
        console.log(FIREBASE_AUTH.currentUser + ": current user (should be null)");
        navigation.goBack();
    }

    const handleFacebook = async () => {
        await signInWithFacebook();
        console.log("Signed in with facebook");
        navigation.navigate('AfterLogin');

    }

    const handlePressAsync = async () => {
        const result = await promptAsync();
        if (result.type !== 'success') {
            alert('Uh no, something went wrong');
            return;
        }
    }

    const onFacebookButtonPress = async () => {
        // Attempt login with permissions
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
        if (result.isCancelled) {
          throw 'User cancelled the login process';
        }
      
        // Once signed in, get the users AccessToken
        const data = await AccessToken.getCurrentAccessToken();
      
        if (!data) {
          throw 'Something went wrong obtaining access token';
        }
      
        // Create a Firebase credential with the AccessToken
        const facebookCredential = FacebookAuthProvider.credential(data.accessToken);
      
        // Sign-in the user with the credential
        return signInWithCredential(FIREBASE_AUTH, facebookCredential);
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
                <ForgotPasswordButton title={"Forgot Password?"} onPress={forgotPasswordHandler} />  
            </View>
            
            <GreenLargeButton title='Sign In' onPress={onSubmit} />

            <Button title='sign out' onPress={handleSignout} />
            <DividerWithText title={"Or login with"}/>
            <Button title='Facebook try' onPress={onFacebookButtonPress} />
            <FaceBookLogin />           

            <View style={styles.registeredText}>
                <XSmallText children={"Don´t have an account? "} />
                <SignInButton title={"Sign Up"} onPress={() => navigation.navigate('SignUp')} />
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
