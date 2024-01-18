import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { LargeText } from '../components/Text/LargeText';
import { DocumentReference, DocumentSnapshot, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { SplitType, UserType } from '../utils/types';
import SplitCard from '../components/SplitCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FIREBASE_AUTH, db } from '../../firebaseConfig';
import SignOutButton from '../components/Buttons/SignOutButton';
import { getAuth } from 'firebase/auth';


export type RootStackParamList = {
    Home: undefined;
    Split: {split: SplitType};
    LogIn: undefined;
    SignUp: undefined;
    NewPayment: {split: SplitType, users: UserType[]};
    CreateNewSplitScreen: {user: any};
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
    const [loading, setLoading] = useState(true)

    const currentUserEmail = FIREBASE_AUTH.currentUser?.email;
    console.log('Current user: ', currentUserEmail);

    useEffect(() => {
      const fetchData = async () => {
          if (!currentUserEmail) {
              console.log('No current user email available');
              return;
          }
          try {
              const usersQuery = query(collection(db, 'Users'), where('email', '==', currentUserEmail));
              console.log("heihei");
              const querySnapshot = await getDocs(usersQuery);
              if (!querySnapshot.empty) {
                console.log("heiheihade");
                  const userDoc = querySnapshot.docs[0]; 
                  console.log('User document data:', userDoc.data());
                  setUser(userDoc.data() as UserType); 
                  console.log(userDoc.data() as UserType + "dette er faen brukeren")
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

    const handleSignOut = async () => {
      const auth = getAuth();
      try {
          await auth
           .signOut()
           .then(() => navigation.navigate('LogIn'));

      } catch (error) {
          alert('Error signing out:');
      }
  };



  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <LargeText>{`Splits`}</LargeText>
      </View>
      
      <>
      <ScrollView contentContainerStyle={styles.cards}>
        {loading ? 
          <ActivityIndicator style={styles.loading} size="large" color="#7aeb5e"/>
          : data.map((e) => {
            return(
                <SplitCard 
                    id={`${e.id}`}
                    split={e}
                    onClick={() => navigation.navigate('Split', {split: e })}
                />)
            })}
      </ScrollView>
      <SignOutButton onClick={handleSignOut}/>
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
    loading: {
      marginTop: 120,
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