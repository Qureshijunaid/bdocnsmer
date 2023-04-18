import { combineReducers } from 'redux'
import authReducer from './authReducer';
import registrationReducer from './RegistrationRed';
import initialLoginReducer from './initialLoginRed';
import newPostReducer from './newPostRed';
import postReducer from './postReducer';
import merchReducer from './merchReducer';
import profileReducer from './profileReducer';
import homeReducer from './home';
import audioMinimizeReducer from './audioMinimize';
import chatReducer from './chatReducer';
import collectionReducer from './collectionReducer';

export default combineReducers({
  auth: authReducer,
  registration: registrationReducer,
  initialLogin: initialLoginReducer,
  newPost: newPostReducer,
  post: postReducer,
  merch: merchReducer,
  profile: profileReducer,
  home: homeReducer,
  audioMinimize: audioMinimizeReducer,
  chat: chatReducer,
  collection: collectionReducer
})