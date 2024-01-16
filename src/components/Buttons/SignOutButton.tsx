import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { StyledButtonProps } from "../types";
import { getAuth, signOut } from 'firebase/auth';

export default function SignOutButton() {

    const handleSignOut = async () => {
        const auth = getAuth();
        try {
            await auth
             .signOut()
             .then(() => console.log('User signed out!'));

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