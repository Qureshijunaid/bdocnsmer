import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
import TrackPlayer, {
    usePlaybackState,
    useTrackPlayerProgress,
    useTrackPlayerEvents,
    TrackPlayerEvents,
    play
} from "react-native-track-player";
import { Platform } from "react-native";

// Local Imports
import store from '../store';
import { logoutFirebase, signInFirebase } from '../utils/Firebase/auth';
import { setAppleLogin } from './registration';
import types from '../constants/Types'
import EndPoint from '../constants/EndPoint';
import constants from '../constants'
import * as NavigationService from '../navigation/NavigationService';
import { GET, POST, DELETE, PUT, PATCH } from '../constants/ServiceAxios';
import {
    setUserAccessTokenToStorage,
    setUserVerification,
    setUserToStorage,
    getUserAccessTokenFromStorage,
    getUserFromStorage,
    wipeStorage,
    getUserEmailFromStorage,
    setUserEmailToStorage,
    getUserFCMTokenFromStorage,
    setUserRefreshTokenToStorage,
    setUserAccessTokenUpdateTime,
    getUserRefreshTokenFromStorage
} from '../utils/asyncstorage';
import config from '../utils/config';
import { getMyFeed } from './home';
import { setAudioPlayingState } from './audioMinimize';
import { setFirebaseUID } from './registration';

export const switchRoute = () => {
    return async (dispatch) => {
        getUserAccessTokenFromStorage().then(token => {
            getUserRefreshTokenFromStorage().then(refreshToken => {
                if (token !== null) {
                    dispatch({
                        type: types.AUTH_SWITCH_ROUTE,
                        isLoading: false,
                        isAppLoading: false,
                        accessToken: token,
                        refreshToken: refreshToken
                    })
                    store.dispatch(getMyFeed({ "pageNumber": 1 }));
                }
                else {
                    dispatch({
                        type: types.AUTH_SWITCH_ROUTE,
                        isLoading: false,
                        isAppLoading: false,
                        accessToken: null,
                        refreshToken: refreshToken
                    })
                }
            })
        })
    }
}

// export const clearLogoutData = () => {
//     return async (dispatch) => {
//         dispatch({
//             type: types.CLEAR_ALL_DATA
//         })
//     }
// }

