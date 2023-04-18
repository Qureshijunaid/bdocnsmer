import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-toast-message';
import { Platform } from 'react-native';
import TrackPlayer, {
    usePlaybackState,
    useTrackPlayerProgress, useTrackPlayerEvents
} from "react-native-track-player";
// Local Imports
import types from '../constants/Types'
import EndPoint from '../constants/EndPoint';
import store from '../store';
import config from '../utils/config';
import constants from '../constants';
import { GET, POST, DELETE, PUT } from '../constants/ServiceAxios';
import * as NavigationService from '../navigation/NavigationService';
import { paymentSuccess, handlePaymentLoader } from '../actions/home'
import { setUserToStorage, setArtistDetailToStorage } from '../utils/asyncstorage';
import { setSelectedPost } from './post';
import { downloadFile } from '../utils/DownloadVideo';
import { setAudioPlayingState, reSetAudioPlayingState } from './audioMinimize';
export const getProfileDataIntoHome = (payload) => {
    return async (dispatch) => {
        dispatch({
            type: types.GET_PROFILE_DATA_INTO_HOMESCREEN,
            profileDataIntoHome: payload
        })
    }
}

export const editProfileLocalData = (payload) => {
    return async (dispatch) => {
        dispatch({
            type: types.SAVE_EDIT_PROFILE_LOCAL_DATA,
            profileImage: payload.image,
            coverImage: payload.coverImage
        })
    }
}

export const setArtistID = (payload) => {
    return async (dispatch) => {
        dispatch({
            type: types.SET_ARTIST_ID,
            idOfArtist: payload
        })
    }

}

export const setArtistDetailFromApp = (data) => {
    return async (dispatch) => {
        dispatch({
            type: types.GET_ARTIST_DETATILS_SUCCESS,
            artistDetail: data
        })
    }
}

export const handleClickArtistDetail = () => {
    return async (dispatch) => {
        dispatch({
            type: types.GET_ARTIST_DETAILS_LOADING,
            isLoading: true
        })
    }
}

export const handleSetMinimizedDataAfterLikeUnLike = (selectedAudio) => {
    return async (dispatch) => {
        TrackPlayer.getState().then(playbackState => {
            console.log("selectedData--->", playbackState, selectedAudio);
            if (Platform.OS == "android") {
                if (playbackState === 0 || playbackState === 1 || playbackState === 2 || playbackState === 8) {
                    const payload = {
                        showMinimizeAudio: true,
                        isPlaying: false,
                        audioName: selectedAudio.title,
                        audioTrack: selectedAudio.media_url,
                        audioArtistProfile: selectedAudio.cover_image,
                        audioContent: selectedAudio
                    }
                    store.dispatch(setAudioPlayingState(payload))
                } else {
                    const payload = {
                        showMinimizeAudio: true,
                        isPlaying: true,
                        audioName: selectedAudio.title,
                        audioTrack: selectedAudio.media_url,
                        audioArtistProfile: selectedAudio.cover_image,
                        audioContent: selectedAudio
                    }
                    store.dispatch(setAudioPlayingState(payload))
                }
            } else {
                if (playbackState === TrackPlayer.STATE_PAUSED || playbackState === "ready" || playbackState === "loading" || playbackState === "idle") {
                    const payload = {
                        showMinimizeAudio: true,
                        isPlaying: false,
                        audioName: selectedAudio.title,
                        audioTrack: selectedAudio.media_url,
                        audioArtistProfile: selectedAudio.cover_image,
                        audioContent: selectedAudio
                    }
                    store.dispatch(setAudioPlayingState(payload))
                } else {
                    const payload = {
                        showMinimizeAudio: true,
                        isPlaying: true,
                        audioName: selectedAudio.title,
                        audioTrack: selectedAudio.media_url,
                        audioArtistProfile: selectedAudio.cover_image,
                        audioContent: selectedAudio
                    }
                    store.dispatch(setAudioPlayingState(payload))
                }
            }
        })

    }
}

