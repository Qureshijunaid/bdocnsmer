import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-toast-message';
// Local Imports
import types from '../constants/Types'
import EndPoint from '../constants/EndPoint';
import store from '../store';
import config from '../utils/config';
import constants from '../constants';
import { GET, POST, DELETE, PUT } from '../constants/ServiceAxios';
import * as NavigationService from '../navigation/NavigationService';
import {
    setUserAccessTokenToStorage,
    setUserVerification,
    setUserEmailToStorage,
    setUserToStorage,
    getUserAccessTokenFromStorage,
    getUserEmailFromStorage,
    getUserVerification,
    getUserFromStorage,
    wipeStorage
} from '../utils/asyncstorage'
import { getArtistDetail } from './profile';

export const setInitialLoginDetails = (payload) => {
    return async (dispatch) => {
        const storeData = store.getState().initialLogin
        dispatch({
            type: types.SET_INITIAL_LOGIN_DATA,
            password: payload.password ? payload.password : storeData.password,
            coverphoto: payload.coverphoto ? payload.coverphoto : storeData.coverphoto,
            email: payload.email ? payload.email : storeData.email,
            profilePhoto: payload.profilePhoto ? payload.profilePhoto : storeData.profilePhoto,
            phoneCode: payload.phoneCode ? payload.phoneCode : storeData.phoneCode,
            phoneNumber: payload.phoneNumber ? payload.phoneNumber : storeData.phoneNumber,
            countryName: payload.countryName ? payload.countryName : storeData.countryName,
            bio: payload.bio ? payload.bio : storeData.bio,
            priceBands: payload.priceBands ? payload.priceBands : storeData.priceBands,
            genre: payload.genre ? payload.genre : storeData.genre,
            coverPhotoName: payload.coverPhotoName ? payload.coverPhotoName : storeData.coverPhotoName,
            coverPhotoType: payload.coverPhotoType ? payload.coverPhotoType : storeData.coverPhotoType,
            profilePhotoName: payload.profilePhotoName ? payload.profilePhotoName : storeData.profilePhotoName,
            profilePhotoType: payload.profilePhotoType ? payload.profilePhotoType : storeData.profilePhotoType,
        })
    }
}

export const initialLogin = () => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.INTIAL_LOGIN_LOADING,
                    isLoading: true
                })
                getUserEmailFromStorage().then(email => {
                    if (email) {
                        const data = store.getState().initialLogin

                        const formData = new FormData();
                        let profile_Full = {
                            uri: data.profilePhoto,
                            type: "image/jpg",
                            name: "profile.jpeg",
                        }
                        let cover_Full = {
                            uri: data.coverphoto,
                            type: "image/jpg",
                            name: "profile.jpeg",
                        }
                        formData.append("email", email);
                        formData.append("password", data.password);
                        if (data.profilePhoto) {
                            formData.append("profileImage", profile_Full);
                        }
                        if (data.coverphoto) {
                            formData.append("coverImage", cover_Full);
                        }
                        formData.append("phoneCode", data.phoneCode);
                        formData.append("phoneNumber", data.phoneNumber);
                        formData.append("bio", data.bio);
                        formData.append("priceBands", JSON.stringify(data.priceBands));
                        formData.append("genre", data.genre);
                        formData.append("countryName", data.countryName)


                        PUT(`${config().accesspoint}${EndPoint.INITIAL_LOGIN}`,
                            formData).then(result => {

                                if (result.data.status) {
                                    dispatch({
                                        type: types.INTIAL_LOGIN_SUCCESS,
                                        isLoading: false
                                    })

                                    setUserAccessTokenToStorage(result.data.result.data.accessToken)
                                    setUserVerification(result.data.result.data.isVerified)

                                    NavigationService.navigate(constants.ScreensName.ThanksForJoining.name, null)
                                }
                                else {

                                    Toast.show({
                                        text1: constants.AppConstant.Bando,
                                        text2: result.data.result.message,
                                        type: "error",
                                        position: "top"
                                    });

                                    dispatch({
                                        type: types.INTIAL_LOGIN_FAIL,
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
                                    type: types.INTIAL_LOGIN_FAIL,
                                    isLoading: false
                                })
                            })

                    } else {
                        Toast.show({
                            text1: constants.AppConstant.Bando,
                            text2: "Please login again",
                            type: "error",
                            position: "top"
                        });

                        dispatch({
                            type: types.INTIAL_LOGIN_FAIL,
                            isLoading: false
                        })
                    }
                })

            } else {

                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: constants.AppConstant.network_error_message,
                    type: "error",
                    position: "top"
                });
                dispatch({
                    type: types.INTIAL_LOGIN_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const sendOtp = (data) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.SEND_OTP_LOADING,
                    isLoading: true
                })
                const payload = {
                    "countryCode": data.countryCode,
                    "phoneNumber": data.phoneNumber,
                }

                POST(`${config().accesspoint}${EndPoint.SEND_OTP}`,
                    payload).then(result => {

                        if (result.data.status) {

                            dispatch({
                                type: types.SEND_OTP_SUCCESS,
                                isLoading: false
                            })
                            //result.data.result.data
                            NavigationService.navigate(constants.ScreensName.YourOtp.name, null)
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
                                type: types.SEND_OTP_FAIL,
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
                            type: types.SEND_OTP_FAIL,
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
                    type: types.SEND_OTP_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const reSendOtp = () => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.SEND_OTP_LOADING,
                    isLoading: true
                })
                const data = store.getState().initialLogin
                const payload = {
                    "countryCode": data.phoneCode,
                    "phoneNumber": data.phoneNumber,
                }

                POST(`${config().accesspoint}${EndPoint.SEND_OTP}`,
                    payload).then(result => {

                        if (result.data.status) {

                            dispatch({
                                type: types.SEND_OTP_SUCCESS,
                                isLoading: false
                            })
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: "OTP sent successfully!",
                                type: "success",
                                position: "top"
                            });
                            //result.data.result.data
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
                                type: types.SEND_OTP_FAIL,
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
                            type: types.SEND_OTP_FAIL,
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
                    type: types.SEND_OTP_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const verifyOtp = (data) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.VERIFY_OTP_LOADING,
                    isLoading: true
                })
                const reduxData = store.getState().initialLogin
                const payload = {
                    "countryCode": reduxData.phoneCode,
                    "phoneNumber": reduxData.phoneNumber,
                    "otp": data.otp,
                    "type": 1
                }

                POST(`${config().accesspoint}${EndPoint.VERIFY_OTP}`,
                    payload).then(result => {
                        if (result.data.status) {

                            dispatch({
                                type: types.VERIFY_OTP_SUCCESS,
                                isLoading: false
                            })
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: "OTP verified successfully",
                                type: "success",
                                position: "top"
                            });
                            //result.data.result.data
                            NavigationService.navigate(constants.ScreensName.ProfilePicture.name, null)
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
                                type: types.VERIFY_OTP_FAIL,
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
                            type: types.VERIFY_OTP_FAIL,
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
                    type: types.VERIFY_OTP_FAIL,
                    isLoading: false
                })
            }
        })
    }
}