export const logOut = () => {
    return async (dispatch) => {
        await TrackPlayer.reset()
        await TrackPlayer.destroy()

        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.LOGOUT_LOADING,
                    isLoading: true
                })
                PUT(`${config().accesspoint}${constants.EndPoint.LOGOUT_CLEAR_FCM}`,
                    {}).then(result => {
                        if (result.data.status) {
                            dispatch({
                                type: types.LOGOUT_SUCCESS,
                                isLoading: false,
                            })
                            dispatch({
                                type: types.CLEAR_ALL_DATA,
                                isLoading: false,
                            })
                            const payload = {
                                showMinimizeAudio: false,
                                isPlaying: false,
                                audioName: "",
                                audioTrack: "",
                                audioArtistProfile: "",
                                audioContent: null
                            }
                            logoutFirebase()
                            store.dispatch(setAudioPlayingState(payload))
                            store.dispatch(setAppleLogin(false))
                            wipeStorage();
                            store.dispatch(switchRoute())
                        } else {
                            //result.result.message
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.message,
                                type: "error",
                                position: "top"
                            });

                            dispatch({
                                type: types.LOGOUT_FAIL,
                                isLoading: false
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
                            type: types.LOGOUT_FAIL,
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
                    type: types.LOGOUT_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const sessionExpiredLogout = () => {
    return async (dispatch) => {
        wipeStorage();
        store.dispatch(setAppleLogin(false))
        store.dispatch(switchRoute())
    }
}

export const login = (payload) => {
    return async (dispatch) => {
        const fcmToken = await getUserFCMTokenFromStorage();
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.LOGIN_LOADING,
                    isLoading: true
                })
                const data = {
                    "email": payload.email,
                    "password": payload.password,
                    "stayLoggedIn": payload.stayLoggedIn,
                    "fcmToken": fcmToken === null ? "" : fcmToken,
                    "deviceOS": Platform.OS === "ios" ? "ios" : "android"
                }
                POST(`${config().accesspoint}${constants.EndPoint.LOGIN}`,
                    data).then(result => {
                        if (result.data.status) {
                            dispatch({
                                type: types.LOGIN_SUCCESS,
                                isLoading: false,
                                data: result.data.result.data,
                            })
                            signInFirebase(payload.email, payload.password)

                            let fcmTokenFromLogin = result.data.result.data.fcmToken
                            if (fcmTokenFromLogin === "" || fcmTokenFromLogin === null) {
                                store.dispatch(sendFcmToken())
                            }

                            setUserToStorage(result.data.result.data)
                            setUserEmailToStorage(payload.email)
                            setUserAccessTokenToStorage(result.data.result.data.accessToken)
                            setUserRefreshTokenToStorage(result.data.result.data.refreshToken)
                            setUserAccessTokenUpdateTime(JSON.stringify(new Date()))
                            store.dispatch(getMyFeed({ "pageNumber": 1 }))
                            store.dispatch(switchRoute())
                        } else {
                            //result.result.message
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.message,
                                type: "error",
                                position: "top"
                            });

                            dispatch({
                                type: types.LOGIN_FAIL,
                                isLoading: false
                            })
                        }
                    }).catch((error) => {
                        console.log("error===>", error)
                        Toast.show({
                            text1: constants.AppConstant.Bando,
                            text2: JSON.stringify(error),
                            type: "error",
                            position: "top"
                        });
                        // crashlytics().log(error);
                        // crashlytics().crash();

                        dispatch({
                            type: types.LOGIN_FAIL,
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
                    type: types.LOGIN_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const sendFcmToken = () => {
    return async (dispatch) => {
        const fcmTokengetFromFirebase = await messaging().getToken()
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.SEND_FCM_TOKEN_LOADING,
                })
                const data = {
                    "fcmToken": fcmTokengetFromFirebase
                }

                PUT(`${config().accesspoint}${constants.EndPoint.SET_FCM_TOKEN}`,
                    data).then(result => {
                        if (result.data.status) {
                            dispatch({
                                type: types.SEND_FCM_TOKEN_SUCCESS,
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
                                type: types.SEND_FCM_TOKEN_FAIL,
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
                            type: types.SEND_FCM_TOKEN_FAIL,
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
                    type: types.SEND_FCM_TOKEN_FAIL,
                })
            }
        })
    }
}

export const checkSocialLogin = () => {
    return async (dispatch) => {
        const fcmToken = await getUserFCMTokenFromStorage();
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                const storeData = store.getState().registration;
                dispatch({
                    type: types.LOGIN_LOADING,
                    isLoading: true
                })
                const payload = {
                    "gmail": storeData.gmail ? storeData.gmail : "",
                    "facebook": storeData.facebook ? storeData.facebook : "",
                    "apple": storeData.apple ? storeData.apple : "",
                    "fcmToken": fcmToken === null ? "" : fcmToken,
                    "deviceOS": Platform.OS === "ios" ? "ios" : "android"
                }
                POST(`${config().accesspoint}${constants.EndPoint.CHECK_SOCIAL_LOGIN}`,
                    payload).then(result => {
                        console.log("result----->", result);
                        if (result.data.status) {
                            dispatch({
                                type: types.LOGIN_SUCCESS,
                                isLoading: false,
                                data: result.data.result.data,
                            })

                            setUserToStorage(result.data.result.data)
                            setUserAccessTokenToStorage(result.data.result.data.accessToken).then(atoken => {
                                if (storeData.isAppleLogin) {
                                    setFirebaseUID(storeData.appleFirebaseUid)

                                }
                                store.dispatch(switchRoute())
                            })

                        } else if (result.data.result.message == "Consumer not found!") {
                            dispatch({
                                type: types.LOGIN_FAIL,
                                isLoading: false
                            })
                            NavigationService.navigate(constants.ScreensName.PersonalDetails.name, null)
                        } else {
                            //result.result.message
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.message,
                                type: "error",
                                position: "top"
                            });

                            dispatch({
                                type: types.LOGIN_FAIL,
                                isLoading: false
                            })
                        }
                    }).catch((error) => {
                        NavigationService.navigate(constants.ScreensName.PersonalDetails.name, null)

                        // Toast.show({
                        //     text1: constants.AppConstant.Bando,
                        //     text2:JSON.stringify(error),
                        //     type: "error",
                        //     position: "top"
                        // });
                        dispatch({
                            type: types.LOGIN_FAIL,
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
                    type: types.LOGIN_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const getUserFromLocal = () => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                getUserFromStorage().then(user => {
                    dispatch({
                        type: constants.Types.GET_DATA_FROM_LOCAL,
                        isLoading: false,
                        user: user
                    })
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

export const isArtistVerified = () => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.IS_ARTIST_VERIFIED,
                    isLoading: true
                })
                getUserEmailFromStorage().then(email => {
                    if (email) {
                        const data = {
                            "email": email
                        }
                        POST(`${config().accesspoint}${EndPoint.IS_VERIFIED}`,
                            data).then(result => {
                                if (result.data.status) {
                                    dispatch({
                                        type: types.IS_ARTIST_VERIFIED,
                                        isLoading: false
                                    })

                                    let verifiedStatus = "";
                                    if (result.data.result.data.status === 0) {
                                        verifiedStatus = "application"
                                    }
                                    if (result.data.result.data.status === 1) {
                                        verifiedStatus = "pending"
                                    }
                                    if (result.data.result.data.status === 2) {
                                        verifiedStatus = "approved"
                                    }
                                    if (result.data.result.data.status === 3) {
                                        verifiedStatus = "rejected"
                                    }
                                    setUserVerification(verifiedStatus)
                                    setTimeout(() => {
                                        store.dispatch(switchRoute(verifiedStatus))
                                    }, 300);
                                }
                                else {

                                    dispatch({
                                        type: types.IS_ARTIST_VERIFIED,
                                        isLoading: false
                                    })
                                    store.dispatch(switchRoute("application"))
                                }
                            }).catch((err) => {

                                dispatch({
                                    type: types.IS_ARTIST_VERIFIED,
                                    isLoading: false
                                })
                                store.dispatch(switchRoute("application"))
                            })

                    } else {

                        dispatch({
                            type: types.IS_ARTIST_VERIFIED,
                            isLoading: false
                        })
                        store.dispatch(switchRoute("application"))
                    }
                })

            } else {

                dispatch({
                    type: types.IS_ARTIST_VERIFIED,
                    isLoading: false
                })
                store.dispatch(switchRoute("application"))
            }
        })
    }
}

export const getPurchasesList = () => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.PURCHASES_LIST_LOADING,
                    isLoading: true
                })

                GET(`${config().accesspoint}${constants.EndPoint.PURCHASES_LIST}`,
                    {}).then(result => {
                        if (result.data.status) {
                            let subscriptions = [result.data.result.data]
                            let purchaseDate = []
                            let purchaseData = []
                            subscriptions.map((item) => {
                                for (const key of Object.keys(item)) {
                                    const name = key
                                    const val = item[key];
                                    purchaseDate.push(name)
                                    purchaseData.push(val)
                                }
                            })
                            let finalPurchaseList = []
                            purchaseDate.map((item, index) => {
                                let obj = {
                                    "title": item,
                                    "data": purchaseData[index]
                                }
                                finalPurchaseList.push(obj)
                            })
                            dispatch({
                                type: types.PURCHASES_LIST_SUCCESS,
                                isLoading: false,
                                data: finalPurchaseList,
                            })

                        } else {
                            //result.result.message
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.message,
                                type: "error",
                                position: "top"
                            });

                            dispatch({
                                type: types.PURCHASES_LIST_FAIL,
                                isLoading: false
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
                            type: types.PURCHASES_LIST_FAIL,
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
                    type: types.PURCHASES_LIST_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const getSubscriptionList = () => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.SUBSCRIPTION_LIST_LOADING,
                    isLoading: true
                })

                GET(`${config().accesspoint}${constants.EndPoint.SUBSCRIPTION_LIST}`,
                    {}).then(result => {
                        if (result.data.status) {
                            dispatch({
                                type: types.SUBSCRIPTION_LIST_SUCCESS,
                                isLoading: false,
                                data: result.data.result.data,
                            })

                        } else {
                            //result.result.message
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.message,
                                type: "error",
                                position: "top"
                            });

                            dispatch({
                                type: types.SUBSCRIPTION_LIST_FAIL,
                                isLoading: false
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
                            type: types.SUBSCRIPTION_LIST_FAIL,
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
                    type: types.SUBSCRIPTION_LIST_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const unsubscribeArtist = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.UNSUBSCRIBE_ARTIST_LOADING,
                    isLoading: true
                })
                const data = {
                    "subscriptionId": payload.subscriptionId,
                    "artistId": payload.artistId
                }

                POST(`${config().accesspoint}${constants.EndPoint.UNSUBSCRIBE_ARTIST}`,
                    data).then(result => {
                        if (result.data.status) {
                            dispatch({
                                type: types.UNSUBSCRIBE_ARTIST_SUCCESS,
                                isLoading: false,
                                data: result.data.result.data,
                            })
                            store.dispatch(getSubscriptionList())
                        } else {
                            //result.result.message
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.message,
                                type: "error",
                                position: "top"
                            });

                            dispatch({
                                type: types.UNSUBSCRIBE_ARTIST_FAIL,
                                isLoading: false
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
                            type: types.UNSUBSCRIBE_ARTIST_FAIL,
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
                    type: types.UNSUBSCRIBE_ARTIST_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const getPaymentCardsList = () => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.GET_CARDS_LIST_LOADING,
                    isLoading: true
                })
                const params = {
                    "limit": 30
                }
                GET(`${config().accesspoint}${constants.EndPoint.GET_PAYMENT_CARD_LIST}`,
                    params).then(result => {
                        if (result.data.status) {
                            let originalCardList = result.data.result.data;
                            let modifiedArrayPurchase = result.data.result.data;
                            modifiedArrayPurchase.push({ "last4": "" })

                            dispatch({
                                type: types.GET_CARDS_LIST_SUCCESS,
                                isLoading: false,
                                data: originalCardList,
                                modifiedPurchaseCardList: modifiedArrayPurchase
                            })
                        } else {
                            //result.result.message
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.message,
                                type: "error",
                                position: "top"
                            });

                            dispatch({
                                type: types.GET_CARDS_LIST_FAIL,
                                isLoading: false
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
                            type: types.GET_CARDS_LIST_FAIL,
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
                    type: types.GET_CARDS_LIST_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const deletePaymentCard = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.DELETE_PAYMENT_CARD_LOADING,
                    isLoading: true
                })
                const body = {
                    "cardId": payload.cardId
                }
                DELETE(`${config().accesspoint}${constants.EndPoint.DELETE_PAYMENT_CARD}`,
                    body).then(result => {
                        if (result.data.status) {
                            dispatch({
                                type: types.DELETE_PAYMENT_CARD_SUCCESS,
                                isLoading: false,
                                data: result.data.result.data,
                            })
                            store.dispatch(getPaymentCardsList())
                        } else {
                            //result.result.message
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.message,
                                type: "error",
                                position: "top"
                            });

                            dispatch({
                                type: types.DELETE_PAYMENT_CARD_FAIL,
                                isLoading: false
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
                            type: types.DELETE_PAYMENT_CARD_FAIL,
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
                    type: types.DELETE_PAYMENT_CARD_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const refreshToken = (successCallback, errorCallback) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.REFRESH_TOKEN_LOADING,
                    isLoading: true
                })
                getUserRefreshTokenFromStorage().then(refreshToken => {
                    const data = {
                        "refreshToken": refreshToken
                    }

                    POST(`${config().accesspoint}${constants.EndPoint.REFRESH_TOKEN}`,
                        data).then(result => {
                            if (result.data.status) {
                                setUserAccessTokenToStorage(result.data.result.data.token)
                                setUserRefreshTokenToStorage(result.data.result.data.refreshToken)
                                setUserAccessTokenUpdateTime(JSON.stringify(new Date()))
                                dispatch({
                                    type: types.REFRESH_TOKEN_SUCCESS,
                                    isLoading: false,
                                    accessToken: result.data.result.data.token
                                })
                                successCallback()
                                //store.dispatch(switchRoute("approved"))
                            } else {
                                Toast.show({
                                    text1: constants.AppConstant.Bando,
                                    text2: result.data.result.message,
                                    type: "error",
                                    position: "top"
                                });

                                dispatch({
                                    type: types.REFRESH_TOKEN_FAIL,
                                    isLoading: false
                                })
                                errorCallback()
                            }
                        }).catch(() => {
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: JSON.stringify(error),
                                type: "error",
                                position: "top"
                            });

                            dispatch({
                                type: types.REFRESH_TOKEN_FAIL,
                                isLoading: false
                            })
                            errorCallback()
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
                    type: types.REFRESH_TOKEN_FAIL,
                    isLoading: false
                })
                errorCallback()
            }
        })
    }
}

