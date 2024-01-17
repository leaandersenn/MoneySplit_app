import React, { useEffect, useState } from 'react'
import { Button, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LargeText } from '../components/Text/LargeText';
import { DocumentReference, DocumentSnapshot, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { SplitType, UserType } from '../utils/types';
import SplitCard from '../components/SplitCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FIREBASE_AUTH, db } from '../../firebaseConfig';
import { GreenLargeButton } from '../components/Buttons/GreenLargeButton';
import CreateNewSplitScreen from './CreateNewSplitScreen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export type RootStackParamList = {
    Home: {user: UserType};
    Split: {split: SplitType};
    LogIn: undefined;
    SignUp: undefined;
    NewPayment: {split: SplitType, users: UserType[]};
    CreateNewSplitScreen: {user: UserType};
}

//type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>

type HomeScreenProps = {
  //route: HomeScreenRouteProp
  navigation: HomeScreenNavigationProp
}

const HomeScreen = ({navigation}: HomeScreenProps) => {
  const [user, setUser] = useState<UserType>();
  const [data, setData] = useState<SplitType[]>([]);

  const currentUserEmail = FIREBASE_AUTH.currentUser?.email;
  console.log('Current user: ', currentUserEmail);
  
  useEffect(() => {
    const fetchData = async () => {
          if (!FIREBASE_AUTH.currentUser?.email) {
              console.log('No current user email available');
              return;
          }
          try {
              const usersQuery = query(collection(db, 'Users'), where('email', '==', currentUserEmail));
              const querySnapshot = await getDocs(usersQuery);
              if (!querySnapshot.empty) {
                  const userDoc = querySnapshot.docs[0]; // Assuming email is unique and there's only one document
                  console.log('User document data:', userDoc.data());
                  setUser(userDoc.data() as UserType); // Cast the document data to UserType
              } else {
                  console.log('No user found with the given email');
              }
          } catch (error) {
              console.error('Error fetching user document:', error);
          }
      };

      fetchData();
  }, []);
    
    const handleCreateNewSplit = () => {
      console.log('Add new split')
      navigation.navigate('CreateNewSplitScreen', {user: user})
    };

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
                setData(items)
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
      <TouchableOpacity
        style={styles.greenButton}
        onPress={handleCreateNewSplit}
        >
      <FontAwesome name="plus" color="white" size={20}/>
      </TouchableOpacity>

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
    },
    greenButton: {
      position: 'absolute',
      top: 90, // Adjust this value to position the button as needed
      right: 20, // Adjust this value to position the button as needed
      backgroundColor: '#43B05C', // Green color
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1, // Ensures the button is on top of other content
    },
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