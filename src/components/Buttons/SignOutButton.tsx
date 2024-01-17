import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { getAuth, signOut } from 'firebase/auth';
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
  


export default function SignOutButton({navigation}: Props) {

    const handleSignOut = async () => {
        const auth = getAuth();
        try {
            await auth
             .signOut()
             .then(() => navigation.navigate('HomeScreen'));

        } catch (error) {
            alert('Error signing out:');
        }
    };
    
    return (
        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
            <Text style={styles.text}>Sign Out</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#43B05C',
        width: 124, 
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    text: {
        color: '#ffff',
        fontSize: 16,
    }
});