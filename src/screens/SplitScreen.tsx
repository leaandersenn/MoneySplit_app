import React, { useEffect, useState } from 'react'
import { PaymentType, UserType } from '../utils/types';
import { onSnapshot, doc, DocumentReference, getDoc } from 'firebase/firestore';
import { StyleSheet, View, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import Payment from '../components/Payment';
import { RouteProp } from '@react-navigation/native';
import BackButton from '../components/Buttons/BackButton';
import { RootStackParamList } from './HomeScreen';
import { colors } from '../utils/colors';
import Spacer from '../components/Spacer';
import { MediumText } from '../components/Text/MediumText';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlueLargeButton } from '../components/Buttons/BlueLargeButton';
import { SmallText } from '../components/Text/SmallText';
import { db } from '../../firebaseConfig';




type SplitScreenRouteProp = RouteProp<RootStackParamList, 'Split'>
type SplitScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Split'>

type SplitScreenProps = {
  route: SplitScreenRouteProp
  navigation: SplitScreenNavigationProp
}


const SplitScreen = ({route, navigation}: SplitScreenProps) => {
    const [payments, setPayments] = useState<PaymentType[]>([])
    const [users, setUsers] = useState<UserType[]>([])
    const [loading, setLoading] = useState(true)
    const [usersMap, setUsersMap] = useState<Map<string, UserType>>(new Map);

    const { split } = route.params


    useEffect(() => {
        const fetchData = async () => {
            try {
                const newUsersMap = new Map<string, UserType>();
                const items = []
                for (const userId of split.users) {
                    const docRef = doc(db, "Users", userId); // Replace with correct path if necessary
                    const docSnapshot = await getDoc(docRef);
                    if (docSnapshot.exists()) {
                        const userData = { ...docSnapshot.data(), id: docSnapshot.id } as UserType;
                        items.push(userData);
                        newUsersMap.set(docSnapshot.id, userData);
                    }
                }
                setUsersMap(newUsersMap);
                setUsers(items);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
    
        fetchData();
    }, []);


    useEffect(() => {
        const fetchPayments = async (paymentsID: DocumentReference[]) => {
            try {
                const paymentsPromises = paymentsID.map(paymentRef => getDoc(paymentRef))
                const paymentDocs = await Promise.all(paymentsPromises)
                const paymentItems = paymentDocs.map(doc => ({ ...doc.data(), id: doc.id } as PaymentType))
                setPayments(paymentItems)

                console.log('paymentItems')
                console.log(paymentItems)
            } catch (error) {
                console.error("Error fetching payments: ", error)
            }finally{
                setLoading(false)
              }
        };
    
        if (split.id instanceof DocumentReference) {
            const unsubscribe = onSnapshot(split.id, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const splitData = docSnapshot.data()
                    fetchPayments(splitData.paymentsID)
                }
            });
    
            return () => unsubscribe();
        } else {
            console.error('split.id is not a DocumentReference:', split.id)
        }
    }, []); 
    






  return (
    <SafeAreaView style={styles.white}>
        <View style={styles.title}>
            <BackButton color={colors.tertiary}/>
            <Spacer horizontal={true} size={110}></Spacer>
            <MediumText>{split.name}</MediumText>
        </View>
        <ScrollView contentContainerStyle={styles.scrollView}>
        {loading ? 
          <ActivityIndicator style={styles.loading} size="large" color="#7aeb5e"/>
          : payments.map((payment) => {
                    const userData = usersMap.get(payment.creator)
                      return (
                          <Payment 
                              id={payment.id}
                              partOfPayment={false} 
                              currency={split.currency}
                              payment={payment} 
                              creatorData={userData}
                          />
                      );
                  })
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
    loading: {
      marginTop: 120,
      alignItems: 'center'
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

