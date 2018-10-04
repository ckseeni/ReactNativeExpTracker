import React from 'react';
import {StyleSheet, Text, TextInput, View, Button} from 'react-native';

export default class App extends React.Component{
  render() {
    return (
      <View style = {styles.mainView}>
        <Text style = {styles.title}>Expense Tracker</Text>
        <Text style={styles.name}>Name</Text>
        <TextInput style={styles.nameInput} placeholder = "Enter the item name" placeholderTextColor = "#000000"/>
        <Text style={styles.amount}>Amount</Text>
        <TextInput style={styles.amountInput} placeholder = "Enter the amount" placeholderTextColor = "#000000"/>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  title: {
    top: 100,
    textAlign: 'center',
    fontSize: 25,
    color: '#FFFFFF'
  },
  name: {
    top: 130,
    textAlign: 'center',
    fontSize: 20,
    color: '#FFFFFF'
  },
  nameInput: {
    top: 160,
    height: 40,
    width: 230,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
  },
  amount: {
    top: 190,
    textAlign: 'center',
    fontSize: 20,
    color: '#FFFFFF'
  },
  amountInput: {
    top: 210,
    height: 40,
    width: 230,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
  }
});
