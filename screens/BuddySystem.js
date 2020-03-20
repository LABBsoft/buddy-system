import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView, LongPressGestureHandler } from 'react-native-gesture-handler';
import * as Progress from 'react-native-progress';
import TimePicker from "react-native-24h-timepicker";

const timeScale = 1000; //1000 = real time

export default class BuddySystem extends React.Component{
constructor(props){
    super(props);
    //this.tick = this.tick.bind(this);
    if(this.props.state){
      this.state = {secondsElapsed: 0}; //Time elapsed in seconds
      this.state = {sessionLengthSeconds : this.props.sessionLengthSeconds}; //Length of work session in seconds
      this.state = {sessionProgress : this.props.sessionProgress} //Ratio of session elapsed out of 1
      this.state = {timeRemaining : this.props.timeRemaining}    //Session time remaining for display
      this.state = {status : this.props.status}
    }
    else{
      this.state = {secondsElapsed: 0}; //Time elapsed in seconds
      this.state = {sessionLengthSeconds : 0}; //Length of work session in seconds
      this.state = {sessionProgress : 0} //Amount of session elapsed out of 1
      this.state = {timeRemaining : ""}    //Session time remaining for display
      this.state = {status : 'idle'}} //Active session boolean
    
}

clearSession(){
  this.setState({secondsElapsed : 0,
    sessionLengthSeconds: 0,
    sessionProgress : 0,
    timeRemaining : "",
    status : 'idle'
  });
  clearInterval(this.interval);
}

componentWillUnmount() {
  clearInterval(this.interval);
}

getTimeRemaining(){
  let secs = this.state.sessionLengthSeconds - this.state.secondsElapsed;
  let hrs = Math.floor(secs/3600);
  secs -= hrs*3600;
  let mins = Math.floor(secs/60);
  secs -= mins * 60;
  this.setState({timeRemaining : `${hrs}:${mins}:${secs}`});
}

onBreak(){
  clearInterval(this.interval);
  this.setState({status : 'break'});
}

onBreakEnd(){
  this.tick();
  this.setState({status : 'active'})
}

onCancel() {
  this.clearSession();
  this.TimePicker.close();
}

onTimeConfirm(hour, minute) {
  clearInterval(this.interval);
  this.setState({ secondsElapsed : 0,
   sessionLengthSeconds: ((hour * 3600) + (minute * 60)),
   sessionProgress : 0,
   timeRemaining: `${hour}:${minute}:00`,
    status:'active'
  });
  this.TimePicker.close();
  this.tick();
}

tick(){
  this.interval = setInterval(() => {
    if(this.state.sessionProgress < 1){
      this.setState(prevState => ({
        secondsElapsed: prevState.secondsElapsed + 1}));
      this.setState({sessionProgress : (this.state.secondsElapsed/this.state.sessionLengthSeconds)});
      this.getTimeRemaining();
    }
    else{
      alert("done session");
      this.clearSession();
    }
  }, timeScale); 
}


  render(){
    const status = this.state.status;
    let button, bar, text, breakButton;
    if(status == 'active'){
      button = <Button title="press to cancel work session"
      onPress={ ()=> this.clearSession()}
      style={styles.cancelButton}/>
      bar = <Progress.Bar progress = {this.state.sessionProgress} />
      text = <Text>Time remaining : {this.state.timeRemaining}</Text>
      breakButton = <Button title="Take a break"
      onPress={()=> this.onBreak()}/>
    }
    else if (status == 'idle'){
      button = <Button title="press to start work session"
      onPress={ ()=> this.TimePicker.open()}
      style={styles.startButton}/>
      bar = <Progress.Bar indeterminate={true} />
      text = <Text>Welcome!</Text>
    }
    else if (status == 'break'){
      button = <Button title='press to end break'
      onPress={ ()=>this.onBreakEnd()}/>
      text = <Text>You are on a break.</Text>
    }

    return (
        <View style={styles.container}>
          <div style = {styles.character}>
            <div style = {styles.meter}>
              <Progress.Circle indeterminate = {true} showsText={true}/>
              <Text>Water level</Text>
            </div>
              <Image source={require ('../assets/images/robot-dev.png')} />
              <div style = {styles.meter}>
              <Progress.Circle indeterminate = {true} showsText={true}/>
              <Text>Stretch counter</Text>
            </div>
          </div>
        {button}
        {bar}       
        {text}
        {breakButton}
         <TimePicker
          ref={ref => {
            this.TimePicker = ref;
          }}
          onCancel={() => this.onCancel()}
          onConfirm={(hour, minute) => this.onTimeConfirm(hour, minute)}
        />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  cancelButton: {
    color: '#ff0000'
  },
  container: {
    flex : 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems : 'center',
    backgroundColor: '#fafafa',
  },
  character: {
    flex : 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems : 'center',
    backgroundColor: '#fafafa',
  },
  meter : {
    flex : 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems : 'center',
    backgroundColor: '#fafafa',
  },
  startButton: {
    color: '#00ff00'
  }

});
