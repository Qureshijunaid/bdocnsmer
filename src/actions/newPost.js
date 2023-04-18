import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-toast-message';
import { Platform } from 'react-native';
// Local Imports
import types from '../constants/Types'
import EndPoint from '../constants/EndPoint';
import store from '../store';
import config from '../utils/config';
import constants from '../constants';
import { GET, POST, DELETE, PUT } from '../constants/ServiceAxios';
import * as NavigationService from '../navigation/NavigationService';
import { getPostList } from './post';
import {
    setUserAccessTokenToStorage,
    setUserVerification,
    setUserEmailToStorage,
    setUserToStorage,
    getUserAccessTokenFromStorage,
    getUserVerification,
    getUserEmailFromStorage,
    getUserFromStorage,
    wipeStorage
} from '../utils/asyncstorage'
import axios from 'axios';

export const setNewPostData = (payload) => {
    return async (dispatch) => {
        const storeData = store.getState().newPost
        dispatch({
            type: types.SET_NEW_POST_DATA,
            media_type: payload.media_type ? payload.media_type : storeData.media_type,
            media_url: payload.media_url ? payload.media_url : storeData.media_url,
            title: payload.title ? payload.title : storeData.title,
            description: payload.description ? payload.description : storeData.description,
            merchandise: payload.merchandise ? payload.merchandise : storeData.merchandise,
            merchandiseSelectedId: payload.merchandiseSelectedId ? payload.merchandiseSelectedId : storeData.merchandiseSelectedId,
            selectedGenreId: payload.selectedGenreId ? payload.selectedGenreId : storeData.selectedGenreId,
            cover_image: payload.cover_image ? payload.cover_image : storeData.cover_image,
            originalMerchandiseArray: payload.originalMerchandiseArray ? payload.originalMerchandiseArray : storeData.originalMerchandiseArray,
            media_duration: payload.media_duration ? payload.media_duration : storeData.media_duration
        })
    }
}

export const localDataPost = (payload) => {
    return async (dispatch) => {
        dispatch({
            type: types.SET_LOCAL_DATA_POST,
            image: payload.image,
            video: payload.video,
            audio: payload.audio,
            fileName: payload.fileName,
            fileType: payload.fileType,
            audioDuration: payload.audioDuration,
            videoDuration: payload.videoDuration,
            // selectedGenreId: payload.selectedGenreId

        })
    }

}

export const setImageAudioPost = (payload) => {
    return async (dispatch) => {
        dispatch({
            type: types.SET_IMAGE_AUDIO,
            imageAudio: payload.imageAudio
        })
    }
}

export const changeVideoNewPostHandleToggleFunc = (payload) => {
    return async (dispatch) => {
        dispatch({
            type: types.CHANGE_VIDEO_NEW_POST_HANDLE_TOGGLE,
            changeVideoNewPostHandleToggle: payload
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
                    "page": 1,
                    "limit": 10,
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
                    c
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
                    type: types.GET_POST_LIST_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const clearNewPostData = () => {
    return async (dispatch) => {
        dispatch({
            type: types.CLEAR_NEW_POST_DATA,

        })
    }
}

export const clearCoverImage = () => {
    return async (dispatch) => {
        dispatch({
            type: types.CLEAR_NEW_POST_COVER_IMAGE
        })
    }
}

export const createPost = (data) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.NEW_POST_SUCCESS,
                    isLoading: true
                })
                const formData = new FormData()
                let media_format = ""
                let fileName = ""
                if (store.getState().newPost.media_type === "audio") {
                    media_format = "audio/mp3"
                    fileName = "newPostAudio.mp3"
                }
                if (store.getState().newPost.media_type === "video") {
                    media_format = "video/mp4"
                    fileName = "newPostVideo.mp4"
                }
                if (store.getState().newPost.media_type === "image") {
                    media_format = "image/jpg"
                    fileName = "newPostImage.jpeg"
                }
                let media_Uri_Full = {
                    uri: store.getState().newPost.media_url,
                    type: media_format,
                    name: fileName,
                }
                let coverFull = {
                    uri: store.getState().newPost.imageAudio,
                    name: "Cover.jpg",
                    type: "image/jpeg"
                }
                formData.append("media_url", media_Uri_Full)
                formData.append("media_type", store.getState().newPost.media_type)
                formData.append("title", store.getState().newPost.title)
                formData.append("description", store.getState().newPost.description)
                formData.append("merchandise", JSON.stringify(store.getState().newPost.merchandiseSelectedId))
                if (store.getState().newPost.imageAudio) {
                    formData.append("coverImage", coverFull)
                }

                formData.append("genres",
                    store.getState().newPost.selectedGenreId != null ?
                        JSON.stringify([store.getState().newPost.selectedGenreId]) :
                        JSON.stringify([]))
                formData.append("media_duration", JSON.stringify(store.getState().newPost.media_duration))


                POST(`${config().accesspoint}${EndPoint.CREATE_POST}`,
                    formData).then(result => {

                        if (result.data.status) {
                            dispatch({
                                type: types.NEW_POST_SUCCESS,
                                newPostSuccessResponse: result.data.data,
                                isLoading: false
                            })
                            const payloadForGetPostList = {
                                "pageNumber": 1,
                                "limit": 10,
                                "search": ""
                            }
                            store.dispatch(getPostList(payloadForGetPostList))

                            dispatch({
                                type: types.CLEAR_NEW_POST_DATA
                            })
                            NavigationService.navigate(constants.ScreensName.Homepage.name, null)

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
                                type: types.NEW_POST_FAIL,
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
                        c
                        dispatch({
                            type: types.NEW_POST_FAIL,
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
                    type: types.NEW_POST_FAIL,
                    isLoading: false
                })
            }
        })
    }
}