export const getArtistDetail = (data) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            let getArtistId = store.getState().profile.idOfArtist
            if (state.isConnected) {
                dispatch({
                    type: types.GET_ARTIST_DETAILS_LOADING,
                    isLoading: true
                })
                let payload = {
                    artist_id: getArtistId
                }

                GET(`${config().accesspoint}${constants.EndPoint.ARTIST_DETAILS}`, payload
                ).then(result => {

                    if (result.data.status) {
                        dispatch({
                            type: types.GET_ARTIST_DETAILS_LOADING,
                            isLoading: false
                        })
                        dispatch({
                            type: types.GET_ARTIST_DETATILS_SUCCESS,
                            artistDetail: result.data.result.data
                        })

                        setArtistDetailToStorage(result.data.result.data)
                        // store.dispatch(handlePaymentLoader(false))
                        // store.dispatch(paymentSuccess(false, false, false))

                        let audioArray = result.data.result.data[3].audioDetails
                        let selectedPostId = store.getState().post.selectedPostId
                        if (selectedPostId !== null) {
                            let selectedAudioIndex = audioArray.findIndex(item => item._id === selectedPostId)
                            if (selectedAudioIndex > -1) {
                                let selectedData = audioArray[selectedAudioIndex]
                                const payloadToSetData = {
                                    "post_id": selectedPostId,
                                    "post_data": selectedData
                                }
                                store.dispatch(handleSetMinimizedDataAfterLikeUnLike(selectedData))
                                store.dispatch(setSelectedPost(payloadToSetData))
                            }

                            let videoArray = result.data.result.data[4].videoDetails
                            let selectedVideoIndex = videoArray.findIndex(item => item._id === selectedPostId)
                            if (selectedVideoIndex > -1) {
                                let selectedData = videoArray[selectedVideoIndex]
                                const payloadToSetData = {
                                    "post_id": selectedPostId,
                                    "post_data": selectedData
                                }
                                store.dispatch(setSelectedPost(payloadToSetData))
                            }

                            let imageArray = result.data.result.data[2].imageDetails
                            let selectedImageIndex = imageArray.findIndex(item => item._id === selectedPostId)
                            if (selectedImageIndex > -1) {
                                let selectedData = imageArray[selectedImageIndex]
                                const payloadToSetData = {
                                    "post_id": selectedPostId,
                                    "post_data": selectedData
                                }
                                store.dispatch(setSelectedPost(payloadToSetData))
                            }

                        }

                        if (data) {
                            NavigationService.navigate(constants.ScreensName.ArtistDetails.name, null)
                            store.dispatch(handlePaymentLoader(false))
                        }



                    }
                    else {
                        //result.data.result.data.msg
                        Toast.show({
                            text1: constants.AppConstant.Bando,
                            text2: result.data.result.data.message,
                            type: "error",
                            position: "top"
                        });
                        store.dispatch(handlePaymentLoader(false))

                        dispatch({
                            type: types.GET_ARTIST_DETAILS_LOADING,
                            isLoading: false
                        })
                        dispatch({
                            type: types.GET_ARTIST_DETATILS_FAIL,

                        })
                    }
                }).catch((err) => {
                    // Toast.show({
                    //     text1: constants.AppConstant.Bando,
                    //     text2:JSON.stringify(err),
                    //     type: "error",
                    //     position: "top"
                    // });
                    store.dispatch(handlePaymentLoader(false))

                    dispatch({
                        type: types.GET_ARTIST_DETAILS_LOADING,
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
                store.dispatch(handlePaymentLoader(false))

                dispatch({
                    type: types.GET_ARTIST_DETAILS_LOADING,
                    isLoading: false
                })
            }
        })
    }
}

