import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import constants from '../constants';

//SplashScreen
import SplashScreen from '../screens/Splash';



const SplStack = createStackNavigator();
const SplashStack = () => {
    return (
        <SplStack.Navigator
            headerMode={"none"}

        >
            <SplStack.Screen
                component={SplashScreen}
                name={constants.ScreensName.SplashScreen.name}
                options={{ gestureEnabled: false }}
            />

        </SplStack.Navigator>
    )
}

export default SplashStack;