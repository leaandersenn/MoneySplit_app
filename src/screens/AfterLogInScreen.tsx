import { Text, View, StyleSheet, Button } from "react-native";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import SignOutButton from "../components/Buttons/SignOutButton";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
    Home: undefined;
    LogIn: undefined;
    SignUp: undefined;
    AfterLogin: undefined;
    HomeScreen: undefined;
  };
  
  type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
  
  type Props = {
    navigation: HomeScreenNavigationProp;
  };
  


export default function AfterLoginScreen( {navigation}: Props) {
    const user = FIREBASE_AUTH.currentUser
        if (user) {
        console.log('User email: ', user.email);
        }
        
    return(
        <View style={styles.container}>
            <Text>Du er logget inn som: {user?.email}</Text>
            <SignOutButton navigation={navigation} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#ffff',
    alignItems: 'center',
    justifyContent: 'center',
    }
});