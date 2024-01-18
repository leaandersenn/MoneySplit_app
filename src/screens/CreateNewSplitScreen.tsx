import React, { useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { DocumentSnapshot, collection, getDocs, addDoc, updateDoc, arrayUnion, doc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import { UserType } from '../utils/types'
import { XSmallText } from '../components/Text/XSmallText'
import TextInputField from '../components/InputFields/TextInputField'
import { BlueLargeButton } from '../components/Buttons/BlueLargeButton'
import SelectDropdown from 'react-native-select-dropdown'
import ToggleSwitch from '../components/ToggleSwitch'
import { RootStackParamList } from './HomeScreen'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { colors } from '../utils/colors'
import BackButton from '../components/Buttons/BackButton'
import { MediumText } from '../components/Text/MediumText'
import Spacer from '../components/Spacer'

//TODO: communication w/ Exchange API
type CreateNewSplitScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateNewSplitScreen'>

type CreateNewSplitScreenScreenProps = {
  navigation: CreateNewSplitScreenNavigationProp
}
export default function CreateNewSplitScreen({navigation}: CreateNewSplitScreenScreenProps) {
  const [splitName, setSplitName] = useState<string>('')
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null)
  
  const [users, setUsers] = useState<UserType[]>([])
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([])
  const [selectedColor, setSelectedColor] = useState<string | null>(null)


  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
  };

  const currencyOptions = [ 
    { label: 'NOK', value: 'NOK' },
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
    { label: 'GBP', value: 'GBP' }
  ]

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getDocs(collection(db, 'Users'));
      const items = response.docs.map((doc: DocumentSnapshot) => ({...doc.data(), id: doc.id} as UserType));
      setUsers(items);
      console.log('Users:', items);
    };

    fetchUsers()
  }, [])


  const handleSelectUser = (user: UserType) => {
    if (selectedUsers.some(selectedUser => selectedUser.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id))
    } else {
      setSelectedUsers([...selectedUsers, user])
    }
  };

  const createNewSplit = async () => {
    if (!selectedColor || !selectedCurrency || !splitName || !selectedColor ||  selectedUsers.length<=1) {
      alert('Please fill all the fields')
      return;
    }

    try {
      const userIDs = selectedUsers.map(user => user.id);

      const splitData = {
        name: splitName,
        creationDate: new Date(),
        currency: selectedCurrency,
        cardColor: selectedColor,
        users: userIDs, 
        paymentsID: []
      };
      const docRef = await addDoc(collection(db, 'Splits'), splitData);

      for (const user of selectedUsers) {
        const userDocRef = doc(db, 'Users', user.id);
        await updateDoc(userDocRef, {
          splits: arrayUnion(docRef)
        });
      }
      alert('Split created successfully');


      navigation.navigate('Home');
    } catch (error) {
      console.error('Error creating split:', error);
      alert('Split creation failed')
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
          <BackButton color={colors.tertiary}/>
      </View>
      <View style={styles.title}>
          <MediumText>New Split</MediumText>
      </View>
      
      <View style={styles.styleButtonsContainer}>
        <TouchableOpacity
            style={[
              styles.styleButton,
              styles.styleButtonRed,
              selectedColor === 'pink' && styles.selectedStyleButton
            ]}
            onPress={() => handleSelectColor('pink')}
          />
          <TouchableOpacity
            style={[
              styles.styleButton,
              styles.styleButtonGreen,
              selectedColor === 'green' && styles.selectedStyleButton
            ]}
            onPress={() => handleSelectColor('green')}
          />
          <TouchableOpacity
            style={[
              styles.styleButton,
              styles.styleButtonBlue,
              selectedColor === 'blue' && styles.selectedStyleButton
            ]}
            onPress={() => handleSelectColor('blue')}
          />
      </View>

      <View style={styles.center}>
        <TextInputField
          placeholder="Give the Split a name..."
          value={splitName}
          onChangeText={setSplitName}
        />

        <View style={styles.centerItem}>
        <XSmallText>Select a currency...</XSmallText>
          <SelectDropdown
              data={currencyOptions}
              onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                  setSelectedCurrency(selectedItem.value);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.label;
              }}
              rowTextForSelection={(item, index) => {
                  return item.label;
              }}
              defaultValue={''} 
          />
        </View>

        <FlatList
          data={users}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View>
              <Spacer size={5} horizontal={false}/>

              <View style={styles.row}>
                <ToggleSwitch
                  onValueChange={() => handleSelectUser(item)}
                />
                <Spacer size={5} horizontal={true}/>
                <XSmallText>{item.firstName} {item.lastName}</XSmallText>
              </View>

              <Spacer size={5} horizontal={false}/>
            </View>
          )}
          />
      </View>

      <View style={styles.bottomButton}>
        <BlueLargeButton title="Create New Split" onClick={createNewSplit} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20, 
    justifyContent: 'center',
    alignContent: 'center'
  },
  center:{
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center'
  },
  back:{
    marginTop: 15, 
    marginBottom: 15,
    flexDirection: 'row',
    alignContent: 'flex-start'
  },
  title:{
    marginTop: 15, 
    marginBottom: 30,
    flexDirection: 'column',
    alignItems: 'center'
  },
  centerItem:{
    marginTop: 15, 
    marginBottom: 15,
    flexDirection: 'column',
    alignItems: 'center'
  },
  bottomButton:{
    marginTop: 75, 
    marginBottom: 15,
    flexDirection: 'column',
    alignItems: 'center'
  },
  row:{
    flexDirection: 'row', 
    alignContent: 'center'
  },
  marginTopBottom: {
    marginBottom: 20,
    marginTop: 20,
  },
  listContainer: {
    width: '100%', 
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '100%',
    padding: 10,
    marginBottom: 20
  },
  checkboxStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5
},
  userItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectedUser: {
    backgroundColor: '#e7f3fe'
  },
  styleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    marginTop: 20,
  },
  selectedStyleButton: {
    borderColor: '#2c78f2',
  },
  styleButton: {
    width: 40,
    height: 40,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#f2f2f2',
    marginHorizontal: 10,
  },
  styleButtonRed: {
    backgroundColor: '#FF91E0',
  },
  styleButtonGreen: {
    backgroundColor: '#43B05C',
  },
  styleButtonBlue: {
    backgroundColor: '#5BD4FA',
  },
})