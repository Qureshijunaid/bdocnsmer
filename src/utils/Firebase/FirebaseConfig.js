import firebase from '@react-native-firebase/app';
import { Platform } from 'react-native';

var firebaseConfig = {
  apiKey: 'AIzaSyAVoBkXJVALnMa94Sm8x7wc06fN3auxZ1I', //done
  authDomain: 'bando-consumer.firebaseapp.com', //done
  databaseURL: 'https://bando-consumer-default-rtdb.firebaseio.com', //done
  projectId: 'bando-consumer', //done
  storageBucket: 'bando-consumer.appspot.com',//done

  messagingSenderId: '870176039634',//done
  appId:
    Platform.OS === 'ios'
      ? '1:870176039634:ios:90e501f56a205fe83b830b' //done
      : '1:870176039634:android:a9e40e33204e67373b830b', //done
  // measurementId: 'G-EC9ERFT49L',
};


const config = firebaseConfig;
export const initializeFirebase = () => {

  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
};
