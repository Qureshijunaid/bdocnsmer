import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-toast-message';
// Local Imports
import types from '../constants/Types'
import EndPoint from '../constants/EndPoint';
import store from '../store';
import config from '../utils/config';
import constants from '../constants';
import { GET, POST, DELETE, PUT, POST_MULTIPART } from '../constants/ServiceAxios';

import * as NavigationService from '../navigation/NavigationService';
import { fetchApi } from '../constants/SeviceFetch';
import axios from 'axios';

import { getUserAccessTokenFromStorage } from "../utils/asyncstorage"

export const setNewMerchData = (payload) => {
    let prevMerchImageArray = store.getState().merch.newMerchImageArray
    return async (dispatch) => {
        dispatch({
            type: types.SET_NEW_MERCH_DATA,
            newMerchImageArray: payload.newMerchImageArray ? prevMerchImageArray.concat(payload.newMerchImageArray) : store.getState().merch.newMerchImageArray,
            merchName: payload.merchName ? payload.merchName : store.getState().merch.merchName,
            merchDescription: payload.merchDescription ? payload.merchDescription : store.getState().merch.merchDescription,
            merchType: payload.merchType ? payload.merchType : store.getState().merch.merchType,
            merchTypeSelected: payload.merchTypeSelected ? payload.merchTypeSelected : store.getState().merch.merchTypeSelected,
            price: payload.price ? payload.price : store.getState().merch.price,
            quantity: payload.quantity ? payload.quantity : store.getState().merch.quantity,
            variationData: payload.variationData ? payload.variationData : store.getState().merch.variationData,
            currency: payload.currency ? payload.currency : store.getState().merch.currency,
        })
    }
}

export const setNewMerchImage = (payload) => {

    return async (dispatch) => {
        dispatch({
            type: types.SET_NEW_MERCH_IMAGE,
            merchImageObj: payload
        })
    }
}

export const changePhotoOfVisibleIndex = (payload) => {
    let prevMerchImageArray = store.getState().merch.newMerchImageArray
    prevMerchImageArray[payload.selectedIndex] = payload.changeImage
    // prevMerchImageArray[payload.selectedIndex].type = payload.type
    // prevMerchImageArray[payload.selectedIndex].name = payload.name
    return async (dispatch) => {
        dispatch({
            type: types.CHANGE_PHOTO_OF_VISIBLE_INDEX,
            newMerchImageArray: prevMerchImageArray
        })
    }

}

export const clearNewMerchData = () => {
    return async (dispatch) => {
        dispatch({
            type: types.CLEAR_NEW_MERCH_DATA,

        })
    }
}

