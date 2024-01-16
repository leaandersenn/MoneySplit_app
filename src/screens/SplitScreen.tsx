import React, { useEffect, useState } from 'react'
import { PaymentType, SplitType, UserType } from '../utils/types';
import { getDoc } from 'firebase/firestore';
import { StyleSheet, View, ScrollView } from 'react-native';
import Payment from '../components/Payment';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BackButton from '../components/Buttons/BackButton';


type RootStackParamList = {
    Home: {user: UserType};
    Split: {split: SplitType};
}

type SplitScreenRouteProp = RouteProp<RootStackParamList, 'Split'>
type SplitScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Split'>

type SplitScreenProps = {
    route: SplitScreenRouteProp
    navigation: SplitScreenNavigationProp
}



const SplitScreen = ({route}: SplitScreenProps) => {
    const [data, setData] = useState<PaymentType[]>([]);
    const split = route.params.split;

    console.log(split)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const items = [];
                for (const docRef of split.paymentsID) {
                    const docSnapshot = await getDoc(docRef);
                    if (docSnapshot.exists()) {
                        items.push({ ...docSnapshot.data(), id: docSnapshot.id } as PaymentType);
                    }
                }
                setData(items as PaymentType[]);
                console.log(items);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
    
        fetchData();
    }, []); 


  return (
    <View style={styles.container}>
        <ScrollView>
            <View>
                <BackButton />
            </View>
        {data.map((e) => {
            return(
            <Payment 
            id={e.id}
            partOfPayment={false} 
            yourPartIs={e.participants.keys().next().value} 
            currency={split.currency}
            payment={e} 
            />)
            })}
        </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });




export default SplitScreen
