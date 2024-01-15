import React from "react";
import {StyleSheet, TextInput } from "react-native";

import { TextInputProps } from "../types";


export default function TextInputField(props: TextInputProps) {
    return (
        <TextInput
            style={styles.input}
            placeholder={props.placeholder}
            value={props.value}
            onChangeText={props.onChangeText}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: 'rgba(217, 217, 217, 0.39)',
        width: 324, 
        height: 48,
        borderRadius: 20,
        paddingLeft: 20,
        marginBottom: 21,
    },
});


