import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, View} from 'react-native';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import LogInScreen from './src/screens/LogInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import AfterLoginScreen from './src/screens/AfterLogInScreen';
import { SmallText } from "./src/components/Text/SmallText";
import { MediumText } from './src/components/Text/MediumText';
import { LargeText } from './src/components/Text/LargeText';
import { XSmallText } from './src/components/Text/XSmallText';

import NewPaymentScreen from './src/screens/NewPaymentScreen';

import { UserContextProvider } from './src/components/Context/userContext';
import { registerRootComponent } from 'expo';
import HomeScreen, { RootStackParamList } from './src/screens/HomeScreen';
import SplitScreen from './src/screens/SplitScreen';


const Stack = createNativeStackNavigator();


export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "WorkSans": require('./src/assets/fonts/WorkSans-VariableFont_wght.ttf'),
        "Quicksand": require('./src/assets/fonts/Quicksand-VariableFont_wght.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <UserContextProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="LogIn" component={LogInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Split" component={SplitScreen} />
          <Stack.Screen name="NewPayment" component={NewPaymentScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContextProvider>
  );
}

registerRootComponent(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});