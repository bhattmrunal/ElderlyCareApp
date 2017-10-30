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

         if(this.state.userType=='Provider')
         {
             console.log('User Type: '+ decrypt(value));
             AsyncStorage.getItem("room").then(receiveIfRoomProviding);
             AsyncStorage.getItem("dining").then(receiveIfDiningProviding);
             AsyncStorage.getItem("assistance").then(receiveIfAssistanceProviding);
             AsyncStorage.getItem("emergency").then(receiveIfEmergencyProviding);

         }
         else
         {
             console.log('User Type: '+ decrypt(value));
             Actions.requesterscreen({

                     name:this.state.username,
                     username:this.state.username,
                     roomNo:this.state.roomNo,
                     userType:this.state.userType,
                 });

         }
        }
    }

    const receiveisInfoSaved = (value) => {
        global.gotData=1;
        if(value!=null){
            if(value=='true') // If user info is stored
            {
                console.log('User Inifo Saved: '+value);
                AsyncStorage.getItem("UserName").then(receiveuserName);
                AsyncStorage.getItem("RoomNo").then(receiveRoomNo);
                AsyncStorage.getItem("userType").then(receiveuserType);
            }
        }
    }
    const receiveuserName = (value) => {
        global.gotData=1;
        if(value!=null){
        this.setState({username: decrypt(value)});
        //AsyncStorage.getItem("userType").then(receiveuserType);
        console.log('UserName: '+this.state.username);
        }
    }
    const receiveRoomNo = (value) => {
        global.gotData=1;
        if(value!=null){
            this.setState({roomNo: decrypt(value)});

        console.log('Room No: '+this.state.roomNo);
        }
    }

    const receiveIfRoomProviding = (value) => {
        global.gotData=1;
        if(value!=null){
            if(decrypt(value)=='true')
                this.setState({room: true});
            else
                this.setState({room: false})

        console.log('Room service: '+this.state.room);
        }
    }

    const receiveIfDiningProviding = (value) => {
        global.gotData=1;
        if(value!=null){
            if(decrypt(value)=='true')
                this.setState({dining: true});
            else
                this.setState({dining: false})

        console.log('Dining service: '+this.state.dining);
        }
    }
    const receiveIfAssistanceProviding = (value) => {
        global.gotData=1;
        if(value!=null){
            if(decrypt(value)=='true')
                this.setState({assistance: true});
            else
                this.setState({assistance: false})

        console.log('Assistance service: '+this.state.assistance);
        }
    }
    const receiveIfEmergencyProviding = (value) => {
        global.gotData=1;
        if(value!=null){
            if(decrypt(value)=='true')
                this.setState({emergency: true});
            else
                this.setState({emergency: false})

        console.log('Emergency service: '+this.state.emergency);
        Actions.providerscreen({

           name:this.state.username,
           username:this.state.username,
           roomNo:this.state.roomNo,
           userType:this.state.userType,
           room:this.state.room,
           dining:this.state.dining,
           assistance:this.state.assistance,
           emergency:this.state.emergency,

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
                    console.log('toggle Room-> '+currentState);
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
                    console.log('room service storing= '+roomService + ' dining = '+diningService);
                    if(roomService)
                        store('room', encrypt('true'));
                    else
                        store('room', encrypt('false'));

                    if(diningService)
                        store('dining', encrypt('true'));
                    else
                        store('dining', encrypt('false'));

                    if(assistanceService)
                        store('assistance', encrypt('true'));
                    else
                        store('assistance', encrypt('false'));

                    if(emergencyService)
                        store('emergency', encrypt('true'));
                    else
                        store('emergency', encrypt('false'));


                    Actions.providerscreen({
                    name:decrypt(encryptedName),
                    username:decrypt(encryptedName),
                    roomNo:decrypt(encryptedRoomNo),
                    userType:decrypt(encryptedUserType),
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
                    name:decrypt(encryptedName),
                    username:decrypt(encryptedName),
                    roomNo:decrypt(encryptedRoomNo),
                    userType:decrypt(encryptedUserType),
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
