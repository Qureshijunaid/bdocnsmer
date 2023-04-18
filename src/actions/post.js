import { Alert } from 'react-native'
import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-toast-message';
// Local Imports
import store from '../store';
import types from '../constants/Types'
import constants from '../constants';
import { GET, POST, DELETE, PUT } from '../constants/ServiceAxios';
import * as NavigationService from '../navigation/NavigationService';
import {
    setUserAccessTokenToStorage,
    setUserVerification,
    setUserToStorage,
    getUserAccessTokenFromStorage,
    getUserVerification,
    getUserFromStorage,
    wipeStorage
} from '../utils/asyncstorage'
import config from '../utils/config';
import {
    getAllImages, getAllAudio,
    getAllVideo, getArtistDetail, setArtistID
} from '../actions/profile';
import { getMyFeed } from './home';
import { handlePaymentLoader } from './home';
import { getCollectionList, getCollectionDetails } from "./collection";

export const getPostList = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.GET_POST_LIST_LOADING,
                    isLoading: true
                })
                // payload.pageNumber
                const params = {
                    "page": "",
                    "limit": "",
                    "search": ""
                }
                GET(`${config().accesspoint}${constants.EndPoint.GET_POST}`,
                    params).then(result => {

                        if (result.data.status) {

                            let posts = []
                            let totalCount = 0

                            if (payload.pageNumber === 1) {
                                posts = result.data.result.data[0].posts;
                                totalCount = result.data.result.data[0].totalCount

                            } else {
                                const data = store.getState();
                                let prev_Posts = data.post.postList;
                                posts = prev_Posts.concat(result.data.result.data[0].posts);
                                totalCount = result.data.result.data[0].totalCount
                            }
                            dispatch({
                                type: types.GET_POST_LIST_SUCCESS,
                                isLoading: false,
                                post: posts,
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
                                type: types.GET_POST_LIST_FAIL,
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
                            type: types.GET_POST_LIST_FAIL,
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

export const deletePost = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.DELETE_POST_LOADING,
                    isLoading: true
                })
                const body = {
                    "post_id": payload.post_id
                }
                DELETE(`${config().accesspoint}${constants.EndPoint.DELETE_POST}`,
                    body).then(result => {
                        if (result.data.status) {
                            dispatch({
                                type: types.DELETE_POST_SUCCESS,
                                isLoading: false,
                            })
                            const payloadForGetPostList = {
                                "pageNumber": 1,
                                "limit": 10,
                                "search": ""
                            }
                            store.dispatch(getPostList(payloadForGetPostList))
                            // store.dispatch(viewAllMedia())
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
                                type: types.DELETE_POST_FAIL,
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
                            type: types.DELETE_POST_FAIL,
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
                    type: types.DELETE_POST_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const deleteParticularComment = (payload) => {

    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.DELETE_COMMENT_LOADING,
                    isLoading: true
                })
                const body = {
                    "comment_id": payload.comment_id,
                    "post_id": payload.post_id
                }
                DELETE(`${config().accesspoint}${constants.EndPoint.DELETE_COMMENT}`,
                    body).then(result => {
                        if (result.data.status) {
                            dispatch({
                                type: types.DELETE_COMMENT_SUCCESS,
                                isLoading: false,
                            })
                            dispatch({
                                type: types.GET_COMMENT_LIST_SUCCESS,
                                isLoading: false,
                                comment: result.data.result.data.reverse()
                            })
                            // const payloadForGetCommentList = {
                            //     "post_id": payload.post_id
                            // }
                            // store.dispatch(getCommentList(payloadForGetCommentList))
                            store.dispatch(getMyFeed({ "pageNumber": 1 }))
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
                                type: types.DELETE_COMMENT_FAIL,
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
                            type: types.DELETE_COMMENT_FAIL,
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
                    type: types.DELETE_COMMENT_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const getCommentList = (payload) => {

    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.GET_COMMENT_LIST_LOADING,
                    isLoading: true
                })
                const params = {
                    "post_id": payload.post_id,
                }
                GET(`${config().accesspoint}${constants.EndPoint.COMMENT_LIST}`,
                    params).then(result => {
                        if (result.data.status) {

                            dispatch({
                                type: types.GET_COMMENT_LIST_SUCCESS,
                                isLoading: false,
                                comment: result.data.result.data
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
                                type: types.GET_COMMENT_LIST_FAIL,
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
                            type: types.GET_COMMENT_LIST_FAIL,
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
                    type: types.GET_COMMENT_LIST_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const getReplyList = (payload) => {

    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.GET_REPLY_LIST_LOADING,
                    isLoading: true
                })
                const params = {
                    "comment_id": payload.comment_id,
                }
                GET(`${config().accesspoint}${constants.EndPoint.REPLY_LIST}`,
                    params).then(result => {

                        if (result.data.status) {

                            // let posts = []
                            // let totalCount = 0

                            // if (payload.pageNumber === 1) {
                            //     posts = result.data.result.data[0].posts;
                            //     totalCount = result.data.result.data[0].totalCount

                            // } else {
                            //     const data = store.getState();
                            //     let prev_Posts = data.post.postList;
                            //     posts = prev_Posts.concat(result.data.result.data[0].posts);
                            //     totalCount = result.data.result.data[0].totalCount
                            // }
                            dispatch({
                                type: types.GET_REPLY_LIST_SUCCESS,
                                isLoading: false,
                                reply: result.data.result.data
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
                                type: types.GET_REPLY_LIST_FAIL,
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
                            type: types.GET_REPLY_LIST_FAIL,
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
                    type: types.GET_REPLY_LIST_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const ReplyOnComment = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.REPLY_LOADING,
                    isLoading: true
                })
                const storeData = store.getState().auth
                const body = {
                    "post_id": payload.post_id,
                    "parent_id": payload.parent_id,
                    "user_id": storeData.userRegistered._id,
                    "artist_id": "",
                    "comment": payload.comment,
                    "commentBy": "user"
                }
                POST(`${config().accesspoint}${constants.EndPoint.REPLY}`,
                    body).then(result => {
                        if (result.data.status) {
                            dispatch({
                                type: types.REPLY_SUCCESS,
                                isLoading: false,
                            })
                            dispatch({
                                type: types.GET_REPLY_LIST_SUCCESS,
                                isLoading: false,
                                reply: result.data.result.data.reverse()
                            })
                            // const payloadTogetReply = {
                            //     "comment_id": payload.parent_id
                            // }
                            // store.dispatch(getReplyList(payloadTogetReply))
                            store.dispatch(getMyFeed({ "pageNumber": 1 }))
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
                                type: types.REPLY_FAIL,
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
                            type: types.REPLY_FAIL,
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
                    type: types.REPLY_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const CommentOnPost = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.POST_COMMENT_LOADING,
                    isLoading: true
                })
                const storeData = store.getState().auth
                const body = {
                    "post_id": payload.post_id,
                    "user_id": storeData.userRegistered._id,
                    "comment": payload.comment,
                }
                POST(`${config().accesspoint}${constants.EndPoint.POST_COMMENT}`,
                    body).then(result => {
                        if (result.data.status) {
                            dispatch({
                                type: types.POST_COMMENT_SUCCESS,
                                isLoading: false,
                            })
                            dispatch({
                                type: types.GET_COMMENT_LIST_SUCCESS,
                                isLoading: false,
                                comment: result.data.result.data.reverse()
                            })
                            // const payloadTogetComment = {
                            //     "post_id": payload.post_id
                            // }
                            //store.dispatch(getCommentList(payloadTogetComment))
                            store.dispatch(getMyFeed({ "pageNumber": 1 }))
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
                                type: types.POST_COMMENT_FAIL,
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
                            type: types.POST_COMMENT_FAIL,
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
                    type: types.POST_COMMENT_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const likeOnPost = (payload) => {
    return async (dispatch) => {
        store.dispatch(handlePaymentLoader(true))
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.POST_LIKE_LOADING,
                    isLoading: false
                })
                const storeData = store.getState().auth
                const body = {
                    "post_id": payload.post_id,
                    "user_id": storeData.userRegistered._id,
                    "status": payload.status,
                }
                POST(`${config().accesspoint}${constants.EndPoint.POST_LIKE}`,
                    body).then(result => {
                        if (result.data.status) {
                            dispatch({
                                type: types.POST_LIKE_SUCCESS,
                                isLoading: false,
                            })
                            let feedData = store.getState().home.myFeed
                            let feedCount = store.getState().home.myFeedTotalCount

                            feedData.map(item => {
                                if (item._id === result.data.result.data.postId) {
                                    item.isLiked = true;
                                    let likesArray = item.likes ? item.likes : []
                                    likesArray.push({
                                        user_id: result.data.result.data.userId,
                                        _id: result.data.result.data.likeId
                                    })
                                    item.likes = likesArray
                                }
                            })
                            dispatch({
                                type: types.GET_MYFEED_SUCCESS,
                                isLoading: false,
                                data: feedData,
                                feedTotalCount: feedCount
                            })
                            store.dispatch(handlePaymentLoader(false))
                            const payloadForViewAllMedia = {
                                "pageNumber": 1
                            }
                            if (payload.type === "artistDetails") {
                                store.dispatch(getArtistDetail(""))
                            }
                            if (payload.type === "viewAllImage") {
                                store.dispatch(getAllImages(payloadForViewAllMedia))
                            }
                            if (payload.type === "viewAllAudio") {
                                store.dispatch(getAllAudio(payloadForViewAllMedia))
                            }
                            if (payload.type === "viewAllVideo") {
                                store.dispatch(getAllVideo(payloadForViewAllMedia))
                            }
                            if (payload.type === "collection") {
                                store.dispatch(getCollectionList((res) => {
                                    const selectedIndex = store.getState().collection.selectedIndex;
                                    store.dispatch(getCollectionDetails(res[selectedIndex], selectedIndex))
                                }))
                            }
                            // if (payload.type === "feed") {
                            //     store.dispatch(getMyFeed({ "pageNumber": 1 }))
                            // }
                        }
                        else {
                            store.dispatch(handlePaymentLoader(false))
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.data.message,
                                type: "error",
                                position: "top"
                            });

                            dispatch({
                                type: types.POST_LIKE_FAIL,
                                isLoading: false
                            })
                        }
                    }).catch((err) => {
                        store.dispatch(handlePaymentLoader(false))
                        Toast.show({
                            text1: constants.AppConstant.Bando,
                            text2: JSON.stringify(err),
                            type: "error",
                            position: "top"
                        });

                        dispatch({
                            type: types.POST_LIKE_FAIL,
                            isLoading: false
                        })
                    })

            } else {
                store.dispatch(handlePaymentLoader(false))
                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: constants.AppConstant.network_error_message,
                    type: "error",
                    position: "top"
                });

                dispatch({
                    type: types.POST_LIKE_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const unlikeOnPost = (payload) => {

    return async (dispatch) => {
        store.dispatch(handlePaymentLoader(true))
        NetInfo.fetch().then(state => {
            if (state.isConnected) {

                dispatch({
                    type: types.POST_UNLIKE_LOADING,
                    isLoading: false
                })
                const storeData = store.getState().auth
                const body = {
                    "userId": storeData.userRegistered._id,
                    "likeId": payload.likeId,
                    "postId": payload.postId
                }
                POST(`${config().accesspoint}${constants.EndPoint.POST_UNLIKE}`,
                    body).then(result => {
                        if (result.data.status) {
                            dispatch({
                                type: types.POST_UNLIKE_SUCCESS,
                                isLoading: false,
                            })
                            const payloadForViewAllMedia = {
                                "pageNumber": 1
                            }
                            let feedData = store.getState().home.myFeed
                            let feedCount = store.getState().home.myFeedTotalCount
                            let likedIndex = feedData.findIndex(item =>
                                item._id === payload.postId
                            )
                            let postObj = feedData[likedIndex]
                            let indexOfLike = postObj.likes.findIndex(item => {
                                item._id === payload.likeId
                            })
                            postObj.likes.splice(indexOfLike, 1)
                            postObj = {
                                ...postObj,
                                isLiked: false,
                            }
                            feedData[likedIndex] = postObj

                            dispatch({
                                type: types.GET_MYFEED_SUCCESS,
                                isLoading: false,
                                data: feedData,
                                feedTotalCount: feedCount
                            })
                            store.dispatch(handlePaymentLoader(false))

                            if (payload.type === "artistDetails") {
                                store.dispatch(getArtistDetail())
                            }
                            if (payload.type === "viewAllImage") {
                                store.dispatch(getAllImages(payloadForViewAllMedia))
                            }
                            if (payload.type === "viewAllAudio") {
                                store.dispatch(getAllAudio(payloadForViewAllMedia))
                            }
                            if (payload.type === "viewAllVideo") {
                                store.dispatch(getAllVideo(payloadForViewAllMedia))
                            }
                            if (payload.type === "collection") {
                                store.dispatch(getCollectionList((res) => {
                                    const selectedIndex = store.getState().collection.selectedIndex;
                                    store.dispatch(getCollectionDetails(res[selectedIndex], selectedIndex))
                                }))
                            }
                            // if (payload.type === "feed") {
                            //     store.dispatch(getMyFeed({ "pageNumber": 1 }))
                            // }
                        }
                        else {
                            store.dispatch(handlePaymentLoader(false))
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.data.message,
                                type: "error",
                                position: "top"
                            });

                            dispatch({
                                type: types.POST_UNLIKE_FAIL,
                                isLoading: false
                            })
                        }
                    }).catch((err) => {
                        store.dispatch(handlePaymentLoader(false))
                        Toast.show({
                            text1: constants.AppConstant.Bando,
                            text2: JSON.stringify(err),
                            type: "error",
                            position: "top"
                        });

                        dispatch({
                            type: types.POST_UNLIKE_FAIL,
                            isLoading: false
                        })
                    })

            } else {
                store.dispatch(handlePaymentLoader(false))
                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: constants.AppConstant.network_error_message,
                    type: "error",
                    position: "top"
                });

                dispatch({
                    type: types.POST_UNLIKE_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const setSelectedPost = (payload) => {
    return async (dispatch) => {
        dispatch({
            type: types.SET_SELECTED_POST,
            post_id: payload.post_id,
            post_data: payload.post_data
        })
    }
}

export const sharePost = (payload, SuccessCallback, ErrorCallback) => {

    return async (dispatch) => {
        NetInfo.fetch().then(async (state) => {
            if (state.isConnected) {
                dispatch({
                    type: types.SHARE_POST_LOADING,
                    isLoading: true
                })
                let body = {
                    "post_id": payload.post_id
                }
                POST(`${config().accesspoint}${constants.EndPoint.SHARE_POST}`,
                    body)
                    .then((result) => {
                        if (result.data.status) {
                            SuccessCallback(result.data.result.data.url)
                        } else {
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.data.message,
                                type: "error",
                                position: "top"
                            });
                            dispatch({
                                type: types.SHARE_POST_FAIL,
                                isLoading: false
                            })
                        }
                    })
                    .catch((err) => {
                        Toast.show({
                            text1: constants.AppConstant.Bando,
                            text2: JSON.stringify(err),
                            type: "error",
                            position: "top"
                        });

                        dispatch({
                            type: types.SHARE_POST_FAIL,
                            isLoading: false
                        })
                        ErrorCallback(err)
                    })
            } else {
                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: constants.AppConstant.network_error_message,
                    type: "error",
                    position: "top"
                });

                dispatch({
                    type: types.SHARE_POST_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const shareProfileDetail = (payload, SuccessCallback, ErrorCallback) => {

    return async (dispatch) => {
        NetInfo.fetch().then(async (state) => {
            if (state.isConnected) {
                dispatch({
                    type: types.SHARE_POST_LOADING,
                    isLoading: true
                })
                let body = {
                    "artist_id": payload.artist_id
                }
                POST(`${config().accesspoint}${constants.EndPoint.SHARE_PROFILE_DETAILS}`,
                    body)
                    .then((result) => {
                        if (result.data.status) {
                            SuccessCallback(result.data.result.data.url)
                        } else {
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.data.message,
                                type: "error",
                                position: "top"
                            });
                            dispatch({
                                type: types.SHARE_POST_FAIL,
                                isLoading: false
                            })
                        }
                    })
                    .catch((err) => {
                        Toast.show({
                            text1: constants.AppConstant.Bando,
                            text2: JSON.stringify(err),
                            type: "error",
                            position: "top"
                        });

                        dispatch({
                            type: types.SHARE_POST_FAIL,
                            isLoading: false
                        })
                        ErrorCallback(err)
                    })
            } else {
                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: constants.AppConstant.network_error_message,
                    type: "error",
                    position: "top"
                });

                dispatch({
                    type: types.SHARE_POST_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const getPostDetail = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                let body = {
                    "post_id": payload.post_id
                }


                POST(`${config().accesspoint}${constants.EndPoint.POST_DETAILS}`,
                    body).then(result => {

                        if (result.data.status) {
                            let sharePostData = result.data.result.data;
                            store.dispatch(setArtistID(sharePostData.post.artistId));
                            let updatedPostData = {
                                ...sharePostData.post,
                                likes: JSON.parse(sharePostData.post.likes),
                                genres: JSON.parse(sharePostData.post.genres),
                                comments: JSON.parse(sharePostData.post.comments),
                                merchandise: JSON.parse(sharePostData.post.merchandise)
                            }
                            if (sharePostData.isSubscribed) {
                                if (sharePostData.post.notificationType === 2) {
                                    setTimeout(() => {
                                        NavigationService.navigate(constants.ScreensName.AudioList.name, { notificationData: updatedPostData })
                                    }, 1200)
                                    return 1
                                }
                                if (sharePostData.post.notificationType === 3) {
                                    setTimeout(() => {
                                        NavigationService.navigate(constants.ScreensName.VideoList.name, { notificationData: updatedPostData })
                                    }, 1200)
                                    return 1
                                }
                                if (sharePostData.post.notificationType === 4) {
                                    setTimeout(() => {
                                        NavigationService.navigate(constants.ScreensName.ImageList.name, { notificationData: updatedPostData })
                                    }, 1200)
                                    return 1
                                }


                            } else {
                                store.dispatch(getArtistDetail("homeArtistDetail"))
                            }


                        }
                        else {
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: result.data.result.message,
                                type: "error",
                                position: "top"
                            });

                        }
                    }).catch((err) => {

                        // Toast.show({
                        //     text1: constants.AppConstant.Bando,
                        //     text2: JSON.stringify(err),
                        //     type: "error",
                        //     position: "top"
                        // });

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
}

export const trackPost = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.TRACK_POST_LOADING,
                    isLoading: true
                })


                PUT(`${config().accesspoint}${constants.EndPoint.TRACK_POST}/${payload._id}/views/${payload.type}`,
                    {}).then(result => {

                        if (result.data.status) {
                            dispatch({
                                type: types.TRACK_POST_SUCCESS,
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
                                type: types.TRACK_POST_FAIL,
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
                            type: types.TRACK_POST_FAIL,
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
                    type: types.TRACK_POST_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const clearCommentList = () => {
    return async (dispatch) => {
        dispatch({
            type: types.CLEAR_COMMENT_LIST
        })
    }
}

export const clearReplyList = () => {
    return async (dispatch) => {
        dispatch({
            type: types.CLEAR_REPLY_LIST
        })
    }
}