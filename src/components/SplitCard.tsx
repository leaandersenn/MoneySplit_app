import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { SplitType } from '../utils/types';
import { LargeTextWhite } from './Text/LargeText';
import { useNavigation } from '@react-navigation/native';


enum cardColors {
    pink='#ff7de1',
    green='#43B05C', 
    blue='#5BD4FA'
}


type SplitCardProps = {
    id: string,
    split: SplitType
    onClick: () => void;
}


const SplitCard = (props: SplitCardProps) => {
  
  return (
    <TouchableOpacity id={props.id} onPress={props.onClick}>
        <View style={[styles.card, { backgroundColor: props.split.cardColor }]}>
            <LargeTextWhite>{`${props.split.name}`}</LargeTextWhite>
            {/* ... other content */}
        </View>
    </TouchableOpacity>
  )
}

export default SplitCard



const styles = StyleSheet.create({
    card: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center', 
        justifyContent: 'center',
        borderRadius: 10,
        height: 100,
        maxHeight: 190, 
        width: 310, 
        padding: 12,
        margin: 10 ,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    }
  });