export const getArtistDetailHomePage = (artistId, shouldNavigate, selectedPost) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.GET_ARTIST_DETAILS_LOADING,
                    isLoading: true
                })
                let payload = {
                    artist_id: artistId
                }
                GET(`${config().accesspoint}${constants.EndPoint.ARTIST_DETAILS}`, payload
                ).then(result => {
                    if (result.data.status) {
                        dispatch({
                            type: types.GET_ARTIST_DETAILS_LOADING,
                            isLoading: false
                        })
                        dispatch({
                            type: types.GET_ARTIST_DETATILS_SUCCESS,
                            artistDetail: result.data.result.data
                        })
                        setArtistDetailToStorage(result.data.result.data)
                        if (shouldNavigate) {
                            NavigationService.navigate(constants.ScreensName.ArtistDetails.name, null)
                        } else if (selectedPost) {
                            if (selectedPost.media_type === "video") {
                                downloadFile(selectedPost.media_url).then(res => {
                                    if (res) {
                                        let data = {
                                            ...selectedPost,
                                            media_url: res,
                                            chunk_url: res
                                        }
                                        NavigationService.navigate(constants.ScreensName.ArtistDetails.name, {
                                            "postData": data,
                                            "fromHome": true
                                        })
                                    } else {
                                        NavigationService.navigate(constants.ScreensName.ArtistDetails.name, {
                                            "postData": selectedPost,
                                            "fromHome": true
                                        })
                                    }
                                })
                            } else {
                                NavigationService.navigate(constants.ScreensName.ArtistDetails.name, {
                                    "postData": selectedPost,
                                    "fromHome": true
                                })
                            }
                        }
                        store.dispatch(handlePaymentLoader(false))
                    }
                    else {
                        //result.data.result.data.msg
                        Toast.show({
                            text1: constants.AppConstant.Bando,
                            text2: result.data.result.data.message,
                            type: "error",
                            position: "top"
                        });
                        store.dispatch(handlePaymentLoader(false))

                        dispatch({
                            type: types.GET_ARTIST_DETAILS_LOADING,
                            isLoading: false
                        })
                        dispatch({
                            type: types.GET_ARTIST_DETATILS_FAIL,

                        })
                    }
                }).catch((err) => {
                    store.dispatch(handlePaymentLoader(false))

                    dispatch({
                        type: types.GET_ARTIST_DETAILS_LOADING,
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
                store.dispatch(handlePaymentLoader(false))

                dispatch({
                    type: types.GET_ARTIST_DETAILS_LOADING,
                    isLoading: false
                })
            }
        })
    }
}

export const getArtistDetailCollectionPage = (artistId, successCallback) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.GET_ARTIST_DETAILS_LOADING,
                    isLoading: true
                })
                let payload = {
                    artist_id: artistId
                }
                GET(`${config().accesspoint}${constants.EndPoint.ARTIST_DETAILS}`, payload
                ).then(result => {
                    if (result.data.status) {
                        dispatch({
                            type: types.GET_ARTIST_DETAILS_LOADING,
                            isLoading: false
                        })
                        dispatch({
                            type: types.GET_ARTIST_DETATILS_SUCCESS,
                            artistDetail: result.data.result.data
                        })
                        setArtistDetailToStorage(result.data.result.data)
                        successCallback()
                        // if (shouldNavigate) {
                        //     NavigationService.navigate(constants.ScreensName.ArtistDetails.name, null)
                        // } else if (selectedPost) {
                        //     if (selectedPost.media_type === "video") {
                        //         downloadFile(selectedPost.media_url).then(res => {
                        //             if (res) {
                        //                 let data = {
                        //                     ...selectedPost,
                        //                     media_url: res,
                        //                     chunk_url: res
                        //                 }
                        //                 NavigationService.navigate(constants.ScreensName.ArtistDetails.name, {
                        //                     "postData": data,
                        //                     "fromHome": true
                        //                 })
                        //             } else {
                        //                 NavigationService.navigate(constants.ScreensName.ArtistDetails.name, {
                        //                     "postData": selectedPost,
                        //                     "fromHome": true
                        //                 })
                        //             }
                        //         })
                        //     } else {
                        //         NavigationService.navigate(constants.ScreensName.ArtistDetails.name, {
                        //             "postData": selectedPost,
                        //             "fromHome": true
                        //         })
                        //     }
                        // }
                        store.dispatch(handlePaymentLoader(false))
                    }
                    else {
                        //result.data.result.data.msg
                        Toast.show({
                            text1: constants.AppConstant.Bando,
                            text2: result.data.result.data.message,
                            type: "error",
                            position: "top"
                        });
                        store.dispatch(handlePaymentLoader(false))

                        dispatch({
                            type: types.GET_ARTIST_DETAILS_LOADING,
                            isLoading: false
                        })
                        dispatch({
                            type: types.GET_ARTIST_DETATILS_FAIL,

                        })
                    }
                }).catch((err) => {
                    store.dispatch(handlePaymentLoader(false))

                    dispatch({
                        type: types.GET_ARTIST_DETAILS_LOADING,
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
                store.dispatch(handlePaymentLoader(false))

                dispatch({
                    type: types.GET_ARTIST_DETAILS_LOADING,
                    isLoading: false
                })
            }
        })
    }
}

