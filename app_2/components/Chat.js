import React, {Component} from 'react';

import{
    AppRegistry,
    View,
    Text,
    TouchableOpacity,
    AsyncStorage,
    Alert,
} from 'react-native';

import {store} from './helpers/LocalStorage';
import {decrypt} from './helpers/Cryption';

export default class Chat extends Component{
    state={
        name:'',
        username:'',
        roomNo:'',
        userType:'',
    };

    constructor(props) {
       super(props);

       const receiveUserName= (value) => {

           if(value!=null){
               encryptedUserName = value;
               this.setState({
                 username: value
             });
               Alert.alert("Fetched Name=> ", decrypt(encryptedUserName) );
               AsyncStorage.getItem("RoomNo").then(receiveRoomNo);
           }
       }

       const receiveRoomNo= (value) => {

           if(value!=null){
               encryptedRoomNo = value;
               this.setState({
                 roomNo: value
             });
               Alert.alert("Fetched Room No=> ", decrypt(encryptedRoomNo) );

           }
       }
        var encryptedUserName = this.props.username;
        var encryptedRoomNo = this.props.roomNo;
        var encryptedUserType = this.props.userType;
        if(encryptedRoomNo=='') // If already stored info locally
        {
            AsyncStorage.getItem("UserName").then(receiveUserName);
        }
        else{
        store('infoSaved', 'true');
        store('UserName', encryptedUserName);
        store('RoomNo', encryptedRoomNo);
        store('UserType', encryptedUserType);
    }


    }

    render()
    {
        return(
        <View>
        <Text> {decrypt(this.props.username)}</Text>
        </View>
        );
    }
}

AppRegistry.registerComponent('Chat', ()=> Chat);
