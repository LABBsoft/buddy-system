import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView, LongPressGestureHandler } from 'react-native-gesture-handler';
import * as Progress from 'react-native-progress';
import TimePicker from "react-native-24h-timepicker";

export default class LinksScreen extends React.Component{
constructor(props){
    super(props);
    this.tick = this.tick.bind(this);
    this.state = {sessionTime: 0}; //Time elapsed in seconds
    this.state = {seconds : 0}; //Length of work session in seconds
    this.state = {progress : 0} //Amount of session elapsed out of 1
    this.state = {time : ""}
}

clearSession(){
  this.setState({sessionTime : 0,
    seconds: 0,
    progress : 0,
    time : ""
  });
  clearInterval(this.interval);
}

tick(){
  this.interval = setInterval(() => {
    if(this.state.progress < 1){
      this.setState(prevState => ({
        sessionTime: prevState.sessionTime + 1}));
      this.setState({progress : (this.state.sessionTime/this.state.seconds)})
    }
    else{
      alert("done session");
      this.clearSession();
    }
  }, 10); //set to 1000 for real time scale  
}

componentWillUnmount() {
  clearInterval(this.interval);
}

onCancel() {
  this.clearSession();
  this.TimePicker.close();
}

onConfirm(hour, minute) {
  clearInterval(this.interval);
  this.setState({ sessionTime : 0,
   seconds: ((hour * 3600) + (minute * 60)),
   progress : 0,
   time: `${hour}:${minute}`
  });
  this.TimePicker.close();
  this.tick();
}

  render(){
    return (
        <View style={styles.container}>
        <Image source={require ('../assets/images/robot-dev.png')} />
        <Button title="press to start work session"
          onPress={ ()=> this.TimePicker.open() }
        />
        <TimePicker
          ref={ref => {
            this.TimePicker = ref;
          }}
          onCancel={() => this.onCancel()}
          onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
        />
        <Progress.Bar progress = {this.state.progress} />
        <Text>Session time : {this.state.time}</Text> 
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
