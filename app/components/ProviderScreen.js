import React, {Component} from 'react';
import PushController from "./helpers/PushController";
import firebaseClient from  "./helpers/FirebaseClient";
import FCM from "react-native-fcm";
import * as firebase from 'firebase';

import{
    AppRegistry,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    AsyncStorage,
    Alert,
} from 'react-native';

import {store} from './helpers/LocalStorage';
import {decrypt} from './helpers/Cryption';

var config = {
    apiKey: "AIzaSyDPMyxtHszhnaKixhwVeaLauto30fWjcfk",
    authDomain: "connectedforcareapp.firebaseapp.com",
    databaseURL: "https://connectedforcareapp.firebaseio.com",
    projectId: "connectedforcareapp",
    storageBucket: "connectedforcareapp.appspot.com",
    messagingSenderId: "1090111060268"
  };
  //const firebaseApp2 = firebase.initializeApp(config);

export default class ProviderScreen extends Component{
    state={
        name:'',
        username:'',
        roomNo:'',
        userType:'',
        isProvidingRoom: false,
        isProvidingDining: false,
        isProvidingAssistance: false,
        isProvidingEmergency: false,
        currentRequestStateMessage:'No pending requests',
        latestRequest:'',
        currentRequestTime:'',
        noOfPendingRequest:0,
        requestQueue:[{}],
    };

    constructor(props) {
       super(props);

        var UserName = this.props.username;
        var RoomNo = this.props.roomNo;
        var UserType = this.props.userType;

    }

