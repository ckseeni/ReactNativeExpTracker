import React from 'react';
import {Modal, AsyncStorage, StyleSheet, Text, TextInput, View, Button, TouchableOpacity} from 'react-native';

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      name : '',
      amount : '',
      modalVisible : false
    }
  }

  async _storeExpItem(expDataJson) {
      var item = await AsyncStorage.getItem("expenses");
      if(item !== null) {
        var expArray = JSON.parse(item);
        expArray.push(expDataJson);
        await AsyncStorage.setItem("expenses", JSON.stringify(expArray));
      }
      else {
        var expArray = [];
        expArray.push(expDataJson);
        await AsyncStorage.setItem("expenses", JSON.stringify(expArray));
      }
  }

  async _retrieveExpItem() {
    var item =  await AsyncStorage.getItem("expenses");
    var expArray = JSON.parse(item);
    return expArray;
  }

  _onPressAddButton() {
    var expDataJson = {
      "name" : this.state.name,
      "amount" : this.state.amount
    };
    this._storeExpItem(expDataJson).then(() => {
      alert("stored");
    }).catch((error) => {
        alert(error);
    });
  }

  _onPressRetrieveButton() {
    this._retrieveExpItem().then((expArray) => {
      for(var i=0; i<expArray.length; i++){
        alert(expArray[i].name + "" + expArray[i].amount);
      }
    }).catch((error) => {
        alert(error);
    });
  }

  _setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View style = {styles.mainView}>
        <Text style = {styles.title}>Expense Tracker</Text>
        <Text style = {styles.name}>Name</Text>
        <TextInput style = {styles.nameInput} placeholder = "Enter the item name" onChangeText = {(text) => this.setState({name: text})}
        placeholderTextColor = "#000000"/>
        <Text style = {styles.amount}>Amount</Text>
        <TextInput style = {styles.amountInput} placeholder = "Enter the amount" onChangeText = {(text) => this.setState({amount: text})}
        keyboardType='numeric'
        placeholderTextColor = "#000000"/>
        <View style = {styles.addButton}>
          <TouchableOpacity onPress = {this._onPressAddButton.bind(this)}>
            <Text style = {styles.addButtonText}>
              Add
            </Text>
          </TouchableOpacity>
        </View>
        <View style = {styles.retrieveButton}>
          <TouchableOpacity onPress = {() => {this._setModalVisible(true);}}>
            <Text style = {styles.retrieveButtonText}>
            Retrieve
            </Text>
          </TouchableOpacity>
        </View>

        <Modal animationType = "slide" transparent = {false} visible = {this.state.modalVisible}
          onRequestClose = {() => {
            alert('Modal has been closed.');
          }}>
          <View style = {styles.modalView}>
            <View style = {styles.modalCloseButton}>
              <TouchableOpacity onPress={() => {this._setModalVisible(false);}}>
                <Text style = {styles.modalCloseText}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  modalCloseButton: {
    top: 570,
    height: 40,
    width: 230,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  modalCloseText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 20,
  },
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
  },
  addButton: {
    top: 260,
    height: 40,
    width: 230,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  addButtonText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 20,
  },
  retrieveButton: {
    top: 300,
    height: 40,
    width: 230,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  retrieveButtonText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 20,
  }
});
