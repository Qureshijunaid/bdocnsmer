import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-toast-message';
import { Platform } from "react-native";
// Local Imports
import types from '../constants/Types'
import EndPoint from '../constants/EndPoint';
import { registerFirebaseAuth } from '../utils/Firebase/auth';
import store from '../store';
import config from '../utils/config';
import constants from '../constants';
import { GET, POST, DELETE, PUT } from '../constants/ServiceAxios';
import * as NavigationService from '../navigation/NavigationService';
import {
    setUserAccessTokenToStorage,
    getUserFCMTokenFromStorage,
    setUserVerification,
    setUserEmailToStorage,
    setUserToStorage,
    getUserAccessTokenFromStorage,
    getUserVerification,
    getUserEmailFromStorage,
    getUserFromStorage,
    wipeStorage,
    setUserRefreshTokenToStorage,
    setUserAccessTokenUpdateTime,
    getUserRefreshTokenFromStorage
} from '../utils/asyncstorage'
import { getConsumerProfile } from '../actions/profile';
import { isArtistVerified, checkSocialLogin } from './auth';

export const setRegistrationDetails = (payload) => {
    return async (dispatch) => {
        const storeData = store.getState().registration;
        dispatch({
            type: types.SET_REGISTRATION_DATA,
            firstName: payload.firstName ? payload.firstName : storeData.firstName,
            lastName: payload.lastName ? payload.lastName : storeData.lastName,
            email: payload.email ? payload.email : storeData.email,
            password: payload.password ? payload.password : storeData.password,
            artistName: payload.artistName ? payload.artistName : storeData.artistName,
            aboutYou: payload.aboutYou ? payload.aboutYou : storeData.aboutYou,
            bandoUsage: payload.bandoUsage ? payload.bandoUsage : storeData.bandoUsage,
            socialMedia: payload.socialMedia ? payload.socialMedia : storeData.socialMedia,
            dob: payload.dob ? payload.dob : storeData.dob,
            gender: payload.gender ? payload.gender : storeData.gender,
            phoneCode: payload.phoneCode ? payload.phoneCode : storeData.phoneCode,
            phoneNumber: payload.phoneNumber ? payload.phoneNumber : storeData.phoneNumber,
            countryName: payload.countryName ? payload.countryName : storeData.countryName,
            shipping_address: payload.shipping_address ? payload.shipping_address : storeData.shipping_address,

            profilePhoto: payload.profilePhoto ? payload.profilePhoto : storeData.profilePhoto,
            profilePhotoType: payload.profilePhotoType ? payload.profilePhotoType : storeData.profilePhotoType,
            profilePhotoName: payload.profilePhotoName ? payload.profilePhotoName : storeData.profilePhotoName,

            artistAddedNotify: payload.artistAdded != undefined ? payload.artistAdded : storeData.artistAddedNotify,
            contentAddedNotify: payload.contentAdded != undefined ? payload.contentAdded : storeData.contentAddedNotify,
            gmail: payload.gmail ? payload.gmail : storeData.gmail,
            facebook: payload.facebook ? payload.facebook : storeData.facebook,
            apple: payload.apple ? payload.apple : storeData.apple,
        })
    }
}

export const setSocialLoginRegistrationDetails = (payload) => {
    return async (dispatch) => {
        //const storeData = store.getState().registration;
        dispatch({
            type: types.SET_SOCIAL_LOGIN_REGISTRATION_DATA,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            gmail: payload.gmail,
            facebook: payload.facebook,
            apple: payload.apple,
            appleFirebaseUid: payload.appleFirebaseUid ? payload.appleFirebaseUid : ""
        })
    }
}

export const setAppleLogin = (payload) => {
    return async (dispatch) => {
        dispatch({
            type: types.IS_APPLE_LOGIN,
            isAppleLogin: payload
        })
        if (payload) {
            store.dispatch(checkSocialLogin());
        }

    }
}

