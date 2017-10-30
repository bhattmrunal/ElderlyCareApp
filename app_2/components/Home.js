import React, {Component} from 'react';
/// Load React-Navite Components
import{
    AppRegistry,
    View,
    Text,
    TextInput,
    Alert,
    TouchableOpacity,
    StyleSheet,
    AsyncStorage,
} from 'react-native';

//import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button'
import RadioButton from 'radio-button-react-native';

// Get access to helper-cryptographic functions
import {encrypt, decrypt} from './helpers/Cryption';

// Get access to helper-local storage functions
import {store} from './helpers/LocalStorage';
import {fetch} from './helpers/LocalStorage';

// Get access to Actions to go to next screen(Scene)
import{Actions}from 'react-native-router-flux';

global.gotData = '';
global.UserName='';

export default class Home extends Component{
    state={
        name:'',
        roomNo:'',
        isInfoSaved:'',
        userType:'',
        showProviderServices:false,
    };

 constructor(props) {
    super(props);

    // a function that receives value
    //AsyncStorage.clear();
    const receiveisInfoSaved = (value) => {
        global.gotData=1;
        if(value!=null){

    //    AsyncStorage.getItem("UserName").then(receiveisInfoSaved);
        //Alert.alert('infoSaved=> ', value);
        Actions.chat({

            name:'',
            username:'',
            roomNo:'',
            userType:'noVal',
        });
        }
    }

    // pass the function that receives the login details;
    AsyncStorage.getItem("infoSaved").then(receiveisInfoSaved);

    //Alert.alert('gotData =>', global.gotData);
    } // End of constructor()
    handleOnPress(value){
    this.setState({userType:value})

    if(value=='Provider')
    {
        Alert.alert('Value ', value);
        this.setState({showProviderServices: true});
    }
    else{
        this.setState({showProviderServices: false});
    }
    }

    render()
    {
        return(
        <View>

        <TextInput style={styles.nameInput}
        placeholder='Enter Name Here'
        ref='nameTextInput'
        onChangeText={(text)=> {
            this.setState({
                name: text,
            });
        }}
        value={this.state.name}/>
        <TextInput style={styles.nameInput}
        placeholder='Enter Room Number'
        ref='roomNoTextInput'
        onChangeText={(text)=> {
            this.setState({
                roomNo: text,
            });
        }}
        value={this.state.roomNo}/>

        <View style={styles.nameTextInput}>
        <View style={styles.optionButton}>
        <RadioButton currentValue={this.state.userType} value={'Requester'} onPress={this.handleOnPress.bind(this)} >
            <Text>Requester</Text>
        </RadioButton>
        </View>
        <View style={styles.optionButton}>
        <RadioButton currentValue={this.state.userType} value={'Provider'} onPress={this.handleOnPress.bind(this)} >
            <Text>Provider</Text>
        </RadioButton>
        </View>
        </View>
      <View>
      {
          // Pass any View or Component inside the curly bracket.
          // Here the ? Question Mark represent the ternary operator.

        this.state.showProviderServices ? <Text style= {{ fontSize: 25, color: "#000", textAlign: 'center' }}> Hello Friends </Text> : null
      }
      </View>
        <TouchableOpacity
        onPress={()=>{

            var name = this.state.name;
            var roomNo = this.state.roomNo;
            var userType = this.state.userType;
            //alert(this.state.name);
            //navigate to second screen, and pass the name
            if(name==='')
            {
                Alert.alert(
                    'Name cannot be empty'
                );
                this.refs.nameTextInput.focus();
            }
            else if(roomNo==='')
            {
                Alert.alert(
                    'Please enter your location room number'
                );
                this.refs.roomNoTextInput.focus();
            }
            else if(userType==='')
            {
                Alert.alert(
                    'Please select your role'
                );
                this.refs.radioButtonRequester.focus();
            }
            else{
                try {
                    var encryptedName=encrypt(name);
                    var encryptedRoomNo=encrypt(roomNo);
                    var encryptedUserType=encrypt(userType);
                    store('UserName', encryptedName);
                    store('RoomNo', encryptedRoomNo);
                    store('userType', encryptedUserType);
                    store('infoSaved', 'true');
                } catch (error) {
                    Alert.alert('Error saving data. Please contact software department, if the problem persists');
                }

            Actions.chat({
                name:encryptedName,
                username:encryptedName,
                roomNo:encryptedRoomNo,
                userType:encryptedUserType,

            });}
        }}>
        <Text style={styles.buttonText}>Save</Text>

        </TouchableOpacity>
        </View>
        );
    } // End render() function
}

var styles = StyleSheet.create({
title:{
    marginTop: 20,
    marginLeft: 20,
    fontSize: 20,
},
optionButton:{
    marginBottom: 20,
    marginLeft: 20,
},
nameInput:{
    padding:5,
    height: 40,
    textAlign:'center',
    borderWidth: 2,
    borderColor: 'black',
    margin:20,
},
buttonText:{
    marginLeft:20,
    marginRight:20,
    padding:5,
    fontSize:20,
    textAlign:'center',
    backgroundColor:'lightgray',
}


});

AppRegistry.registerComponent('Home', ()=> Home);
