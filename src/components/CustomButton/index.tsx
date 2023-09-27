import { StyleSheet, Dimensions, View } from 'react-native'
import React from 'react'
import AwesomeButton from "react-native-really-awesome-button";
import LinearGradient from "react-native-linear-gradient";
const CustomButton = ({child, onPress, borderRadius}) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
  return (
    <AwesomeButton
        width={windowWidth*0.7}
        borderRadius={borderRadius}
        extra={
            <LinearGradient
            colors={["#9DE7F8", "#9DE7F8", "#9DE7F8", "#9DE7F8"]}
            style={{ ...StyleSheet.absoluteFillObject }}
            />
        }
      onPress={onPress}
    >
      <View>{child}</View>
    </AwesomeButton>
  )
}

export default CustomButton

const styles = StyleSheet.create({
    button:{
        backgroundColor: '#9DE7F8',
    },
})