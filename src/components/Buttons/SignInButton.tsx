import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { StyledButtonProps } from '../types';


export const SignInButton = (props: StyledButtonProps) => {
    return (
        <TouchableOpacity onPress={props.onClick}>
            <Text style={styles.text}>{props.title}</Text>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    text: {
        color: '#43B05C',
        fontSize: 14,
    }
});