export const editConsumerDetail = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                let consumerDetails = store.getState().auth.userRegistered;
                dispatch({
                    type: types.EDIT_CONSUMER_PROFILE_DETAIL_LOADING,
                    isLoading: true
                })

                let profileFull = {
                    uri: payload.profileImage,
                    name: "Profile.jpg",
                    type: "image/jpeg"
                }

                let formData = new FormData();
                //formData.append("consumerId", getArtistId)
                formData.append("email", payload.email)
                formData.append("bio", payload.bio)

                formData.append("firstName", payload.firstName)
                formData.append("lastName", payload.lastName)
                formData.append("dob", payload.dob)
                formData.append("gender", payload.gender)
                formData.append("phoneNumber", payload.phoneNumber)
                formData.append("phoneCode", payload.phoneCode)

                if (profileFull.uri) {
                    formData.append("file", profileFull)
                } else {
                    formData.append("profileImage", consumerDetails.profileImage)
                }

                PUT(`${config().accesspoint}${constants.EndPoint.EDIT_CONSUMER}`, formData
                ).then(result => {

                    if (result.data.status) {

                        dispatch({
                            type: types.EDIT_CONSUMER_PROFILE_DETAIL_LOADING,
                            isLoading: false
                        })

                        dispatch({
                            type: types.LOGIN_SUCCESS,
                            data: result.data.result.data
                        })
                        setUserToStorage(result.data.result.data);
                        // NavigationService.navigate(constants.ScreensName.Homepage.name, null)
                        NavigationService.navigate(constants.ScreensName.Settings.name, null);

                    }
                    else {

                        Toast.show({
                            text1: constants.AppConstant.Bando,
                            text2: result.data.result.data.message,
                            type: "error",
                            position: "top"
                        });

                        dispatch({
                            type: types.EDIT_CONSUMER_PROFILE_DETAIL_LOADING,
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
                        type: types.EDIT_CONSUMER_PROFILE_DETAIL_LOADING,
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
                    type: types.EDIT_CONSUMER_PROFILE_DETAIL_LOADING,
                    isLoading: false
                })
            }
        })
    }
}

export const viewAllMedia = (data) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            let payload = {
                "media_type": data.media_type,
                "page": data.pageNumber,
                "limit": 10,
                "search": ""
            }
            if (state.isConnected) {
                dispatch({
                    type: types.VIEW_ALL_MEDIA_LOADING,
                    isLoading: true
                })
                store.dispatch(handlePaymentLoader(false))

                GET(`${config().accesspoint}${constants.EndPoint.VIEW_ALL_MEDIA}`, payload
                ).then(result => {

                    if (result.data.status) {


                        let posts = []
                        let totalCount = 0

                        if (data.pageNumber === 1) {
                            posts = result.data.result.data[0].posts;
                            totalCount = result.data.result.data[0].totalCount

                        } else {
                            const data = store.getState();
                            let prev_Posts = data.profile.mediaList;
                            posts = prev_Posts.concat(result.data.result.data[0].posts);
                            totalCount = result.data.result.data[0].totalCount
                        }
                        dispatch({
                            type: types.VIEW_ALL_MEDIA_LOADING,
                            isLoading: false
                        })
                        dispatch({
                            type: types.VIEW_ALL_MEDIA_SUCCESS,
                            mediaList: posts,
                            mediaCount: totalCount
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
                            type: types.VIEW_ALL_MEDIA_LOADING,
                            isLoading: false
                        })
                        dispatch({
                            type: types.VIEW_ALL_MEDIA_FAIL,
                            viewAllMediaFail: result.data.result.data.msg

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
                        type: types.VIEW_ALL_MEDIA_LOADING,
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
                    type: types.VIEW_ALL_MEDIA_LOADING,
                    isLoading: false
                })
            }
        })
    }
}

