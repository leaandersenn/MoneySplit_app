import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { StyledButtonProps } from '../types';


export const ForgotPasswordButton = (props: StyledButtonProps) => {
    return (
        <TouchableOpacity style={styles.input} onPress={props.onClick}>
            <Text style={styles.text}>{props.title}</Text>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    text: {
        color: 'rgba(74, 74, 74, 0.57)',
        fontSize: 15,
        textDecorationLine: 'underline'
    },
    input: {
        borderRadius: 20,
        marginBottom: 21,
    }
});

