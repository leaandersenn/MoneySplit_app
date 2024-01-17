import React, { useEffect, useState } from 'react'
import { Button, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { LargeText } from '../components/Text/LargeText';
import { DocumentReference, DocumentSnapshot, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { SplitType, UserType } from '../utils/types';
import SplitCard from '../components/SplitCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FIREBASE_AUTH, db } from '../../firebaseConfig';
import { GreenLargeButton } from '../components/Buttons/GreenLargeButton';
import CreateNewSplitScreen from './CreateNewSplitScreen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SignOutButton from '../components/Buttons/SignOutButton';
import { getAuth } from 'firebase/auth';


export type RootStackParamList = {
    Home: undefined;
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
    const [user, setUser] = useState<UserType>()
    const [data, setData] = useState<SplitType[]>([])
    const [loading, setLoading] = useState(true)


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
       /*  navigation.navigate('CreateNewSplitScreen', {user: user}) */
      };

    useEffect(() => {
        const fetchData = async () => {
          if (!user) {
            console.log('User data is not available yet. No splits to render');
            return;
          }
            try {
                const items = [];
                for (const docRef of user.splits!) {
                    const docSnapshot = await getDoc(docRef)
                    if (docSnapshot.exists()) {
                        items.push({ ...docSnapshot.data(), id: docSnapshot.ref } as any as SplitType)
                    }
                }
                console.log(items)
                console.log("kommer hit")
                setData(items)
                console.log(data + "data, homescreen: 90")
            } catch (error) {
                console.error("Error fetching data: ", error)
            }
            finally{
              setLoading(false)
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
      </>
      <SignOutButton onClick={handleSignOut} />
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
