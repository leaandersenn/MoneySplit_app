import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { StyledButtonProps } from '../types';
import * as FaceBook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function FaceBookLogin() {

    const [user, setUser] = useState(null);
    const [request, response, promptAsync] = FaceBook.useAuthRequest({
        clientId: "1414315359174188",
    })

    useEffect(() => {
        if(response && response.type === "success" && response.authentication) {
            (async () => {
                if (response.authentication) {
                    const userInfoResponse = await fetch(
                        `https://graph.facebook.com/me?access_token=${response.authentication.accessToken}&fields=id,name,picture.type(large)`
                );
                const userInfo = await userInfoResponse.json();
                setUser(userInfo);
                console.log(userInfo.name + "userinfo")
                }
            })();
        }
    }, [response])

    const handlePressAsync = async () => {
        const result = await promptAsync();
        if(result.type !== 'success') {
            alert('Uh no, something went wrong!');
            return;
        }
    
    }

    return (
        <TouchableOpacity onPress={handlePressAsync} style={styles.button}>
            <Image source={require('../../../assets/Facebook_circle_pictogram.svg.png')} style={styles.icon} />
            <Text style={styles.text}>FaceBook</Text>
        </TouchableOpacity> 
    )

}

const styles = StyleSheet.create({
    button: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: 324, 
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#000000'
    },
    text: {
        color: '#000000',
        fontSize: 14,
    },
    icon: {
        marginRight: 8,
        width: 24,
        height: 24,
        },
});