export const registration = () => {
    return async (dispatch) => {
        let fcmToken = await getUserFCMTokenFromStorage()

        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.REGISTER_LOADING,
                    isLoading: true
                })
                const data = store.getState().registration
                let selectedGenre = []
                data.genres.map(item => {
                    selectedGenre.push(item._id)
                })
                const formData = new FormData();
                let profile_Full = {
                    uri: data.profilePhoto,
                    type: "image/jpg",
                    name: "profile.jpeg",
                }

                if (data.profilePhoto) {
                    formData.append("file", profile_Full);
                }

                formData.append("firstName", data.firstName);
                formData.append("lastName", data.lastName);
                formData.append("gender", data.gender);
                formData.append("dob", data.dob);
                formData.append("email", data.email);
                formData.append("bio", data.aboutYou);
                formData.append("password", data.password);
                {
                    !data.apple &&
                        formData.append("phoneNumber", data.phoneNumber);
                }
                {
                    !data.apple &&
                        formData.append("phoneCode", data.phoneCode);
                }

                formData.append("fcmToken",
                    fcmToken === null ? "" : fcmToken)


                //login by
                formData.append("gmail", data.gmail);
                formData.append("facebook", data.facebook);
                formData.append("apple", data.apple);

                let shippinaddress = [{
                    "line1": data.shipping_address.address1,
                    "line2": data.shipping_address.address2,
                    "flat_number": data.shipping_address.buildingNum,
                    "post_code": data.shipping_address.postalCode,
                    "city": data.shipping_address.city,
                    "country": data.shipping_address.country,
                    "countryCode": data.shipping_address.countryCode
                }];
                formData.append("shipping_address", JSON.stringify(shippinaddress));
                //formData.append("shipping_address", data.shipping_address.buildingNum+","+data.shipping_address.address1+","+data.shipping_address.address2+","+data.shipping_address.city+","+data.shipping_address.postalCode);
                // formData.append("genres", JSON.stringify(data.bandoUsage));
                formData.append("genres", JSON.stringify(selectedGenre));
                formData.append("countryName", data.countryName);
                formData.append("deviceToken", 'test-devices token');
                formData.append("deviceOS", Platform.OS === "ios" ? "ios" : "android");
                formData.append("newArtistAdded", data.artistAddedNotify);
                formData.append("newContentAdded", data.contentAddedNotify);
                formData.append("stayLoggedIn", false)

                POST(`${config().accesspoint}${EndPoint.REGISTER}`,
                    formData).then(result => {

                        if (result.data.status) {

                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: "Registered successfully",
                                type: "success",
                                position: "top"
                            });

                            dispatch({
                                type: types.LOGIN_SUCCESS,
                                isLoading: false,
                                data: result.data.result.data,
                            })
                            setUserToStorage(result.data.result.data)
                            setUserRefreshTokenToStorage(result.data.result.data.refreshToken)
                            setUserAccessTokenUpdateTime(JSON.stringify(new Date()))
                            setUserAccessTokenToStorage(result.data.result.data.accessToken).then(atoken => {
                                if (data.apple) {
                                    setFirebaseUID(data.appleFirebaseUid)
                                } else {
                                    registerFirebaseAuth(data.email, data.password)
                                }
                            })


                            NavigationService.navigate(constants.ScreensName.ThankYou.name, null)

                        }
                        else {
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.message,
                                type: "error",
                                position: "top"
                            });

                            dispatch({
                                type: types.REGISTER_FAIL,
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
                            type: types.REGISTER_FAIL,
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
                    type: types.REGISTER_FAIL,
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
                const data = store.getState().registration;
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
                const reduxData = store.getState().registration;
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
                            NavigationService.navigate(constants.ScreensName.ShippingDetails.name, null)
                        } else {
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

export const selectUserGenre = (payload) => {
    return async (dispatch) => {
        const updatedGenre = store.getState().registration.genres;
        if (updatedGenre.length > 0) {
            updatedGenre.map(item => {
                if (item._id == payload.genreId) {
                    if (item.isSelected) {
                        item.isSelected = false;
                    } else {
                        item.isSelected = true;
                    }
                }

                return item;
            });
        }

        dispatch({
            type: types.SELECT_USER_GENRE,
            updatedGenre: updatedGenre
        })
    }
}

export const getGenre = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.GET_GENRE_SUCCESS,
                    isLoading: true
                })

                const params = {
                    "page": '',
                    "limit": '',
                    "search": ""
                }

                GET(`${constants.EndPoint.GET_GENRE}`, params
                ).then(result => {

                    if (result.data.status) {
                        result.data.result.data[0].genres.map((item) => {
                            item.isSelected = false
                        })
                        dispatch({
                            type: types.GET_GENRE_SUCCESS,
                            isLoading: false,
                            genres: result.data.result.data[0].genres,
                            totalCount: result.data.result.data[0].totalCount
                        })
                        NavigationService.navigate(constants.ScreensName.ProfilePicture.name, null)
                        //NavigationService.navigate(constants.ScreensName.SelectGenre.name, null)
                    }
                    else {
                        Toast.show({
                            text1: constants.AppConstant.Bando,
                            text2: result.data.result.data.message,
                            type: "error",
                            position: "top"
                        });

                        dispatch({
                            type: types.GET_GENRE_FAIL,
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
                        type: types.GET_GENRE_FAIL,
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
                    type: types.GET_GENRE_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const getGenreMapWithPreValue = () => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.GET_GENRE_SUCCESS,
                    isLoading: true
                })

                const params = {
                    "page": '',
                    "limit": '',
                    "search": ""
                }

                let preSelectedGenres =
                    store.getState().auth.userRegistered ? store.getState().auth.userRegistered.genres ?
                        store.getState().auth.userRegistered.genres : [] : [];

                GET(`${constants.EndPoint.GET_GENRE}`, params
                ).then(result => {
                    if (result.data.status) {

                        result.data.result.data[0].genres.map((item) => {
                            let isSelectedIndex = preSelectedGenres.indexOf(item._id);
                            if (isSelectedIndex > -1) {
                                item.isSelected = true
                            } else {
                                item.isSelected = false
                            }
                        });

                        dispatch({
                            type: types.GET_GENRE_SUCCESS,
                            isLoading: false,
                            genres: result.data.result.data[0].genres,
                            totalCount: result.data.result.data[0].totalCount
                        })
                        // NavigationService.navigate(constants.ScreensName.SelectGenre.name, null)
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
                            type: types.GET_GENRE_FAIL,
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
                        type: types.GET_GENRE_FAIL,
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
                    type: types.GET_GENRE_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const setForgetPasswordResetToken = (payload) => {
    return async (dispatch) => {
        dispatch({
            type: types.SET_FORGET_PASSWORD_RESET_TOKEN,
            forgetPasswordResetToken: payload,
        });
    }
}

/*********************************************Old Code************************************************/

export const verifyEmail = (data) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.VERIFY_EMAIL_LOADING,
                    isLoading: true
                })
                const payload = {
                    "email": data.email
                }
                POST(`${config().accesspoint}${EndPoint.CHECK_EMAIL}`,
                    payload).then(result => {

                        if (!result.data.result.data.status) {
                            dispatch({
                                type: types.VERIFY_EMAIL_SUCCESS,
                                isLoading: false
                            })
                            NavigationService.navigate(constants.ScreensName.PhoneNumber.name, null);
                        }
                        else {

                            //result.data.result.data.msg
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.data.msg,
                                type: "error",
                                position: "top"
                            });

                            dispatch({
                                type: types.VERIFY_EMAIL_FAIL,
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
                            type: types.VERIFY_EMAIL_FAIL,
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
                    type: types.VERIFY_EMAIL_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const setEmail = (payload) => {
    return async (dispatch) => {
        dispatch({
            type: types.SET_EMAIL,
            emailForget: payload.email
        })
    }
}

export const clearForgetPassword = (payload) => {
    return async (dispatch) => {
        dispatch({
            type: types.CLEAR_FORGET_PASSWORD,
            forgetPasswordFailResponse: payload.email
        })
    }
}

export const forgetPassword = () => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.FORGET_PASSWORD_SUCCESS,
                    isLoading: true
                })
                dispatch({
                    type: types.FORGET_PASSWORD_FAIL,
                    forgetPasswordFailResponse: null,
                    isLoading: true
                })
                const payload = {
                    "email": store.getState().registration.emailForget
                }

                POST(`${config().accesspoint}${EndPoint.FORGET_PASSWORD}`,
                    payload).then(result => {

                        if (result.data.status) {
                            dispatch({
                                type: types.FORGET_PASSWORD_SUCCESS,
                                forgetPasswordResponse: result.data.result.data,
                                isLoading: false
                            })
                            NavigationService.navigate(constants.ScreensName.CheckYourEmail.name, null)
                        }
                        else {

                            //result.data.result.data.msg
                            // Toast.show({
                            //     text1: constants.AppConstant.Bando,
                            //     text2: result.data.message,
                            //     type: "error",
                            //     position: "top"
                            // });

                            dispatch({
                                type: types.FORGET_PASSWORD_FAIL,
                                forgetPasswordFailResponse: 'forgetError',
                                isLoading: false
                            })
                        }
                    }).catch((err) => {
                        // Toast.show({
                        //     text1: constants.AppConstant.Bando,
                        //     text2: JSON.stringify(err),
                        //     type: "error",
                        //     position: "top"
                        // });

                        dispatch({
                            type: types.FORGET_PASSWORD_FAIL,
                            forgetPasswordFailResponse: 'forgetError',
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
                    type: types.FORGET_PASSWORD_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const resetPassword = (data) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.RESET_PASSWORD_SUCCESS,
                    isLoading: true
                })
                const payload = {
                    "password": data.password,
                    "password_reset_token": store.getState().registration.forgetPasswordResponse.reset_token
                }
                POST(`${config().accesspoint}${EndPoint.RESET_PASSWORD}`,
                    payload).then(result => {

                        if (result.data.status) {
                            dispatch({
                                type: types.RESET_PASSWORD_SUCCESS,
                                isLoading: false
                            })
                            dispatch({
                                type: types.EMAIL_NULL,
                            })
                            NavigationService.navigate(constants.ScreensName.LogIn.name, null)
                        }
                        else {

                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.data.msg,
                                type: "error",
                                position: "top"
                            });

                            dispatch({
                                type: types.RESET_PASSWORD_FAIL,
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
                            type: types.RESET_PASSWORD_FAIL,
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
                    type: types.RESET_PASSWORD_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const setFirebaseUID = (uid) => {
    NetInfo.fetch().then(state => {
        if (state.isConnected) {

            let data = {
                "uuid": uid
            }

            PUT(`${config().accesspoint}${constants.EndPoint.SET_FIREBASE_UID}`,
                data).then(result => {

                    if (result.data.status) {
                        store.dispatch(getConsumerProfile("notNavigateToConsumerProfile"))
                    }
                    else {
                        Toast.show({
                            text1: constants.AppConstant.Bando,
                            text2: result.data.result.data.message,
                            type: "error",
                            position: "top"
                        });

                    }
                }).catch((err) => {
                    Toast.show({
                        text1: constants.AppConstant.Bando,
                        text2: JSON.stringify(err),
                        type: "error",
                        position: "top"
                    });
                })

        } else {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: constants.AppConstant.network_error_message,
                type: "error",
                position: "top"
            });


        }
    })
}