    removeCurrentRequest()
    {
        //TODO: Have to update with first request in queue. But For now just deleting it
        this.setState({currentRequestStateMessage: 'No Pending request for now'});
        this.setState({noOfPendingRequest: this.state.noOfPendingRequest-1});
        this.setState({currentRequestTime:''});
    }
    render()
    {
        return(
        <View>
        <Text style={styles.titleText}> Provider: {this.props.username}</Text>
        <View style={styles.requestView}>
        <Text style={styles.currentRequestViewTitle}> Current Request</Text>
        <Text style={styles.requestViewText}> {this.state.currentRequestStateMessage}</Text>
            <TouchableOpacity style={styles.buttonTouchOpacity}><Text style={styles.buttonText} onPress={()=>{this.removeCurrentRequest()}}> Service Provided </Text></TouchableOpacity>
        </View>
        </View>
        );
    }
    msToTime(duration)
    {
        var milliseconds = parseInt((duration%1000)/100)
                , seconds = parseInt((duration/1000)%60)
                , minutes = parseInt((duration/(1000*60))%60)
                , hours = parseInt((duration/(1000*60*60))%24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        this.setState({currentRequestTime: (hours + ":" + minutes + ":" + seconds + "." + milliseconds).toString()}) ;
    }
    getDataFromJSON(jsonString)
    {
        var jobj = JSON.parse(jsonString);
        this.msToTime(jobj.time);
        var requestString = 'User => '+jobj.userName+' \n Room No => '+jobj.roomNo+' \n Request Time=> '+ this.state.currentRequestTime+' GMT';
        this.setState({currentRequestStateMessage: requestString});
        //this.state.requestQueue.push(jsonString);
        //console.log(this.state.requestQueue);
    }
    storeRequest(latestRequest)
    {
        console.log("Storing latest request: "+latestRequest);
        store('latestRequest', latestRequest);
    }
    handleNewRequest(newRequest)
    {
        this.setState({latestRequest:newRequest});
        this.getDataFromJSON(newRequest);
        this.storeRequest(this.state.latestRequest);
        this.setState({noOfPendingRequest:(this.state.noOfPendingRequest+1)});
        this.state.requestQueue.push(newRequest);
        console.log(this.state.requestQueue[0]);
        var jobj = JSON.parse(newRequest);
        if(jobj.userType=='Requester'  )
        {
            Alert.alert('You have a new request');
        }
    }
    componentDidMount(){

        // Android: check permission in user settings

        FCM.requestPermissions().then(()=>console.log('granted')).catch(()=>console.log('notification permission rejected'));
        FCM.getFCMToken().then(token => {
        console.log("TOKEN (getFCMToken)", token);
        this.setState({myToken: token});
       });
       this.notificationUnsubscribe = FCM.on('FCMNotificationReceived', (notif) => {
               console.log(JSON.parse(notif.fcm.body)),
               this.handleNewRequest(notif.fcm.body)

               //Alert.alert('Notification: '+notif.fcm.body)

            // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
          });
          this.refreshUnsubscribe = FCM.on('FCMTokenRefreshed', (token) => {
            console.log(token)
            // fcm token may not be available on first load, catch it here
          });

          //FCM.unsubscribeFromTopic('/topics/room');
     FCM.getInitialNotification().then(notif => {
       this.setState({
         initNotif: notif
       })
     });
     this.notificationUnsubscribe = FCM.on('FCMNotificationReceived', (notif) => {
            console.log('GOT Notification: Title:'+notif.fcm.title+' \n Body: '+notif.fcm.body)
         // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
       });
     //this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
               // optional, do some component related stuff
     //      });
     const receiveCurrentRequestStateMessage = (value) => {
         console.log(' Inside fetching latestRequest' );
         if(value!=null){
             this.getDataFromJSON(value);
             //this.setState({currentRequestStateMessage: value});

         console.log('Current Request message: '+this.state.currentRequestStateMessage);
         }
         else {
             console.log(' Inside else latestRequest' );
             this.setState({currentRequestStateMessage: 'No pending request'});
         }
     }
     AsyncStorage.getItem("latestRequest").then(receiveCurrentRequestStateMessage);

     if(this.props.room)
     {
        console.log("subscribed To Topic Room");
        FCM.subscribeToTopic('/topics/room');
     }
     else
     {
        console.log("UNsubscribed To Topic Room");
        FCM.unsubscribeFromTopic('/topics/room');
     }
     if(this.props.dining)
     {
        console.log("subscribed To Topic Dining");
        FCM.subscribeToTopic('/topics/dining');
     }
     else
     {
        console.log("UNsubscribed To Topic Dining");
        FCM.unsubscribeFromTopic('/topics/dining');
     }
     if(this.props.assistance)
     {
        console.log("subscribed To Topic Assistance");
        FCM.subscribeToTopic('/topics/assistance');
     }
     else
     {
        console.log("UNsubscribed To Topic Assistance");
        FCM.unsubscribeFromTopic('/topics/assistance');
     }
     if(this.props.emergency)
     {
         console.log("subscribed To Topic Emergency");
         FCM.subscribeToTopic('/topics/emergency');
     }
     else
     {
        console.log("UNsubscribed To Topic Emergency");
        FCM.unsubscribeFromTopic('/topics/emergency');
     }

   }
   componentWillUnmount() {
          // prevent leak
          this.refreshUnsubscribe();
          this.notificationUnsubscribe();
        }

   sendMessage(message)
   {
      firebaseClient.sendNotificationWithData('/topics/room');//'this.state.myToken');
   }
}

var styles=StyleSheet.create({
    buttonTouchOpacity:{
        marginTop: 10,
    },
    requestView:{
        paddingTop:20,
        paddingBottom:20,
        backgroundColor:'orange'
    },
    titleText:{
        padding:10,
        fontSize:20,
        fontWeight: 'bold',
        textAlign:'center',
        backgroundColor:'lightblue',
    },
    currentRequestViewTitle:{
        fontSize:20,
        fontWeight: 'bold',
        textAlign:'center',
        backgroundColor:'red',
    },
    requestViewText:{
        marginLeft:20,
        marginRight:20,
        padding:10,
        fontSize:20,
    },
    buttonText:{
        marginLeft:20,
        marginRight:20,
        padding:10,
        fontSize:20,
        textAlign:'center',
        backgroundColor:'lightgray',
    },

});

AppRegistry.registerComponent('ProviderScreen', ()=> ProviderScreen);
