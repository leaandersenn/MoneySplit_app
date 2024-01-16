import React, { useEffect, useState } from 'react'
import { Text, View, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { CheckBox } from 'react-native-elements'
import RNPickerSelect from 'react-native-picker-select'

import { DocumentSnapshot, collection, getDocs, addDoc, updateDoc, arrayUnion, doc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'

import { UserType } from '../utils/types'

import { XSmallText } from '../components/Text/XSmallText'
import TextInputField from '../components/InputFields/TextInputField'
import { BlueLargeButton } from '../components/Buttons/BlueLargeButton'

export default function CreateNewSplitScreen() {
  const [splitName, setSplitName] = useState<string>('')
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  const [users, setUsers] = useState<UserType[]>([])
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([])

  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
  };

  const currencyOptions = [ //TODO: communication w/ Exchange API
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
    };

    fetchUsers()
  }, [])

  const handleSelectUser = (user: UserType) => {
    if (selectedUsers.some(selectedUser => selectedUser.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  useEffect(() => {
    // Filter users based on search query
    const filtered = users.filter(user =>
    user.firstName.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
    }, [searchQuery, users]);

  const isUserSelected = (user: UserType) => {
    return selectedUsers.some(selectedUser => selectedUser === user)
  }

  const createNewSplit = async () => {
    try {
      const splitData = {
        name: splitName,
        creationDate: new Date(),
        currency: selectedCurrency,
        cardColor: selectedColor,
        users: selectedUsers.map(user => user.id),
      };
      const docRef = await addDoc(collection(db, 'Splits'), splitData);

      // Update each selected user's document in the Users collection
      for (const user of selectedUsers) {
        const userDocRef = doc(db, 'Users', user.id);
        await updateDoc(userDocRef, {
          splits: arrayUnion(docRef)
        });
      }
    } catch (error) {
      console.error('Error creating split:', error);
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
      <RNPickerSelect
        style={{ inputIOS: styles.currencyPicker }}
        onValueChange={(value) => { setSelectedCurrency(value) }}
        items={currencyOptions}
        placeholder={{ label: 'Currency', value: null }}
        value={selectedCurrency}
      />

      <XSmallText>Select users to split with...</XSmallText>
      <TextInputField
        placeholder="Search Users"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <CheckBox
              checked={isUserSelected(item)}
              onPress={() => handleSelectUser(item)}
            />
            <XSmallText>{item.firstName} {item.lastName}</XSmallText>
          </View>
        )}
      />

    <BlueLargeButton title="Create New Split" onClick={createNewSplit} />
    {/* <Button title="Create New Split" onPress={createNewSplit} /> */}

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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 4,
  },

  styleButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
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
