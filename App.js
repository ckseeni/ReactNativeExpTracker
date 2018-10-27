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

  _getDateAndTime(){
    var date = new Date();
    var dtString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return dtString;
  }

  _onPressAddButton() {
    var dtString = this._getDateAndTime();
    var expDataJson = {
      "name" : this.state.name,
      "amount" : this.state.amount,
      "dateAndTime": dtString
    };
    this._storeExpItem(expDataJson).then(() => {
      alert(expDataJson.name+" "+expDataJson.amount+"\nis stored on "+expDataJson.dateAndTime);
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
        placeholderTextColor = "rgba(255, 255, 255, 0.8)"/>
        <Text style = {styles.amount}>Amount</Text>
        <TextInput style = {styles.amountInput} placeholder = "Enter the amount" onChangeText = {(text) => this.setState({amount: text})}
        keyboardType='numeric'
        placeholderTextColor = "rgba(255, 255, 255, 0.8)"/>
        <View style = {styles.addButton}>
          <TouchableOpacity onPress = {this._onPressAddButton.bind(this)}>
            <Text style = {styles.addButtonText}>
              +
            </Text>
          </TouchableOpacity>
        </View>
        <View style = {styles.retrieveButton}>
          <TouchableOpacity onPress = {this._onPressRetrieveButton.bind(this)}>
            <Text style = {styles.retrieveButtonText}>
             >
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
      expData : [],
      total: 0
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
          {this.state.expData.map((item, key) =>
            <Text key={key}
              onPress = {() => alert(item.name+" : "+item.amount+"\nadded on "+item.dateAndTime)}
              style = {styles.expList}>
              {item.name+" : "+item.amount+"\n"}
            </Text>
          )}
          {this.state.expData.map((item, key) => {this.state.total = this.state.total + Number(item.amount)})}
          <Text style = {styles.expList}>
            Total Expense : {this.state.total}
          </Text>
        </ScrollView>
        <View style = {styles.retrieveScreenClearButton}>
          <TouchableOpacity onPress={this._onPressClearButton.bind(this)}>
            <Text style = {styles.retrieveScreenClearText}>
              X
            </Text>
          </TouchableOpacity>
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
    backgroundColor: '#455A64',
  },
  retrieveScreenClearButton: {
    height: 50,
    width: 50,
    alignSelf: 'center',
    backgroundColor: '#1C313A',
    justifyContent: 'center',
    borderRadius: 25,
  },
  retrieveScreenClearText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 25,
  },
  mainView: {
    flex: 1,
    backgroundColor: '#455A64',
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
    textAlign: 'center',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
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
    textAlign: 'center',
    alignSelf: 'center',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
  },
  addButton: {
    top: 260,
    height: 50,
    width: 50,
    alignSelf: 'center',
    backgroundColor: '#1C313A',
    justifyContent: 'center',
    borderRadius: 25,
  },
  addButtonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 35,
  },
  retrieveButton: {
    top: 300,
    height: 50,
    width: 50,
    alignSelf: 'center',
    backgroundColor: '#1C313A',
    justifyContent: 'center',
    borderRadius: 25,
  },
  retrieveButtonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 35,
  }
});