export const createMerch = () => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.POST_NEW_MERCH_LOADING,
                    isLoading: true
                })
                let imageArray = []
                store.getState().merch.newMerchImageArray.map((item, index) => {
                    imageArray = [...imageArray, { uri: item, type: "image/jpg", name: `merch${index}` }]
                })
                let merch_detail_Ob = {
                    "merchName": store.getState().merch.merchName,
                    "description": store.getState().merch.merchDescription,
                    "merchType": store.getState().merch.merchTypeSelected
                }
                let price_detail_Ob = {
                    "price": store.getState().merch.price,
                    "currency": "GBP",
                    "variations":

                        store.getState().merch.merchTypeSelected === "Bulk Product" ?
                            store.getState().merch.variationData : []
                }
                const formData = new FormData();
                store.getState().merch.newMerchImageArray.map(item => {
                    let keyImage = {
                        uri: item,
                        name: "Cover.jpg",
                        type: "image/jpeg"
                    }
                    formData.append("images", keyImage)
                })

                formData.append("merch_details", JSON.stringify(merch_detail_Ob))
                formData.append("price_details", JSON.stringify(price_detail_Ob))


                POST(`${config().accesspoint}${EndPoint.ADD_MERCH}`,
                    formData).then(result => {

                        if (result.data.status) {

                            dispatch({
                                type: types.POST_NEW_MERCH_LOADING,
                                isLoading: false
                            })
                            dispatch({
                                type: types.POST_NEW_MERCH_SUCCESS,
                                newMerchResponse: result.data.data,
                            })


                            dispatch({
                                type: types.CLEAR_NEW_MERCH_DATA,

                            })
                            store.dispatch(getMerchList())
                            NavigationService.navigate(constants.ScreensName.Merch.name, null)

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
                                type: types.POST_NEW_MERCH_FAIL,
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
                            type: types.POST_NEW_MERCH_FAIL,
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
                    type: types.POST_NEW_MERCH_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const getMerchList = (payload) => {
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
                    type: types.GET_MERCHLIST_LOADING,
                    isLoading: true
                })

                GET(`${config().accesspoint}${constants.EndPoint.ARTIST_MERCHES}${'/'}${artistId}`
                    , params).then(result => {

                        if (result.data.status) {
                            // let updatedMerchs = result.data.result.data;
                            // updatedMerchs.map(item => {
                            //     { item.isSelected = false; return item; }
                            // })
                            let posts = []
                            let totalCount = 0

                            if (payload.pageNumber === 1) {
                                posts = result.data.result.data[0].merches;
                                totalCount = result.data.result.data[0].totalCount

                            } else {
                                const data = store.getState();
                                let prev_Posts = data.merch.merchList;
                                posts = prev_Posts.concat(result.data.result.data[0].merches);
                                totalCount = result.data.result.data[0].totalCount
                            }
                            dispatch({
                                type: types.GET_MERCHLIST_SUCCESS,
                                isLoading: false,
                                merchList: posts,
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
                                type: types.GET_MERCHLIST_FAIL,
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
                            type: types.GET_MERCHLIST_FAIL,
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
                    type: types.GET_MERCHLIST_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const getMerchDetails = (merchId, successCallBack) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.GET_MERCHLIST_LOADING,
                    isLoading: true
                })
                GET(`${config().accesspoint}${constants.EndPoint.GET_MERCH_DETAIL}${'/'}${merchId}`
                ).then(result => {
                    if (result.data.status) {
                        successCallBack(result.data.result.data[0])
                        dispatch({
                            type: types.GET_MERCHLIST_SUCCESS,
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
                            type: types.GET_MERCHLIST_FAIL,
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
                        type: types.GET_MERCHLIST_FAIL,
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
                    type: types.GET_MERCHLIST_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const changeMerchStatus = (data) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.CHANGE_MERCH_STATUS_LOADING,
                    isLoading: true
                })
                let payload = {
                    "merchId": data.merchId,
                    "status": data.status
                }
                POST(`${config().accesspoint}${EndPoint.CHANGE_MERCH_STATUS}`,
                    payload).then(result => {

                        if (result.data.status) {

                            dispatch({
                                type: types.CHANGE_MERCH_STATUS_SUCCESS,
                                isLoading: false
                            })
                            store.dispatch(getMerchList())
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
                                type: types.CHANGE_MERCH_STATUS_FAIL,
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
                            type: types.CHANGE_MERCH_STATUS_FAIL,
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
                    type: types.CHANGE_MERCH_STATUS_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const SelectedMerchToBeEdit = (payload) => {
    return async (dispatch) => {
        dispatch({
            type: types.MERCH_TO_BE_EDIT,
            data: payload
        })
        NavigationService.navigate(constants.ScreensName.NewMerch.name)
    }
}

export const setMerchEditStatus = () => {
    return async (dispatch) => {
        dispatch({
            type: types.SET_EDIT_MERCH_STATUS,
            status: false
        })
        NavigationService.navigate(constants.ScreensName.NewMerch.name)
    }
}

export const setEditMerchData = (payload) => {
    return async (dispatch) => {
        const data = store.getState().merch
        dispatch({
            type: types.SET_EDIT_MERCH_DATA,
            editNewMerchImages: payload.editNewMerchImages ? payload.editNewMerchImages : data.editNewMerchImages,
            editOldUrl: payload.editOldUrl ? payload.editOldUrl : data.editOldUrl,
            editReplaceMerchImages: payload.editReplaceMerchImages ? payload.editReplaceMerchImages : data.editReplaceMerchImages,
            merchName: payload.merchName ? payload.merchName : data.merchName,
            merchDescription: payload.merchDescription ? payload.merchDescription : data.merchDescription,
            merchType: payload.merchType ? payload.merchType : data.merchType,
            merchTypeSelected: payload.merchTypeSelected ? payload.merchTypeSelected : data.merchTypeSelected,
            price: payload.price ? payload.price : data.price,
            quantity: payload.quantity ? payload.quantity : data.quantity,
            variationData: payload.variationData ? payload.variationData : data.variationData,
            currency: payload.currency ? payload.currency : data.currency,
        })
    }
}

export const editMerch = () => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.EDIT_MERCH_LOADING,
                    isLoading: true
                })
                const data = store.getState().merch

                let merch_detail_Ob = {
                    "merchName": store.getState().merch.merchName,
                    "description": store.getState().merch.merchDescription,
                    "merchType": store.getState().merch.merchTypeSelected
                }
                let price_detail_Ob = {
                    "price": store.getState().merch.price,
                    "currency": "GBP",
                    "variations":

                        store.getState().merch.merchTypeSelected === "Bulk Product" ?
                            store.getState().merch.variationData : []
                }
                const formData = new FormData();
                if (data.editNewMerchImages.length > 0) {
                    data.editNewMerchImages.map(item => {
                        let keyImage = {
                            uri: item,
                            name: "Cover.jpg",
                            type: "image/jpeg"
                        }
                        formData.append("images", keyImage)
                    })
                }
                if (data.editOldUrl.length > 0) {
                    formData.append("image_urls", JSON.stringify(data.editOldUrl))
                }
                if (data.editReplaceMerchImages.length > 0) {
                    data.editReplaceMerchImages.map(item => {
                        let keyImage = {
                            uri: item,
                            name: "Cover.jpg",
                            type: "image/jpeg"
                        }
                        formData.append("replace_images", keyImage)
                    })
                }
                formData.append("merch_details", JSON.stringify(merch_detail_Ob))
                formData.append("price_details", JSON.stringify(price_detail_Ob))


                PUT(`${config().accesspoint}${EndPoint.EDIT_MERCH}/${data.merchToBeEdited.id}`,
                    formData).then(result => {

                        if (result.data.status) {

                            dispatch({
                                type: types.EDIT_MERCH_SUCCESS,
                                newMerchResponse: result.data.data,
                                isLoading: false
                            })

                            dispatch({
                                type: types.CLEAR_NEW_MERCH_DATA,
                            })
                            store.dispatch(getMerchList())
                            NavigationService.navigate(constants.ScreensName.Merch.name, null)

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
                                type: types.EDIT_MERCH_FAIL,
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
                            type: types.EDIT_MERCH_FAIL,
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
                    type: types.EDIT_MERCH_FAIL,
                    isLoading: false
                })
            }
        })
    }
}