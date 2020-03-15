import * as React from 'react';
import { Image, StyleSheet, Text, View, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView, LongPressGestureHandler } from 'react-native-gesture-handler';
import * as Progress from 'react-native-progress';

export default class LinksScreen extends React.Component{
constructor(props){
    super(props);
    this.state = {sessionTime: 0};
    this.tick = this.tick.bind(this);
}

updateBar(){
  if(this.state.sessionTime < 1){
    this.setState(prevState => ({
      sessionTime: prevState.sessionTime + 0.1
    }));
  }
  else{
    alert("done!");
    this.setState({sessionTime : 0})
    clearInterval(this.interval);
  }
}

tick() {
    this.interval = setInterval(() => {
      this.updateBar()
    }, 100);  
}

componentWillUnmount() {
  clearInterval(this.interval);
}

  render(){
    return (
        <View style={styles.container}>
        <Image source={require ('../assets/images/robot-dev.png')} />
        <Button title="press to start work session"
          onPress={ this.tick }
        />
        <Progress.Bar progress = {this.state.sessionTime} width = {200}/>
      </View>
    )
  }
}


function OptionButton({ icon, label, onPress, isLastOption }) {
  return (
    <RectButton style={[styles.option, isLastOption && styles.lastOption]} onPress={onPress}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems : 'center',
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
});
