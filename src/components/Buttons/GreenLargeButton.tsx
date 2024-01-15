import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { StyledButtonProps } from '../types';



export const GreenLargeButton = (props: StyledButtonProps) => {
    return (
        <TouchableOpacity onPress={props.onClick} style={styles.button}>
            <Text style={styles.text}>{props.title}</Text>
        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#43B05C',
        width: 324, 
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



