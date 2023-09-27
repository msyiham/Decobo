import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react';
import theme from '../../../font';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Sound from 'react-native-sound';

const SplashScreen = ({ navigation }) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;


  return (
    <ImageBackground source={require('../../asset/PAGE_BG/SPLASH.png')} style={styles.container} resizeMode='cover'>
      <Image source={require('../../asset/LOGO.png')} style={{ width: windowWidth, height: windowHeight * 0.65 }} resizeMode='cover' />
      <Text style={styles.text}>
        Sebuah buku yang telah dirancang dengan cermat dan diatur sesuai dengan urutan pada pembelajaran phonics
      </Text>
      <TouchableOpacity
        onPress={() => {
          navigation.replace('Home');
        }}
        style={[styles.button, styles.shadowProp, { width: windowWidth * 0.15, height: windowWidth * 0.15, borderRadius: windowWidth * 0.15 }]}
      >
        <Text style={{ color: 'black' }}>
          <Icon size={25} name="chevron-right" />
        </Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#D6F8FF',
  },
  text: {
    fontFamily: theme.font2.bold,
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  shadowProp: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  button: {
    backgroundColor: '#9DE7F8',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
