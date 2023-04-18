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
import config from '../utils/config';


export const getSubcribedArtistList = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.SUBSCRIBE_ARTIST_LIST_LOADING,
                    isLoading: true
                })
                const params = {
                    "page": payload.pageNumber,
                    "limit": 15
                }
                GET(`${config().accesspoint}${constants.EndPoint.SUBCRIBED_ARTIST}`, params
                ).then(result => {
                    if (result.data.status) {

                        dispatch({
                            type: types.SUBSCRIBE_ARTIST_LIST_SUCCESS,
                            data: result.data.result.data,
                            // totalCount: totalCount,
                        })
                        dispatch({
                            type: types.SUBSCRIBE_ARTIST_LIST_LOADING,
                            isLoading: false,
                        })
                    }
                    else {
                        //result.data.result.data.msg
                        Toast.show({
                            text1: constants.AppConstant.Bando,
                            text2: result.data.result.data.message,
                            type: "error",
                            position: "top"
                        });

                        dispatch({
                            type: types.SUBSCRIBE_ARTIST_LIST_FAIL,
                            isLoading: false,
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
                        type: types.SUBSCRIBE_ARTIST_LIST_FAIL,
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
                    type: types.SUBSCRIBE_ARTIST_LIST_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const getSubcribedArtistChatList = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.SUBCRIBED_ARTIST_CHAT_LIST_LOADING,
                    isLoading: true
                })
                const params = {
                    "page": payload.pageNumber,
                    "limit": 15
                }
                GET(`${config().accesspoint}${constants.EndPoint.SUBCRIBED_CHAT_LIST}`, params
                ).then(result => {
                    if (result.data.status) {

                        dispatch({
                            type: types.SUBCRIBED_ARTIST_CHAT_LIST_SUCCESS,
                            subcribedChatArtistList: result.data.result.data,
                            // totalCount: totalCount,
                        })
                        dispatch({
                            type: types.SUBCRIBED_ARTIST_CHAT_LIST_LOADING,
                            isLoading: false,
                        })
                    }
                    else {
                        //result.data.result.data.msg
                        Toast.show({
                            text1: constants.AppConstant.Bando,
                            text2: result.data.result.data.message,
                            type: "error",
                            position: "top"
                        });

                        dispatch({
                            type: types.SUBCRIBED_ARTIST_CHAT_LIST_FAIL,
                            isLoading: false,
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
                        type: types.SUBCRIBED_ARTIST_CHAT_LIST_FAIL,
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
                    type: types.SUBCRIBED_ARTIST_CHAT_LIST_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const searchArtistForChat = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.SEARCH_ARTIST_FOR_CHAT_LOADING,
                    isLoading: true
                })
                let search_url = constants.EndPoint.SEARCH_ARTIST_FOR_CHAT + "/" + payload.query;

                GET(`${config().accesspoint}${search_url}`,
                    {}).then(result => {
                        if (result.data.status) {
                            dispatch({
                                type: types.SEARCH_ARTIST_FOR_CHAT_SUCCESS,
                                data: result.data.result.data,
                            })
                            dispatch({
                                type: types.SEARCH_ARTIST_FOR_CHAT_LOADING,
                                isLoading: false
                            })
                        }
                        else {
                            //result.result.message
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.message,
                                type: "error",
                                position: "top"
                            });

                            dispatch({
                                type: types.SEARCH_ARTIST_FOR_CHAT_FAIL,
                                isLoading: false,
                            })
                        }
                    }).catch((error) => {
                        Toast.show({
                            text1: constants.AppConstant.Bando,
                            text2: JSON.stringify(error),
                            type: "error",
                            position: "top"
                        });
                        dispatch({
                            type: types.SEARCH_ARTIST_FOR_CHAT_FAIL,
                            isLoading: false,
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
                    type: types.SEARCH_ARTIST_FOR_CHAT_FAIL,
                    isLoading: false,
                })
            }
        })
    }
}

export const clearSearchArtistForChat = () => {
    return async (dispatch) => {
        dispatch({
            type: types.CLEAR_SEARCH_ARTIST_FOR_CHAT
        })

    }
}

export const setSearchParamsOfFirebase = (payload) => {
    return async (dispatch) => {
        dispatch({
            type: types.SET_SEARCH_PARAMS_OF_FIREBASE,
            firebaseParamData: payload
        })

    }
}

export const setFirebaseMessage = (payload) => {

    let array = [];
    for (var key in payload.getMesssgeFromFirebase) {
        array.push(payload.getMesssgeFromFirebase[key]);
    }
    array.sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return async (dispatch) => {
        dispatch({
            type: types.SET_FIREBASE_MESSAGE,
            firebaseMessages: array,
            // payload.getMesssgeFromFirebase === null ? payload.getMesssgeFromFirebase :

            //     [payload.getMesssgeFromFirebase],
            firebaseMessageCounter: payload.messageCounter
        })

    }
}

export const setRecentChatMessage = (payload) => {
    const chatData = store.getState().chat.subcribedChatArtistList;
    const subscribedArtist = store.getState().chat.subcribedArtistList;

    let result = []
    if (payload) {
        chatData.forEach((item, index) => {
            let obj = { ...item }
            const recentFirebaseData = payload[item.receiverFirebaseId]
            obj.recent = recentFirebaseData.recent
            obj.chatStatus = recentFirebaseData.chatStatus


            result.push(obj);
            delete payload[item.receiverFirebaseId];
        });

        Object.keys(payload).forEach(p => {

            if (payload[p] && payload[p].recent) {
                const artistData = subscribedArtist.find(f => f.receiverFirebaseId === p)
                const obj = {
                    ...artistData,
                    recent: payload[p].recent,
                };

                result.push(obj);
            }

        })
    }


    result.sort(function (a, b) {
        return new Date(b.recent?.createdAt) - new Date(a.recent?.createdAt);
    });

    return async (dispatch) => {
        dispatch({
            type: types.SET_DATA_FOR_RECENT_CHAT,
            subcribedChatArtistList: result

        })
    }
}

export const clearFirebaseMessage = () => {
    return async (dispatch) => {
        dispatch({
            type: types.CLEAR_FIREBASE_MESSAGE
        })
    }
}

export const setNavigationForSubcribedChat = () => {
    return async (dispatch) => {
        dispatch({
            type: types.SET_NAVIGATION_FOR_SUBCRIBED_CHAT
        })
    }
}

export const cleanNavigationForSubcribedChat = () => {
    return async (dispatch) => {
        dispatch({
            type: types.CLEAN_NAVIGATION_FOR_SUBCRIBED_CHAT
        })
    }
}

export const postChatLastMessage = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {

                dispatch({
                    type: types.POST_LAST_CHAT_MESSAGE_LOADING,
                    isLoading: true
                })
                POST(`${config().accesspoint}${constants.EndPoint.SUBCRIBED_CHAT_LIST}`, payload
                ).then(result => {
                    if (result.data.status) {

                        dispatch({
                            type: types.POST_LAST_CHAT_MESSAGE_SUCCESS,
                            isLoading: false,
                        })
                    }
                    else {
                        Toast.show({
                            text1: constants.AppConstant.Bando,
                            text2: result.data.result.data.message,
                            type: "error",
                            position: "top"
                        });

                        dispatch({
                            type: types.POST_LAST_CHAT_MESSAGE_FAIL,
                            isLoading: false,
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
                        type: types.POST_LAST_CHAT_MESSAGE_FAIL,
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
                    type: types.POST_LAST_CHAT_MESSAGE_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const sendChatNotification = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                POST(`${config().accesspoint}${constants.EndPoint.CHAT_NOTIFICATION}`, payload
                ).then(result => {

                }).catch((err) => {

                })
            }
        })
    }
}
