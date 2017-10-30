import React, { Component } from 'react';

import Home from './components/Home';
import ProviderScreen from './components/ProviderScreen';
import RequesterScreen from './components/RequesterScreen';

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
            <Scene key='providerscreen' component={ProviderScreen} title='Provider Screen' type="reset" hideNavBar/>
            <Scene key='requesterscreen' component={RequesterScreen} title='Requester Screen' type="reset" hideNavBar/>
            </Scene>
            </Router>
        );
    }
}
