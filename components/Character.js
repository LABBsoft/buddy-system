import React, {Component} from 'react';
import { StyleSheet, TouchableWithoutFeedback, Text, View} from 'react-native';
import Images from '../assets/images/Images'
import SpriteSheet from 'rn-sprite-sheet'
import { TapGestureHandler } from 'react-native-gesture-handler';

export default class Character extends Component {
    constructor(props){
        super(props);
        this.Character = null;
        this.isWalking = false;
        this.isStaring = false;
    }
    componentDidMount = () => {
        this.stare()
    }

    handleTap = () => {
        if(this.isStaring){
            this.walk()
        }
        else if(this.isWalking){
            this.stare()
        }
    }

    stare = () => {
        this.isWalking = false;
        this.isStaring = true;
        this.Character.play({
            type : 'idle',
            fps : 24,
            loop: true
        })
                
    }
    
    walk = () => {
        this.isWalking = true;
        this.isStaring = false;
        this.Character.play({
            type: 'right',
            fps: 24,
            loop: true,
        })
    }

    render(){
        return(
            <View style={styles.container}>
                <SpriteSheet
                    ref={ref=>(this.Character = ref)}
                    source = {Images.knight}
                    columns = {12}
                    rows = {4}
                    height = {150}
                    animations = {{
                        idle : [7],
                        front: [6, 7, 8],
                        left: [18, 19, 20],
                        right: [31,30, 32],
                        back: [42, 43, 44],
                    }}
                />
                <TouchableWithoutFeedback onPress={this.handleTap} style={{position:'absolute', top: 0, bottom :0, left: 0, right: 0}}>
                    <View style={{position:'absolute', top: 0, bottom :0, left: 0, right: 0}}/>
                </TouchableWithoutFeedback>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex:1
    },
});