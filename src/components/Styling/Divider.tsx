import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Title {
    title: String
}
const DividerWithText = (props: Title) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{props.title}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 45,
    marginRight: 45,
    marginTop: 24,
    marginBottom: 13
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#808080',
  },
  text: {
    width: 100,
    textAlign: 'center',
    color: '#808080',
  },
});

export default DividerWithText;
