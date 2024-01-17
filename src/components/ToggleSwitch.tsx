import React, {useState} from 'react';
import {Switch, TouchableOpacity} from 'react-native';


type ToggleSwitchProps ={
    onValueChange: () => void
}

const ToggleSwitch = ({onValueChange}: ToggleSwitchProps) => {
  const [isEnabled, setIsEnabled] = useState(true);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState)
    onValueChange()
    console.log('switched enable state to: ' + isEnabled)
}
  return (
      <Switch
        trackColor={{false: '#767577', true: '#7aeb5e'}}
        thumbColor={isEnabled ? '#ffffff' : '#ffffff'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={!isEnabled}
      />
  );
};


export default ToggleSwitch;