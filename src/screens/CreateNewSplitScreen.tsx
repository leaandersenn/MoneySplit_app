import React, { useEffect, useState } from 'react'
import { Text, View, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { CheckBox } from 'react-native-elements'
import RNPickerSelect from 'react-native-picker-select'

import { DocumentSnapshot, collection, getDocs, addDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'

import { User } from '../utils/types'

import { XSmallText } from '../components/Text/XSmallText'
import TextInputField from '../components/InputFields/TextInputField'
import { BlueLargeButton } from '../components/Buttons/BlueLargeButton'

export default function CreateNewSplitScreen() {
  const [splitName, setSplitName] = useState<string>('')
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])

  const [selectedColor, setSelectedColor] = useState<string | null>(null);

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
      const items = response.docs.map((doc: DocumentSnapshot) => ({...doc.data(), id: doc.id} as User));
      setUsers(items);
    };

    fetchUsers()
  }, [])

  const handleSelectUser = (user: User) => {
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

  const isUserSelected = (user: User) => {
    return selectedUsers.some(selectedUser => selectedUser === user)
  }

  const createNewSplit = async () => {
    try {
      const splitData = {
        name: splitName,
        currency: selectedCurrency,
        users: selectedUsers.map(user => user.id),
        cardColor: selectedColor,
        dateCreated: new Date(),
        // Include any other fields you need for the Split
      };
      const docRef = await addDoc(collection(db, 'Splits'), splitData);
      alert('Split created successfully');
    } catch (error) {
      console.error('Error creating split:', error);
      alert('Error creating split');
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
