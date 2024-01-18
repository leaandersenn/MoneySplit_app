import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LargeText } from '../components/Text/LargeText';
import { DocumentReference, DocumentSnapshot, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { SplitType, UserType } from '../utils/types';
import SplitCard from '../components/SplitCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FIREBASE_AUTH, db } from '../../firebaseConfig';
import SignOutButton from '../components/Buttons/SignOutButton';
import { User, getAuth } from 'firebase/auth';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Spacer from '../components/Spacer';


export type RootStackParamList = {
    Home: undefined;
    Split: {split: SplitType};
    LogIn: undefined;
    SignUp: undefined;
    NewPayment: {split: SplitType, users: UserType[], userId: string};
    CreateNewSplitScreen: {user: UserType | undefined};
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

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUserEmail = FIREBASE_AUTH.currentUser?.email;
        if (currentUserEmail) {
          const usersQuery = query(collection(db, 'Users'), where('email', '==', currentUserEmail));
          const querySnapshot = await getDocs(usersQuery);
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data(); 
            console.log(userData)
            setUser(userData as UserType); 
          } else {
            console.log('Ingen dokumenter funnet med den e-postadressen');
          }
        } else {
          console.log('Ingen bruker er logget inn');
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    };
  
    fetchData();
  }, []);
  

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
              setData(items)
              console.log(data)
          } catch (error) {
              console.error("Error fetching data: ", error)
          }
          finally{
            setLoading(false)
          }
      };
      
      fetchData()
  }, [user])

  const handleCreateNewSplit = () => {
    console.log('Add new split')
    navigation.navigate('CreateNewSplitScreen', {user: user})
  };

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
        <TouchableOpacity
          style={styles.greenButton}
          onPress={handleCreateNewSplit}
          >
        <FontAwesome name="plus" color="white" size={20}/>  
      </TouchableOpacity>
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
      <Spacer size={20} horizontal={false}/>
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
    title:{
      marginTop: 75, 
      marginLeft: 20,
      marginBottom: 10,
      marginRight: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
     
    },
    greenButton: {
      backgroundColor: '#43B05C', 
      width: 50,
      height: 50,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    }
  });