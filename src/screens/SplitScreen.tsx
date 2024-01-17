import React, { useEffect, useState } from 'react'
import { PaymentType, UserType } from '../utils/types';
import { onSnapshot, doc, DocumentReference, getDoc } from 'firebase/firestore';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import Payment from '../components/Payment';
import { RouteProp } from '@react-navigation/native';
import BackButton from '../components/Buttons/BackButton';
import { RootStackParamList } from './HomeScreen';
import { colors } from '../utils/colors';
import Spacer from '../components/Spacer';
import { MediumText } from '../components/Text/MediumText';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlueLargeButton } from '../components/Buttons/BlueLargeButton';
import { db } from '../../firebaseConfig';




type SplitScreenRouteProp = RouteProp<RootStackParamList, 'Split'>
type SplitScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Split'>

type SplitScreenProps = {
  route: SplitScreenRouteProp
  navigation: SplitScreenNavigationProp
}


const SplitScreen = ({route, navigation}: SplitScreenProps) => {
    const [payments, setPayments] = useState<PaymentType[]>([]);
    const [users, setUsers] = useState<UserType[]>([]);

    const { split } = route.params

    useEffect(() => {
        // Define a function inside useEffect to fetch payments
        const fetchPayments = async (paymentsID: DocumentReference[]) => {
            try {
                const paymentsPromises = paymentsID.map(paymentRef => getDoc(paymentRef));
                const paymentDocs = await Promise.all(paymentsPromises);
                const paymentItems = paymentDocs.map(doc => ({ ...doc.data(), id: doc.id } as PaymentType));
                setPayments(paymentItems);
            } catch (error) {
                console.error("Error fetching payments: ", error);
            }
        };
    
        if (split.id instanceof DocumentReference) {
            // Subscribe to the Split document for real-time updates
            const unsubscribe = onSnapshot(split.id, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const splitData = docSnapshot.data();
                    fetchPayments(splitData.paymentsID);
                }
            });
    
            // Return a cleanup function to unsubscribe
            return () => unsubscribe();
        } else {
            console.error('split.id is not a DocumentReference:', split.id);
        }
    }, []); // Empty dependency array for setup on mount only
    


    useEffect(() => {
        const fetchData = async () => {
            try {
                const items = [];
                for (const docRef of split.users) {
                    const docSnapshot = await getDoc(docRef);
                    if (docSnapshot.exists()) {
                        items.push({ ...docSnapshot.data(), id: docSnapshot.ref } as UserType);
                    }
                }
                setUsers(items);    
                console.log(items);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
    
        fetchData();
    }, []); 


    const findUserByCreatorRef = (creatorRef: DocumentReference): UserType | undefined => {
        return users.find(user => user.id === creatorRef);
    };


  return (
    <SafeAreaView style={styles.white}>
        <View style={styles.title}>
            <BackButton color={colors.tertiary}/>
            <Spacer horizontal={true} size={110}></Spacer>
            <MediumText>{split.name}</MediumText>
        </View>
        <ScrollView contentContainerStyle={styles.scrollView}>
            {payments.map((payment) => {
                const creatorData = findUserByCreatorRef(payment.creator)
                console.log(creatorData)

                return(
                    <Payment 
                        id={payment.id}
                        partOfPayment={false} 
                        currency={split.currency}
                        payment={payment} 
                        //creatorData={creatorData}
                    />
                )})
            }
        </ScrollView>
        <View>
            <BlueLargeButton title={"Add payment"} onClick={() => navigation.navigate('NewPayment', {split: split, users: users})}/>
        </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
    white: {
        flex: 1,
        backgroundColor: '#ffff',
    },
    scrollView: {
        flexGrow: 2,
        alignItems: 'center',
        paddingTop: 10, 
    },
    title:{
        marginTop: 15, 
        marginLeft: 20,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignContent: 'flex-start'
      }
  });




export default SplitScreen
