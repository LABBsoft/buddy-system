import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView, LongPressGestureHandler } from 'react-native-gesture-handler';
import * as Progress from 'react-native-progress';
import TimePicker from "react-native-24h-timepicker";

const timeScale = 100; //1000 = real time

export default class LinksScreen extends React.Component{
constructor(props){
    super(props);
    this.tick = this.tick.bind(this);
    this.state = {sessionTime: 0}; //Time elapsed in seconds
    this.state = {seconds : 0}; //Length of work session in seconds
    this.state = {progress : 0} //Amount of session elapsed out of 1
    this.state = {time : ""}    //Session time remaining for display
    this.state = {counting : 0} //Active session boolean
}

clearSession(){
  this.setState({sessionTime : 0,
    seconds: 0,
    progress : 0,
    time : "",
    counting : 0
  });
  clearInterval(this.interval);
}

tick(){
  this.interval = setInterval(() => {
    if(this.state.progress < 1){
      this.setState(prevState => ({
        sessionTime: prevState.sessionTime + 1}));
      this.setState({progress : (this.state.sessionTime/this.state.seconds),
      counting : 1})
      this.getTimeRemaining();
    }
    else{
      alert("done session");
      this.clearSession();
    }
  }, timeScale); 
}

getTimeRemaining(){
  let secs = this.state.seconds - this.state.sessionTime;
  let hrs = Math.floor(secs/3600);
  secs -= hrs*3600;
  let mins = Math.floor(secs/60);
  secs -= mins * 60;
  this.setState({time : `${hrs}:${mins}:${secs}`});
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
    const isActive = this.state.counting;
    let button, text;
    if(isActive){
      button = <Button title="press to cancel work session"
      onPress={ ()=> this.clearSession()}
      style={styles.cancelButton}/>
      text = <Text>Time remaining : {this.state.time}</Text>
    }
    else{
      button = <Button title="press to start work session"
      onPress={ ()=> this.TimePicker.open()}
      style={styles.startButton}/>
      text = <Text>Welcome!</Text>
    }

    return (
        <View style={styles.container}>
        <Image source={require ('../assets/images/robot-dev.png')} />
        {button}
        <TimePicker
          ref={ref => {
            this.TimePicker = ref;
          }}
          onCancel={() => this.onCancel()}
          onConfirm={(hour, minute) => this.onConfirm(hour, minute)}
        />
        <Progress.Bar progress = {this.state.progress} />
         {text}
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
  startButton: {
    color: '#00ff00'
  },
  cancelButton: {
    color: '#ff0000'
  }
});
