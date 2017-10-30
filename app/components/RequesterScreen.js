import React, {Component} from 'react';
import {Platform} from 'react-native';
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

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDPMyxtHszhnaKixhwVeaLauto30fWjcfk",
    authDomain: "connectedforcareapp.firebaseapp.com",
    databaseURL: "https://connectedforcareapp.firebaseio.com",
    projectId: "connectedforcareapp",
    storageBucket: "connectedforcareapp.appspot.com",
    messagingSenderId: "1090111060268"
  };
  const firebaseApp = firebase.initializeApp(config);
export default class RequesterScreen extends Component{
    state={
        name:'',
        username:'',
        roomNo:'',
        userType:'',
        token:'',
        myToken: '',
      tokenCopyFeedback: '',
      lastRequestTime:'',
    };


    constructor(props) {
       super(props);

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

       this.setState({lastRequestTime: (hours + ":" + minutes + ":" + seconds + "." + milliseconds).toString()}) ;
   }

   handleNotification(notification)
   {
       var obj = JSON.parse(notification);

       if(obj.userType=='Requester' && obj.userName==this.props.username)
       {
            Alert.alert('Your request has been sent.');
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
              console.log(notif.fcm.body),
              this.handleNotification(notif.fcm.body)
           // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
         });
         this.refreshUnsubscribe = FCM.on('FCMTokenRefreshed', (token) => {
           console.log(token)
           // fcm token may not be available on first load, catch it here
         });

         FCM.subscribeToTopic('/topics/room');
         FCM.subscribeToTopic('/topics/dining');
         FCM.subscribeToTopic('/topics/assistance');
         FCM.subscribeToTopic('/topics/emergency');
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
  }
  componentWillUnmount() {
         // prevent leak

         this.refreshUnsubscribe();
         this.notificationUnsubscribe();
       }

  sendMessage(message, topic)
  {
      console.log('user name from home: '+this.props.username);
      var obj = new Object();
   obj.userName = this.props.username;
   obj.userType  = this.props.userType;
   obj.roomNo = this.props.roomNo;
   obj.serviceType = topic;
   obj.time = (new Date).getTime();
   var jsonString= JSON.stringify(obj);
   console.log('request body: '+ jsonString);
     firebaseClient.sendNotificationWithData('ConnectedCareApp',jsonString,topic);//'this.state.myToken');
  }

   render()
   {
       return(
           <View>
           <TouchableOpacity style={styles.buttonTouchOpacity}
           //var requestBody = "{ UserName: \"PhoneRequester\", UserType: \"Requester\", RequestType: \"room\",  RoomNo: \"Rooom_NO\",  RequestTime: \"123453453\" }"

           onPress={()=>{this.sendMessage("From room",'/topics/room')}}>
           <Text style={styles.buttonText}> Request Room Service </Text>
           </TouchableOpacity>

           <TouchableOpacity style={styles.buttonTouchOpacity}
           onPress={()=>{this.sendMessage("From dining",'/topics/dining')}}>
           <Text style={styles.buttonText}> Request Dining Service </Text>
           </TouchableOpacity>

           <TouchableOpacity style={styles.buttonTouchOpacity}
           onPress={()=>{this.sendMessage("From Assistance", '/topics/assistance')}}>
           <Text style={styles.buttonText}> Request Assistance Service </Text>
           </TouchableOpacity>

           <TouchableOpacity style={styles.buttonTouchOpacity}
           onPress={()=>{this.sendMessage("From Emergency", '/topics/emergency')}}>
           <Text style={styles.emergencyButtonText}> Request Emergency Service </Text>
           </TouchableOpacity>

           </View>
       );
   }
}

var styles=StyleSheet.create({
    buttonTouchOpacity:{
        marginTop: 60,
    },
    buttonText:{
        marginLeft:20,
        marginRight:20,
        padding:10,
        fontSize:20,
        textAlign:'center',
        backgroundColor:'lightgray',
    },
    emergencyButtonText:{
        marginLeft:20,
        marginRight:20,
        padding:10,
        fontSize:20,
        textAlign:'center',
        backgroundColor:'red',
    }
});

AppRegistry.registerComponent('RequesterScreen', ()=> RequesterScreen);
