import { Alert } from 'react-native'
import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-toast-message';
// Local Imports
import store from '../store';
import types from '../constants/Types'
import EndPoint from '../constants/EndPoint';
import constants from '../constants'
import * as NavigationService from '../navigation/NavigationService';

import { GET, POST, DELETE, PUT } from '../constants/ServiceAxios';
import {
    setUserAccessTokenToStorage,
    setUserVerification,
    setUserToStorage,
    getUserAccessTokenFromStorage,
    getUserVerification,
    getUserFromStorage,
    wipeStorage,
    getUserEmailFromStorage,
    setUserEmailToStorage,
    getUserFCMTokenFromStorage
} from '../utils/asyncstorage'
import config from '../utils/config';

export const setAudioPlayingState = (payload) => {
    const audioData = store.getState().audioMinimize
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.AUDIO_PLAYING_MINIMIZED,
                    isPlaying: payload.isPlaying,
                    audioName: payload.audioName,
                    audioTrack: payload.audioTrack,
                    audioArtistProfile: payload.audioArtistProfile,
                    showMinimizeAudio: payload.showMinimizeAudio,
                    audioContent: payload.audioContent != undefined ? payload.audioContent : audioData.audioContent
                })
            }
            else {
                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: constants.AppConstant.network_error_message,
                    type: "error",
                    position: "top"
                });
            }
        })
    }
}

export const reSetAudioPlayingState = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.AUDIO_PLAYING_MINIMIZED,
                    isPlaying: false,
                    audioName: "",
                    audioiTrack: "",
                    audioArtistProfile: constants.AppConstant.bandoLogo,
                    showMinimizeAudio: false
                })
            }
            else {
                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: constants.AppConstant.network_error_message,
                    type: "error",
                    position: "top"
                });
            }
        })
    }
}