export const requestDeleteMyAccount = () => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.REQUEST_DELETE_MY_ACCOUNT_LOADING
                })
                PATCH(`${config().accesspoint}${constants.EndPoint.REQUEST_DELETE_ACCOUNT}`,
                    {}).then(result => {
                        if (result.data.status) {
                            dispatch({
                                type: types.REQUEST_DELETE_MY_ACCOUNT_SUCCESS,
                                isLoading: false
                            })
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: "Your request to delete account has been raised. You will recieve a mail shortly.",
                                type: "success",
                                position: "top"
                            });
                        } else {
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.message,
                                type: "error",
                                position: "top"
                            });
                            dispatch({
                                type: types.REQUEST_DELETE_MY_ACCOUNT_FAIL,
                                isLoading: false
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
                            type: types.REFRESH_TOKEN_FAIL,
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
                    type: types.REQUEST_DELETE_MY_ACCOUNT_FAIL,
                    isLoading: false
                })
            }
        })


    }
}

export const requestChangeMyCredential = () => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.REQUEST_CHANGE_CREDENTIAL_LOADING
                })
                PATCH(`${config().accesspoint}${constants.EndPoint.REQUEST_CHANGE_CREDENTIAL}`,
                    {}).then(result => {
                        if (result.data.status) {
                            dispatch({
                                type: types.REQUEST_CHANGE_CREDENTIAL_SUCCESS,
                                isLoading: false
                            })
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: "Your request to change credential has been raised.",
                                type: "success",
                                position: "top"
                            });
                        } else {
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.message,
                                type: "error",
                                position: "top"
                            });
                            dispatch({
                                type: types.REQUEST_CHANGE_CREDENTIAL_FAIL,
                                isLoading: false
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
                            type: types.REFRESH_TOKEN_FAIL,
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
                    type: types.REQUEST_CHANGE_CREDENTIAL_FAIL,
                    isLoading: false
                })
            }
        })


    }
}