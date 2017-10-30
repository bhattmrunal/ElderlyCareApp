/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

//import Home from './app/components/Home';
//import Chat from './app/components/Chat';
import Launcher from './app/Launcher';
AppRegistry.registerComponent('ConnectedCareApp', () => Launcher);
