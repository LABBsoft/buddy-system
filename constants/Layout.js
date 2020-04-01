import { Dimensions } from 'react-native';

//const width = Dimensions.get('window').width;
//const height = Dimensions.get('window').height;

export default Constants = {
  MAX_WIDTH: Dimensions.get("screen").width,
  MAX_HEIGHT: Dimensions.get("screen").height,
  XP: Dimensions.get("screen").width / 100, //x percentage
  YP: Dimensions.get("screen").height / 100,
  //isSmallDevice: width < 375,
};
