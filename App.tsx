import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, View} from 'react-native';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import LogInScreen from './src/screens/LogInScreen';
import SignUpScreen from './src/screens/SignUpScreen';

import { SmallText } from "./src/components/Text/SmallText";
import { MediumText } from './src/components/Text/MediumText';
import { LargeText } from './src/components/Text/LargeText';
import { XSmallText } from './src/components/Text/XSmallText';



type RootStackParamList = {
  Home: undefined;
  LogIn: undefined;
  SignUp: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
     {/*  <Image source={require('./src/assets/cards.webp')} style={styles.image}/> */}
      <LargeText>{"Money Split"}</LargeText>
      <MediumText>{"Money Split"}</MediumText>
      <SmallText>{"Money Split"}</SmallText>
      <XSmallText>{"Nå skriver jeg inn en hel masse her bare for å se hvordan det vil bli seende ut på skjermen. Kanskje blir det stygt. Kanskje blir det fint."}</XSmallText>
      <Button
        title="Gå til Logg In"
        onPress={() => navigation.navigate('LogIn')}
      />
      <Button
        title="Gå til Sign Up"
        onPress={() => navigation.navigate('SignUp')}
      />
      <StatusBar style="auto" />
    </View>
  );
}

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
    return null; // Or some kind of loading indicator
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="LogIn" component={LogInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
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
    width: 100, // Set your desired width
    height: 100, // Set your desired height
  },
});