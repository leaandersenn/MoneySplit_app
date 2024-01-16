import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { StyledButtonProps } from '../types';

export const FaceBookLogin = (props: StyledButtonProps) => {
    return (
        <TouchableOpacity onPress={props.onClick} style={styles.button}>
            <Image source={require('../../../assets/Facebook_circle_pictogram.svg.png')} style={styles.icon} />
            <View>
                <Text style={styles.text}>{props.title}</Text>
            </View>
        </TouchableOpacity> 
    )

}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#ffffff',
        width: 324, 
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderColor: '#000000'
    },
    text: {
        color: '#000000',
        fontSize: 16,
    },
    icon: {
        marginRight: 8,
        width: 24,
        height: 24,
        },
});