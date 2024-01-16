import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { StyledButtonProps } from '../types';
import { XSmallText, XSmallTextWhite } from '../Text/XSmallText';

export const BlueLargeButton = (props: StyledButtonProps) => {
    return (
        <TouchableOpacity onPress={props.onClick} style={styles.button}>
            <XSmallTextWhite>{props.title}</XSmallTextWhite>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#304AA6',
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



