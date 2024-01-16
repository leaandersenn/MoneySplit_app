import React, { useEffect, useState } from 'react'
import { Button, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { LargeText } from '../components/Text/LargeText';
import { DocumentReference, DocumentSnapshot, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { SplitType, UserType } from '../utils/types';
import SplitCard from '../components/SplitCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { db } from '../../firebaseConfig';


export type RootStackParamList = {
    Home: {user: UserType};
    Split: {split: SplitType};
    LogIn: undefined;
    SignUp: undefined;
    NewPayment: {split: SplitType, users: UserType[]};
}

//type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>

type HomeScreenProps = {
  //route: HomeScreenRouteProp
  navigation: HomeScreenNavigationProp
}


const HomeScreen = ({navigation}: HomeScreenProps) => {
    const [user, setUser] = useState<UserType>()
    const [data, setData] = useState<SplitType[]>([])


    useEffect(() => {
      const fetchData = async () => {
        try {
          const docRef = doc(db, 'Users', 'wcpKHPAbtjZWEZzm5Puw')
          getDoc(docRef)
            .then((docSnapshot) => {
              if (docSnapshot.exists()) {
                console.log('Document data:', docSnapshot.data())
                setUser(docSnapshot.data() as UserType); // Cast the document data to UserType
              } else {
                console.log('No such document!')
              }
            })
            .catch((error) => {
              console.error('Error fetching document:', error)
            });
        } catch (error) {
          console.error('Error in fetchData:', error)
        }
      };
  
      fetchData()
    }, [])
    

    useEffect(() => {
        const fetchData = async () => {
          if (!user) {
            console.log('User data is not available yet. No splits to render');
            return;
          }
            try {
                const items = [];
                for (const docRef of user.splits) {
                    const docSnapshot = await getDoc(docRef)
                    if (docSnapshot.exists()) {
                        items.push({ ...docSnapshot.data(), id: docSnapshot.ref } as SplitType)
                    }
                }
                console.log(items)
                console.log("kommer hit")
                setData(items)
                console.log(data)
            } catch (error) {
                console.error("Error fetching data: ", error)
            }
        };
        
        fetchData()
    }, [user])


  return (
    <View style={styles.container}>
        {/* <Button
            title="Gå til Logg In"
            onPress={() => navigation.navigate('LogIn')}
        />
        <Button
            title="Gå til Sign Up"
            onPress={() => navigation.navigate('SignUp')}
        /> */}
      <View style={styles.title}>
        <LargeText>{`Splits`}</LargeText>
      </View>
      
      <>
      <ScrollView contentContainerStyle={styles.cards}>
        {data.map((e) => {
            return(
                <SplitCard 
                    id={`${e.id}`}
                    split={e}
                    onClick={() => navigation.navigate('Split', {split: e })}
                />)
            })}
      </ScrollView>
      </>
    </View>
  )
}

export default HomeScreen



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffff'
    },
    cards: {
      alignItems: 'center'
    },
    image: {
      width: 100, 
      height: 100, 
    },
    title:{
      marginTop: 75, 
      marginLeft: 20,
      marginBottom: 10,
      flexDirection: 'row'
    }
  });



/* 

    const [data, setData] = useState<SplitType[]>([])
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const items = [];
                for (const docRef of user.splits) {
                    const docSnapshot = await getDoc(docRef)
                    if (docSnapshot.exists()) {
                        items.push({ ...docSnapshot.data(), id: docSnapshot.id } as SplitType)
                    }
                }
                setData(items as SplitType[])
                console.log(items)
            } catch (error) {
                console.error("Error fetching data: ", error)
            }
        };
    
        fetchData()
    }, [])

   */