export const getAllImages = (payload) => {
    let artistId = store.getState().profile.idOfArtist
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            const params = {
                "page": payload.pageNumber,
                "limit": 10,
                "search": ""
            }
            if (state.isConnected) {
                dispatch({
                    type: types.GET_ARTIST_IMAGES_LOADING,
                    isLoading: true
                })
                store.dispatch(handlePaymentLoader(false))

                GET(`${config().accesspoint}${constants.EndPoint.GET_ARTIST_IMAGES}${'/'}${artistId}`, params
                ).then(result => {

                    if (result.data.status) {


                        let posts = []
                        let totalCount = 0

                        if (payload.pageNumber === 1) {
                            posts = result.data.result.data[0].posts;
                            totalCount = result.data.result.data[0].totalCount

                        } else {
                            const data = store.getState();
                            let prev_Posts = data.profile.imageList;
                            posts = prev_Posts.concat(result.data.result.data[0].posts);
                            totalCount = result.data.result.data[0].totalCount
                        }
                        let selectedPostId = store.getState().post.selectedPostId
                        if (selectedPostId !== null) {
                            let selectedIndex = posts.findIndex(item => item._id === selectedPostId)
                            let selectedData = posts[selectedIndex]
                            const payloadToSetData = {
                                "post_id": selectedPostId,
                                "post_data": selectedData
                            }
                            store.dispatch(setSelectedPost(payloadToSetData))
                        }

                        dispatch({
                            type: types.GET_ARTIST_IMAGES_LOADING,
                            isLoading: false
                        })
                        dispatch({
                            type: types.GET_ARTIST_IMAGES_SUCCESS,
                            imageList: posts,
                            totalCount: totalCount
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
                            type: types.GET_ARTIST_IMAGES_LOADING,
                            isLoading: false
                        })
                        dispatch({
                            type: types.GET_ARTIST_IMAGES_FAIL,
                            // viewAllMediaFail: result.data.result.data.msg

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
                        type: types.GET_ARTIST_IMAGES_LOADING,
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
                    type: types.GET_ARTIST_IMAGES_LOADING,
                    isLoading: false
                })
            }
        })
    }
}

export const getAllAudio = (payload) => {
    let artistId = store.getState().profile.idOfArtist
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            const params = {
                "page": payload.pageNumber,
                "limit": 10,
                "search": ""
            }
            if (state.isConnected) {
                dispatch({
                    type: types.GET_ARTIST_AUDIO_LOADING,
                    isLoading: true
                })
                store.dispatch(handlePaymentLoader(false))
                // 
                GET(`${config().accesspoint}${constants.EndPoint.GET_ARTIST_AUDIO}${'/'}${artistId}`, params
                ).then(result => {

                    if (result.data.status) {


                        let posts = []
                        let totalCount = 0

                        if (payload.pageNumber === 1) {
                            posts = result.data.result.data[0].posts;
                            totalCount = result.data.result.data[0].totalCount

                        } else {
                            const data = store.getState();
                            let prev_Posts = data.profile.audioList;
                            posts = prev_Posts.concat(result.data.result.data[0].posts);
                            totalCount = result.data.result.data[0].totalCount
                        }
                        let selectedPostId = store.getState().post.selectedPostId
                        if (selectedPostId !== null) {
                            let selectedIndex = posts.findIndex(item => item._id === selectedPostId)
                            let selectedData = posts[selectedIndex]
                            const payloadToSetData = {
                                "post_id": selectedPostId,
                                "post_data": selectedData
                            }
                            store.dispatch(setSelectedPost(payloadToSetData))
                        }
                        dispatch({
                            type: types.GET_ARTIST_AUDIO_LOADING,
                            isLoading: false
                        })
                        dispatch({
                            type: types.GET_ARTIST_AUDIO_SUCCESS,
                            audioList: posts,
                            totalCount: totalCount
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
                            type: types.GET_ARTIST_AUDIO_LOADING,
                            isLoading: false
                        })
                        dispatch({
                            type: types.GET_ARTIST_AUDIO_FAIL,
                            // viewAllMediaFail: result.data.result.data.msg

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
                        type: types.GET_ARTIST_AUDIO_LOADING,
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
                    type: types.GET_ARTIST_AUDIO_LOADING,
                    isLoading: false
                })
            }
        })
    }
}

