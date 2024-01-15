import React, { useState } from "react";
import { TextInput, View, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { TextInputProps } from "../types";


export default function PasswordInput(props: TextInputProps) {
    const [secure, setSecure] = useState(true); 

    const handleSecure = () => {
        setSecure(!secure);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={props.placeholder}
                secureTextEntry={secure}
                value={props.value}
                onChangeText={props.onChangeText}
            />
            <TouchableOpacity onPress={handleSecure} style={styles.icon}>
                <FontAwesome style={styles.eyeslash} name="eye-slash" size={20}/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(217, 217, 217, 0.39)',
        width: 324,
        height: 48,
        borderRadius: 20,
    },
    eyeslash: {
        padding: 10,
        color: '#D9D9D9',
    },
    input: {
        flex: 1,
        color: '#424242',
        paddingLeft: 20,
        paddingRight: 10,
    },
    icon: {
        paddingRight: 10
    }
});


