import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { getAuth, signOut } from 'firebase/auth';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../screens/HomeScreen";

type SignoutProps = {
    onClick: () => void;
}


export default function SignOutButton(props: SignoutProps) {
    return (
        <TouchableOpacity onPress={props.onClick} style={styles.button}>
            <Text style={styles.text}>Sign Out</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#43B05C',
        marginLeft: 20,
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