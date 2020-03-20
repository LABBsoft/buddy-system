import * as React from 'react';
import { Text, View } from 'react-native';

export default class BreakScreen extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
        <View style={styles.container}>
            <Text>Welcome! You are on a break. Your session will be saved</Text>
        </View>
        )
    }
}