import React from 'react';
import { TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

//Will navigate back to previous screen

type OptionalColorProp ={
  color?: string
}

export default function BackButton(color: OptionalColorProp) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
    >
      <Icon name="chevron-left" size={24} color={color.color ? color.color: "#000"} />
    </TouchableOpacity>
  );
};