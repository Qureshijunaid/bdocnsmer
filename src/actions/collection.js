import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-toast-message';

// Local Imports
import store from "../store";
import types from '../constants/Types';
import constants from '../constants'
import { GET, POST, } from '../constants/ServiceAxios';
import config from '../utils/config';
import * as NavigationService from '../navigation/NavigationService';

export const getCollectionList = (successCallBack) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.GET_COLLECTION_LIST_LOADING,
                    isLoading: true
                })
                let payload = {
                    artistId: store.getState().profile.idOfArtist
                }
                GET(`${config().accesspoint}${constants.EndPoint.GET_COLLECTIONS}`, payload)
                    .then(result => {
                        if (result.data.status) {
                            let tempCollection = result.data.result.data;
                            dispatch({
                                type: types.GET_COLLECTION_LIST_SUCCESS,
                                isLoading: false,
                                collections: tempCollection,
                            })
                            successCallBack(tempCollection)
                        }
                        else {
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.message,
                                type: "error",
                                position: "top"
                            });

                            dispatch({
                                type: types.GET_COLLECTION_LIST_FAIL,
                                isLoading: false
                            })
                        }
                    }).catch((err) => {
                        Toast.show({
                            text1: constants.AppConstant.Bando,
                            text2: JSON.stringify(err),
                            type: "error",
                            position: "top"
                        });
                        dispatch({
                            type: types.GET_COLLECTION_LIST_FAIL,
                            isLoading: false
                        })
                    })

            } else {
                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: constants.AppConstant.network_error_message,
                    type: "error",
                    position: "top"
                });
                dispatch({
                    type: types.GET_COLLECTION_LIST_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const getCollectionDetails = (data, selectedIndex, successCallback) => {
    return async (dispatch) => {
        dispatch({
            type: types.GET_COLLECTION_DETAILS_SUCCESS,
            postList: data.posts,
            collectionDetail: data,
            selectedIndex: selectedIndex
        })
        successCallback()
        // NavigationService.navigate(constants.ScreensName.Collection.name, null)
    }
}
