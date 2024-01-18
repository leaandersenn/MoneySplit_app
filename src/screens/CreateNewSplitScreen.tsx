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

      <XSmallText>Give the Split a name...</XSmallText>
      <TextInputField
        placeholder="Name"
        value={splitName}
        onChangeText={setSplitName}
      />

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

      <FlatList
        data={users}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <ToggleSwitch
              onValueChange={() => handleSelectUser(item)}
            />
            <XSmallText>{item.firstName} {item.lastName}</XSmallText>
          </View>
        )}
        />

      <BlueLargeButton title="Create New Split" onClick={createNewSplit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
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
  currencyPicker: {
    backgroundColor: 'rgba(217, 217, 217, 0.39)',
    width: 324, 
    height: 48,
    borderRadius: 20,
    paddingLeft: 20,
    marginBottom: 21,
  },
  xSmallText: {
    marginBottom: 10,
    fontWeight: 'bold',
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
    marginBottom: 20,
  },
  selectedStyleButton: {
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  styleButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  listContainer: {
    width: '100%', 
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