import React from 'react';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Navigation from './src/navigation';

const App = () => {
    return (
        <NavigationContainer>
            <Navigation/>
        </NavigationContainer>
    )
}

export default App;