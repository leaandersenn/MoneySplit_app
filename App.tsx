import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import * as Font from 'expo-font';

import { SmallText } from "./src/components/Text/SmallText";
import { MediumText } from './src/components/Text/MediumText';
import { LargeText } from './src/components/Text/LargeText';
import { XSmallText } from './src/components/Text/XSmallText';
import { db } from './firebaseConfig';
import { DocumentSnapshot, collection, getDocs } from 'firebase/firestore'
import Payment from './src/components/Payment';
import { PaymentType } from './src/utils/types';





export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [data, setData] = useState<PaymentType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payments = collection(db, 'Payments');
        const response = await getDocs(payments);
        console.log(response)
        const items = response.docs.map((doc: DocumentSnapshot) => ({...doc.data(), id: doc.id} as PaymentType));
        setData(items)
        console.log(items)

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []); 

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
    <View style={styles.container}>
      <Image source={require('./src/utils/cards.webp')} style={styles.image}/>

      {/* <LargeText children={"Money Split"}/>
      <MediumText children={"Money Split"}/>
      <SmallText children={"Money Split"}/>
      <XSmallText children={"Nå skriver jeg inn en hel masse her bare for å se hvordan det vil bli seende ut på skjermen. Kanskje blir det stygt. Kanskje blir det fint."}/> */}
      
      <StatusBar style="auto" />

      {Object.entries(data).map((e) => {
        return(
        <Payment 
          id={Object(e[0])}
          partOfPayment={false} 
          yourPartIs={Object.keys(e[1].participants)[0]} 
          payment={{
            id: Object(e[0]),
            creator: Object(e[1].creator),
            sumOfPayment: Object(e[1].sumOfPayment),
            currency: Object(e[1].currency),
            title: Object(e[1].title),
            participants: Object(e[1].participants),
            relatedSplitsId: Object(e[1].relatedSplitsId)
          }} 
        />)
        })}
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
    width: 100, 
    height: 100, 
  },
});
