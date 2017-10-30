import React, { Component } from 'react';

import Home from './components/Home';
import Chat from './components/Chat';

import{
    Router,
    Scene
} from 'react-native-router-flux';

import{
    Platform
} from 'react-native';

export default class Launcher extends Component{
    render()
    {
        return(
            <Router>
            <Scene key='root' style={{paddingTop: Platform.OS==='ios' ? 64: 54 }}>
            <Scene key='home' component={Home} title='User Setup'/>
            <Scene key='chat' component={Chat} title='Chat'/>
            </Scene>
            </Router>
        );
    }
}
