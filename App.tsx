import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, View} from 'react-native';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import LogInScreen from './src/screens/LogInScreen';
import SignUpScreen from './src/screens/SignUpScreen';

import SplitScreen from './src/screens/SplitScreen';
import HomeScreen from './src/screens/HomeScreen';
import { UserType } from './src/utils/types';
import { DocumentSnapshot, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';



const Stack = createNativeStackNavigator();


export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'WorkSans': require('./src/assets/fonts/WorkSans-VariableFont_wght.ttf'),
        'Quicksand': require('./src/assets/fonts/Quicksand-VariableFont_wght.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Home' component={HomeScreen}/>
        <Stack.Screen name='LogIn' component={LogInScreen} />
        <Stack.Screen name='SignUp' component={SignUpScreen} />
        {/* <Stack.Screen name='Split' component={SplitScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100, 
    height: 100, 
  },
});