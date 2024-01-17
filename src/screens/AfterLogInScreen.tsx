import { Text, View, StyleSheet, Button } from "react-native";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import SignOutButton from "../components/Buttons/SignOutButton";


export default function AfterLoginScreen() {
    const user = FIREBASE_AUTH.currentUser
    if (user) {
    console.log('User email: ', user.email);
    }
    return(
        <View style={styles.container}>
            <Text>Du er logget inn som: {user?.email}</Text>
            <SignOutButton />
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