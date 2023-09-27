import React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from "react-native-vector-icons/FontAwesome6";
const Stack = createNativeStackNavigator();

import * as screen from "../screen";

const Navigation = () => {
  return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="SplashScreen" component={screen.SplashScreen} />
        <Stack.Screen name="Home" component={screen.Home} />
        <Stack.Screen name="Info" component={screen.Info} />
        <Stack.Screen name="ListLevel" component={screen.ListLevel} />
        <Stack.Screen name="Introduction" component={screen.Introduction} />
        <Stack.Screen name="Guide" component={screen.Guide} />
        <Stack.Screen name="LevelPage" component={screen.LevelPage} />
        <Stack.Screen name="BookPage" component={screen.BookPage} />
        <Stack.Screen name="DownloadPage" component={screen.DownloadPage} />
      </Stack.Navigator>
  );
};

export default Navigation;