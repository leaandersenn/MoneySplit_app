import React from 'react';
import { StyleSheet, View, useColorScheme} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { XSmallText } from '../Text/XSmallText';
import { createTokenWithCode } from '../../utils/createGitHubToken';
import { FontAwesome as Icon } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { GithubAuthProvider, signInWithCredential } from "firebase/auth";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { doc, setDoc } from 'firebase/firestore';
import { db, FIREBASE_AUTH } from '../../../firebaseConfig';
import { colors} from '../../utils/colors';
import { RootStackParamList } from '../../screens/HomeScreen';


  type LogInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LogIn'>;
  
  type Props = {
    navigation: LogInScreenNavigationProp;
  };

  WebBrowser.maybeCompleteAuthSession();

   //GitHub endpoint
  const discovery = {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
    revocationEndpoint: `https://github.com/settings/connections/applications/${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}`,
  };

  export default function GitHubLoginButton( { navigation }: Props): JSX.Element {
    const currentTheme = useColorScheme();
    const [request, response, promptAsync] = useAuthRequest(
        {
          clientId: process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID!,
          scopes: ["identity", "user:email", "user:follow"],
          redirectUri: makeRedirectUri(),
        },
        discovery
      );

      React.useEffect(() => {
        handleResponse();
      }, [response]);
    
      async function handleResponse() {
        if (response?.type === "success") {
          const { code } = response.params;
          const { token_type, scope, access_token } = await createTokenWithCode(
            code
          );
          console.log("getGithubTokenAsync: ", {
            token_type,
            scope,
            access_token,
          });
    
          if (!access_token) return;
          const credential = GithubAuthProvider.credential(access_token);
          const data = await signInWithCredential(FIREBASE_AUTH, credential);
    
          fetch("https://api.github.com/user/following/betomoedano", {
            method: "PUT",
            headers: {
              Authorization: `token ${access_token}`,
            },
          })
            .then((response) => {
              if (response.status === 204) {
                console.log("Successfully followed!");
              } else {
                console.log("Failed to follow.");
              }
            })
            .catch((error) => {
              console.error("Error following user:", error);
            });
    
          console.log("credential: ", credential);
          console.log("data: ", JSON.stringify(data, null, 2));
          const fullName = data.user.displayName?.split(' ');
          const name = fullName![0];
          const lastName = fullName!.length > 1 ? fullName!.slice(1).join(' ') : '';
        
          const userDocRef = doc(db, 'Users', data.user.uid);

          await setDoc(userDocRef, {
            email: data.user.email,
            firstName: name,
            lastName: lastName,
          }, { merge: true }); 
        }
        console.log("sjekk databasen");
        console.log(FIREBASE_AUTH.currentUser?.email + "currentuser");
        if (FIREBASE_AUTH.currentUser) {
            navigation.navigate('Home');
        }
      }

      return(
        <View style={styles.button}>
        <Icon.Button
            name="github"
            color={currentTheme === "dark" ? "white" : "black"}
            backgroundColor="transparent"
            size={30}
            onPress={() => {
                promptAsync({ windowName: "Code with Beto" });
            }}
        >
        <XSmallText children={"Sign in with GitHub"} />
        </Icon.Button>
    </View>
      );
  }

  const styles = StyleSheet.create({
    button: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.graydark,
        width: 324, 
        height: 48,
        justifyContent: 'center',
        alignItems: 'center'
    },
});