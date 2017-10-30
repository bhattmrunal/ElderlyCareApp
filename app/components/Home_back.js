import React, {Component} from 'react';
/// Load React-Navite Components
import{
    AppRegistry,
    View,
    Text,
    TextInput,
    Alert,
    Platform,
    TouchableOpacity,
    StyleSheet,
    AsyncStorage,
} from 'react-native';

//import {RadioGroup, RadioButton} from 'radio-button-react-native'
import RadioButton from 'radio-button-react-native';

// Get access to helper-cryptographic functions
import {encrypt, decrypt} from './helpers/Cryption';

// Get access to helper-local storage functions
import {store} from './helpers/LocalStorage';
import {fetch} from './helpers/LocalStorage';
import MultiSelectView from './helpers/ToggleSwitchView';
// Get access to Actions to go to next screen(Scene)
import{Actions}from 'react-native-router-flux';

global.gotData = '';
global.UserName='';

export default class Home extends Component{
    state={
        name:'',
        userName:'',
        roomNo:'',
        isInfoSaved:'',
        userType:'',
        showProviderServices:false,
        dining: false,
        room: false,
        assistance: false,
        emergency:false,

    };

 constructor(props) {
    super(props);

    // a function that receives value
    //AsyncStorage.clear();

    const receiveuserType = (value) => {
        global.gotData=1;
        if(value!=null){
        this.setState({userType: decrypt(value)});

        AsyncStorage.getItem("UserName").then(receiveuserName);
        //Alert.alert('UserType=> ', value);
        //console.log('User Type: '+ decrypt(value));
         if(this.state.userType=='Provider')
         {
             console.log('User Type: '+ decrypt(value));
        //     Actions.providerscreen({
        //
        //         name:'',
        //         username:'',
        //         roomNo:'',
        //         userType:'',
        //
        //     });
        // }
        // else {
        //     Actions.requesterscreen({
        //
        //         name:'',
        //         username:'',
        //         roomNo:'',
        //         userType:'',
        //
        //     });
         }
         else
         {
             console.log('User Type: '+ decrypt(value));
            AsyncStorage.getItem("RoomNo").then(receiveRoomNo);
         }
        }
    }

    const receiveisInfoSaved = (value) => {
        global.gotData=1;
        if(value!=null){

        AsyncStorage.getItem("userType").then(receiveuserType);
        //Alert.alert('infoSaved=> ', value);

        console.log('User Inifo Saved: '+value);
        }
    }
    const receiveuserName = (value) => {
        global.gotData=1;
        if(value!=null){
        this.setState({username: decrypt(value)});
        //AsyncStorage.getItem("userType").then(receiveuserType);
        //Alert.alert('userName=> ', value);
        console.log('UserName: '+this.state.username);
        }
    }
    const receiveRoomNo = (value) => {
        global.gotData=1;
        if(value!=null){
            this.setState({roomNo: decrypt(value)});
            Actions.requesterscreen({

                    name:'',
                    username:'',
                    roomNo:'',
                    userType:'',
                });

        console.log('Room No: '+this.state.roomNo);
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
        this.setState({showProviderServices: true});
    }
    else{
        this.setState({showProviderServices: false});
    }
    }

    updateChoice(type) {
        var currentState;
        switch (type) {
            case "dining":
                currentState = !this.state.dining;
                this.setState({dining: currentState});
                break;
                case "room":
                    currentState = !this.state.room;
                    this.setState({room: currentState});
                    break;
                case "assistance":
                    currentState = !this.state.assistance;
                    this.setState({assistance: currentState});
                    break;
                case "emergency":
                currentState = !this.state.emergency;
                this.setState({emergency: currentState});
                break;
            default:

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
            <Text >Requester</Text>
        </RadioButton>
        </View>
        <View style={styles.optionButton}>
        <RadioButton currentValue={this.state.userType} value={'Provider'} onPress={this.handleOnPress.bind(this)} >
            <Text >Provider</Text>
        </RadioButton>
        </View>
        </View>

        <View>
        {
          this.state.showProviderServices ? <Text style={styles.servicceProviderTitle}> Please Select the service you wish to provide</Text> : null
        }
      </View>
      <View>
      {
        this.state.showProviderServices ? <MultiSelectView  text='Room Service' onPress={() => { this.updateChoice('room') }} selected={this.state.room} /> : null
      }
      </View>
      <View>
      {
        this.state.showProviderServices ? <MultiSelectView  text='Dining Service' onPress={() => { this.updateChoice('dining') }} selected={this.state.dining} /> : null
      }
      </View>
      <View>
      {
        this.state.showProviderServices ? <MultiSelectView  text='Assistance Service' onPress={() => { this.updateChoice('assistance') }} selected={this.state.assistance} /> : null
      }
      </View>
      <View>
      {
        this.state.showProviderServices ? <MultiSelectView  text='Emergency Service' onPress={() => { this.updateChoice('emergency') }} selected={this.state.emergency} /> : null
      }
      </View>
        <TouchableOpacity style={styles.buttonTouchOpacity}
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
            else if(userType=='Provider' && this.state.room==false && this.state.dining == false
                && this.state.assistance == false && this.state.emergency == false)
            {

                    Alert.alert(
                        'Please select at least one service.'
                    );
            }
            else{
                try {
                    var encryptedName=encrypt(name);
                    var encryptedRoomNo=encrypt(roomNo);
                    var encryptedUserType=encrypt(userType);
                    var roomService = this.state.room;
                    var diningService = this.state.dining;
                    var assistanceService = this.state.assistance;
                    var emergencyService = this.state.emergency;

                    store('UserName', encryptedName);
                    store('RoomNo', encryptedRoomNo);
                    store('userType', encryptedUserType);
                    store('infoSaved', 'true');


                } catch (error) {
                    Alert.alert('Error saving data. Please contact software department, if the problem persists');
                }

                if(userType=='Provider')
                {
                    console.log('User type= Provider');
                    if(roomService)
                        store('room', 'true');
                    else
                        store('room', 'false');

                    if(diningService)
                        store('dining', 'true');
                    else
                        store('dining', 'false');

                    if(assistanceService)
                        store('assistance', 'true');
                    else
                        store('assistance', 'false');

                    if(emergencyService)
                        store('emergency', 'true');
                    else
                        store('emergency', 'false');


                    Actions.providerscreen({
                    name:encryptedName,
                    username:encryptedName,
                    roomNo:encryptedRoomNo,
                    userType:encryptedUserType,
                    room:roomService,
                    dining:diningService,
                    assistance:assistanceService,
                    emergency:emergencyService,
                    });
                }
                else if(userType=='Requester')
                {
                    console.log('User type= Requester');
                    Actions.requesterscreen({
                    name:encryptedName,
                    username:encryptedName,
                    roomNo:encryptedRoomNo,
                    userType:encryptedUserType,
                });
                }
        }
        }}>
        <Text style={styles.buttonText}>Save</Text>

        </TouchableOpacity>
        </View>
        );
    } // End render() function
}

var styles = StyleSheet.create({
buttonTouchOpacity:{
    marginTop: 40,
},
title:{
    marginTop: 20,
    marginLeft: 20,
    fontSize: 20,
},
servicceProviderTitle:{
    marginTop: 20,
    marginLeft: 20,
    fontSize: 15,
},
optionButton:{
    marginBottom: 20,
    marginLeft: 20,
},
nameInput:{
    padding:5,
    height: 40,
    fontSize: Platform.OS==='ios' ? 20: 30,
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