export const getAllVideo = (payload) => {
    let artistId = store.getState().profile.idOfArtist
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            // let payload = {
            //     "media_type": data.media_type,
            //     "page": data.pageNumber,
            //     "limit": 10,
            //     "search": ""
            // }
            const params = {
                "page": payload.pageNumber,
                "limit": 10,
                "search": ""
            }
            if (state.isConnected) {
                dispatch({
                    type: types.GET_ARTIST_VIDEO_LOADING,
                    isLoading: true
                })
                store.dispatch(handlePaymentLoader(false))

                GET(`${config().accesspoint}${constants.EndPoint.GET_ARITST_VIDEO}${'/'}${artistId}`, params
                ).then(result => {

                    if (result.data.status) {


                        let posts = []
                        let totalCount = 0

                        if (payload.pageNumber === 1) {
                            posts = result.data.result.data[0].posts;
                            totalCount = result.data.result.data[0].totalCount

                        } else {
                            const data = store.getState();
                            let prev_Posts = data.profile.videoList;
                            posts = prev_Posts.concat(result.data.result.data[0].posts);
                            totalCount = result.data.result.data[0].totalCount
                        }
                        let selectedPostId = store.getState().post.selectedPostId
                        if (selectedPostId !== null) {
                            let selectedIndex = posts.findIndex(item => item._id === selectedPostId)
                            let selectedData = posts[selectedIndex]
                            const payloadToSetData = {
                                "post_id": selectedPostId,
                                "post_data": selectedData
                            }
                            store.dispatch(setSelectedPost(payloadToSetData))
                        }
                        dispatch({
                            type: types.GET_ARTIST_VIDEO_LOADING,
                            isLoading: false
                        })
                        dispatch({
                            type: types.GET_ARTIST_VIDEO_SUCCESS,
                            videoList: posts,
                            totalCount: totalCount
                            // mediaList: posts,
                            // mediaCount: totalCount
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
                            type: types.GET_ARTIST_VIDEO_LOADING,
                            isLoading: false
                        })
                        dispatch({
                            type: types.GET_ARTIST_VIDEO_FAIL,
                            // viewAllMediaFail: result.data.result.data.msg

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
                        type: types.GET_ARTIST_VIDEO_LOADING,
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
                    type: types.GET_ARTIST_VIDEO_LOADING,
                    isLoading: false
                })
            }
        })
    }
}

export const getConsumerProfile = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.LOGIN_LOADING,
                    isLoading: true
                })
                GET(`${config().accesspoint}${constants.EndPoint.CONSUMER_DETAILS}`,
                    {}).then(result => {
                        if (result.data.status) {
                            dispatch({
                                type: types.LOGIN_SUCCESS,
                                isLoading: false,
                                data: result.data.result.data[0],
                            })
                            setUserToStorage(result.data.result.data[0]);
                            if (payload === null || payload === undefined) {
                                NavigationService.navigate(constants.ScreensName.UserProfile.name, null)
                            }

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
                                type: types.LOGIN_FAIL,
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

export const editShippingAddress = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.UPDATING_SHIPPING_ADDRESS,
                    isLoading: true
                })
                PUT(`${config().accesspoint}${constants.EndPoint.EDIT_SHIPPING_ADDRESS}`,
                    payload).then(result => {
                        if (result.data.status) {

                            dispatch({
                                type: types.UPDATING_SHIPPING_ADDRESS_SUCCESS,
                                isLoading: false
                            });

                            dispatch({
                                type: types.LOGIN_SUCCESS,
                                data: result.data.result.data
                            })
                            setUserToStorage(result.data.result.data);
                            NavigationService.navigate(constants.ScreensName.Settings.name, null);

                        }
                        else {

                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.message,
                                type: "error",
                                position: "top"
                            });
                            dispatch({
                                type: types.UPDATING_SHIPPING_ADDRESS,
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
                            type: types.UPDATING_SHIPPING_ADDRESS,
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
                    type: types.UPDATING_SHIPPING_ADDRESS,
                    isLoading: false
                })
            }
        })
    }
}

