import React, {Component} from 'react';

import{
    View,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    Switch,
    StyleSheet,
} from 'react-native';

export default class ToggleSwitchView extends Component{

    constructor(props)
    {
        super(props);
    }
    render()
    {
        return(
        <TouchableOpacity onPress={ this.props.onPress} style={[styles.unselected, this.props.selected && styles.selected ]}>
        <Switch onValueChange={this.props.onPress} value={this.props.selected} />
        <Text style={styles.title}> {this.props.text}</Text>
        </TouchableOpacity>
        );
    }
}
var styles = StyleSheet.create({
    unselected:{
        flexDirection: 'row',
        marginBottom:3,
        marginLeft: 20,
        marginRight: 20,
        borderWidth: 1,
        borderColor:'gray',
        backgroundColor: 'rgba(245,245,245,0.7)',
    },
    selected:{
        flexDirection: 'row',
        marginBottom:3,
        marginLeft: 20,
        marginRight: 20,
        borderWidth: 1,
        borderColor:'gray',
        backgroundColor: 'rgba(2,130,251,0.7)',
    },
    title:{
        marginLeft: 30,
        marginTop:5,
        fontSize:20,
        textAlign:'center',
    },
    optionButton:{
        marginBottom: 20,
        marginLeft: 20,
    },


});
