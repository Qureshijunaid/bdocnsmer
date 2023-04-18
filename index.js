/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import TrackPlayer from "react-native-track-player";

messaging().setBackgroundMessageHandler(async remoteMessage => {
});

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => require('./trackPlayer'));
