import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import * as Font from 'expo-font';

import { SmallText } from "./src/components/Text/SmallText";
import { MediumText } from './src/components/Text/MediumText';
import { LargeText } from './src/components/Text/LargeText';
import { XSmallText } from './src/components/Text/XSmallText';



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
    <View style={styles.container}>
      <Image source={require('./src/utils/cards.webp')} style={styles.image}/>

      <LargeText children={"Money Split"}/>
      <MediumText children={"Money Split"}/>
      <SmallText children={"Money Split"}/>
      <XSmallText children={"Nå skriver jeg inn en hel masse her bare for å se hvordan det vil bli seende ut på skjermen. Kanskje blir det stygt. Kanskje blir det fint."}/>
      
      <StatusBar style="auto" />
    </View>
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
