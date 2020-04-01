import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import TimePicker from "react-native-24h-timepicker";
import Character from '../components/Character'
import Constants from '../constants/Layout'


const timeScale = 1000; //1000 = real time
const DEFAULT_STATE = {
  secondsElapsed: 0, //Time elapsed in seconds
  sessionLengthSeconds : 0, //Length of work session in seconds
  sessionProgress : 0,//Amount of session elapsed out of 1
  timeRemaining : "",   //Session time remaining for display
  status : 'idle', //Active session boolea
  waterLevel : 100,
  activityLevel : 100
}

export default class BuddySystem extends React.Component{
constructor(props){
    super(props);
    this.state=DEFAULT_STATE;
    this.interval = null;
}

componentDidMount = () =>{
  this.setState(DEFAULT_STATE);
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
    let button1, button2, text;
    let progressBar;
    let progressBarWidth;
    if(this.state.sessionProgress == 0){
      progressBarWidth = 0; 
    }
    else{
      progressBarWidth = Constants.XP * 80 * (this.state.sessionProgress); 
    }
   

    if (status == 'idle'){
      button1 = <Button title="press to start work session"
      onPress={ ()=> this.TimePicker.open()}
      style={styles.cancelButton}/>
      text = <Text>Welcome to StudyBuddy!</Text> 
    }
    else if(status == 'active'){      
        button1 = <Button title="press to cancel work session"
          onPress={ ()=> this.clearSession()}
          style={styles.cancelButton}/>;
        button2 = <Button title="Take a break"
          onPress={()=> this.onBreak()}/>
        text =<Text>Time remaining : {this.state.timeRemaining}</Text>
    }
    else if (status == 'break'){
      button1 = <Button title='press to end break'
        onPress={ ()=>this.onBreakEnd()}/>
      button2 = null
      text =<Text>You are on a break</Text>
    }

    return (
      <View style = {styles.container}>
        <View style = {styles.meterContainer}>
          <View style={styles.waterBar}>
                <View style={[styles.waterLevel, {width  : Constants.XP*25}]}/>
          </View>
          <View style={styles.activityBar}>
                <View style={[styles.activityLevel, {width  : Constants.XP*25}]}/>
          </View>
        </View>
        <View style = {styles.characterCell}>
          <Character ref = {(ref) => {character = ref}}/>
        </View>
        <View style= {styles.buttonContainer}>
          {text}
          {button1}
          {button2}
        </View>
        <View style = {styles.progressBarContainer}>
          <View style = {styles.progressBar}>
            <View style={[styles.progressLevel, { width: progressBarWidth}]} />
          </View>
        </View>
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
  activityBar: {
    width : Constants.XP*30,
    height : Constants.YP*5,
    marginRight: Constants.XP * 2,
    marginTop: Constants.XP * 2,
    backgroundColor : '#ffffff',
    borderRadius : Constants.YP*2
  },
  activityLevel: {
    position: 'absolute',
    backgroundColor: '#ff0000',
    left: Constants.XP * 0.5,
    top: Constants.YP * 0.5,
    bottom: Constants.YP * 3,
    borderRadius: Constants.YP * 2,
    height : Constants.YP *4
  },
  buttonContainer :{
    marginTop : Constants.YP*15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: Constants.YP*30,
    width : Constants.MAX_WIDTH - (Constants.XP*10),
    backgroundColor : '#ff0000'
  },
  cancelButton: {
    flex: 1,
    color: '#ff0000'
  },
  container: {
    flex : 1,
    flexDirection: 'column',
    alignItems : "center"
  },
  characterCell : {
    height : Constants.XP * 20,
    width : Constants.XP * 5,
    justifyContent: 'center',
    alignItems : 'center'
  },
  meterContainer : {
    flexDirection : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height : Constants.YP * 10,
    width : Constants.MAX_WIDTH - (Constants.XP*10),
    //backgroundColor : '#ff0000'
  },
  waterBar: {
    width : Constants.XP*30,
    height : Constants.YP*5,
    marginLeft: Constants.XP * 2,
    marginTop: Constants.XP * 2,
    backgroundColor : '#ffffff',
    borderRadius : Constants.YP*2
  },
  waterLevel: {
    position: 'absolute',
    backgroundColor: '#0000ff',
    left: Constants.XP * 0.5,
    top: Constants.YP * 0.5,
    bottom: Constants.YP * 3,
    borderRadius: Constants.YP * 2,
    height : Constants.YP *4
  },
  progressBar: {
    width : Constants.XP*80,
    height : Constants.YP*5,
    marginLeft: Constants.XP * 2,
    marginTop: Constants.XP * 2,
    backgroundColor : '#ffffff',
  },
  progressBarContainer: {
    flexDirection : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height : Constants.YP * 10,
    width : Constants.MAX_WIDTH - (Constants.XP*10),
  },
  progressLevel:{
    position: 'absolute',
    backgroundColor: '#00ff00',
    left: Constants.XP * 0.5,
    top: Constants.YP * 0.5,
    bottom: Constants.YP * 3,
    height : Constants.YP *4
  }, 
  startButton: {
    // /padding : 10,
    //color : '#DDD000',
    position: 'absolute',
    backgroundColor: '#0f00ff',
    left: Constants.XP * 0.5,
    top: Constants.YP * 8,
    bottom: Constants.YP * 3,
    borderRadius: Constants.YP * 2,
    width : Constants.XP*65,
    height : Constants.YP *8
  },
  welcomeLabel: {
    height: Constants.MAX_HEIGHT/10
  }
 

});
