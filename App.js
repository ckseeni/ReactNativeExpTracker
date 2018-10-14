import React from 'react';
import {Modal, AsyncStorage, StyleSheet, Text, TextInput, View, Button, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {createStackNavigator} from 'react-navigation'; // Version can be specified in package.json

class AddScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name : '',
      amount : '',
      expData: []
    };
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
      alert(expDataJson.name+" "+expDataJson.amount+"\nis stored");
    }).catch((error) => {
        alert(error);
    });
  }

  _onPressRetrieveButton() {
    this._retrieveExpItem().then((expArray) => {
      this.state.expData = expArray;
    }).catch((error) => {
    }).then(() => {
      this.props.navigation.navigate('Retrieve', {expData : this.state.expData});
    });
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
          <TouchableOpacity onPress = {this._onPressRetrieveButton.bind(this)}>
            <Text style = {styles.retrieveButtonText}>
            Retrieve
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class RetreiveScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expData : []
    };
    var expense = props.navigation.state.params.expData;
    if(expense) {
      this.state.expData = expense;
    }
  }

  async removeAsyncvalue(key) {
    await AsyncStorage.removeItem(key);
  }

  _onPressClearButton() {
    Alert.alert(
      'Data will be deleted premanently!!',
      '\nAre you want to Proceed ?',
      [
        {text: 'YES', onPress: () => this._removingData()},
        {text: 'NO', onPress: () => {}},
      ],
    );
  }

  _removingData() {
    this.removeAsyncvalue("expenses").then(() => {
      this.state.expData = [];
      this.forceUpdate();
      alert("Data cleared");
    }).catch();
  }

  render() {
    return (
      <View style = {styles.retrieveScreenView}>
        <ScrollView>
          {this.state.expData.map((item, key) => <Text key={key} style = {styles.expList}>{item.name+" : "+item.amount}</Text>)}
        </ScrollView>
        <View style = {styles.retrieveScreenButtonView}>
          <View style = {{width: 60}}></View>
          <View style = {styles.retrieveScreenCloseButton}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Add')}>
              <Text style = {styles.retrieveScreenCloseText}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
          <View style = {{width: 90}}></View>
          <View style = {styles.retrieveScreenClearButton}>
            <TouchableOpacity onPress={this._onPressClearButton.bind(this)}>
              <Text style = {styles.retrieveScreenClearText}>
                Clear
              </Text>
            </TouchableOpacity>
          </View>
          <View style = {{width: 20}}></View>
        </View>
      </View>
    );
  }
}

const RootStack = createStackNavigator({
    Add: AddScreen,
    Retrieve: RetreiveScreen,
  },{
    initialRouteName: 'Add',
    navigationOptions: {
      header: null,
    }
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

const styles = StyleSheet.create({
  expList: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 20,
  },
  retrieveScreenView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  retrieveScreenButtonView: {
    flexDirection: 'row',
  },
  retrieveScreenCloseButton: {
    height: 40,
    width: 100,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  retrieveScreenCloseText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 20,
  },
  retrieveScreenClearButton: {
    height: 40,
    width: 100,
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  retrieveScreenClearText: {
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
