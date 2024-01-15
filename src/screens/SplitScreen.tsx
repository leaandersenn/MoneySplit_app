import React, { useEffect, useState } from 'react'
import { PaymentType } from '../utils/types';
import { DocumentSnapshot, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { StyleSheet, View, ScrollView } from 'react-native';
import Payment from '../components/Payment';



const SplitScreen = () => {
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


  return (
    <View>
        <ScrollView>
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