export const updateUserIntrest = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.UPDATING_SHIPPING_ADDRESS,
                    isLoading: true
                })
                PUT(`${config().accesspoint}${constants.EndPoint.EDIT_INTREST}`,
                    payload).then(result => {
                        if (result.data.status) {

                            dispatch({
                                type: types.UPDATING_SHIPPING_ADDRESS_SUCCESS,
                                isLoading: false
                            });

                            dispatch({
                                type: types.LOGIN_SUCCESS,
                                data: result.data.result.data
                            })
                            setUserToStorage(result.data.result.data);
                            NavigationService.navigate(constants.ScreensName.Settings.name, null);

                        }
                        else {

                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.message,
                                type: "error",
                                position: "top"
                            });
                            dispatch({
                                type: types.UPDATING_SHIPPING_ADDRESS,
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
                            type: types.UPDATING_SHIPPING_ADDRESS,
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
                    type: types.UPDATING_SHIPPING_ADDRESS,
                    isLoading: false
                })
            }
        })
    }
}

export const setNewArtistNotification = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.SET_NEW_ARTIST_NOTIFICATION_LOADING,
                    isLoading: true
                })
                PUT(`${config().accesspoint}${constants.EndPoint.SET_NEW_ARTIST}?isAdded=${payload}`,
                    {}).then(result => {
                        if (result.data.status) {

                            dispatch({
                                type: types.SET_NEW_ARTIST_NOTIFICATION_LOADING,
                                isLoading: false
                            });

                            dispatch({
                                type: types.SET_NEW_ARTIST_NOTIFICATION_SUCCESS,
                                data: result.data.result.data
                            })
                            store.dispatch(getConsumerProfile("notNavigateToConsumerProfile"))

                        }
                        else {

                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.message,
                                type: "error",
                                position: "top"
                            });
                            dispatch({
                                type: types.SET_NEW_ARTIST_NOTIFICATION_FAIL,
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
                            type: types.SET_NEW_ARTIST_NOTIFICATION_FAIL,
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
                    type: types.SET_NEW_ARTIST_NOTIFICATION_LOADING,
                    isLoading: false
                })
            }
        })
    }
}

export const setNewContentNotification = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.SET_NEW_CONTENT_NOTIFICATION_LOADING,
                    isLoading: true
                })
                PUT(`${config().accesspoint}${constants.EndPoint.SET_NEW_CONTENT}?isAdded=${payload}`,
                    {}).then(result => {
                        if (result.data.status) {

                            dispatch({
                                type: types.SET_NEW_CONTENT_NOTIFICATION_LOADING,
                                isLoading: false
                            });

                            dispatch({
                                type: types.SET_NEW_CONTENT_NOTIFICATION_SUCCESS,
                                data: result.data.result.data
                            })

                            store.dispatch(getConsumerProfile("notNavigateToConsumerProfile"))

                        }
                        else {

                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.message,
                                type: "error",
                                position: "top"
                            });
                            dispatch({
                                type: types.SET_NEW_CONTENT_NOTIFICATION_FAIL,
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
                            type: types.SET_NEW_CONTENT_NOTIFICATION_FAIL,
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
                    type: types.SET_NEW_CONTENT_NOTIFICATION_LOADING,
                    isLoading: false
                })
            }
        })
    }
}