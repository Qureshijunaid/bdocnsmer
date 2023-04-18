import { Alert } from 'react-native'
import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-toast-message';
import stripe from 'tipsi-stripe';
// Local Imports
import store from '../store';
import types from '../constants/Types'
import EndPoint from '../constants/EndPoint';
import constants from '../constants'
import { GET, POST, DELETE, PUT } from '../constants/ServiceAxios';
import * as NavigationService from '../navigation/NavigationService';
import config from '../utils/config';
import { getArtistDetail } from './profile';
import { getPaymentCardsList } from './auth';
import { getCollectionList, getCollectionDetails } from "./collection";

export const setHomeTab = (value) => {
    return async (dispatch) => {
        const payload = {
            pageNumber: 1
        }
        let homeData = store.getState().home
        if (value === "trending") {
            if (homeData.trendingFeed.length === 0) {
                store.dispatch(getTrendingFeed(payload))
            }
        }
        if (value === "feed") {
            if (homeData.myFeed.length === 0) {
                store.dispatch(getMyFeed(payload))
            }
        }
        if (value === "recommended") {
            if (homeData.recommendedFeed.length === 0) {
                store.dispatch(getRecommendedFeed(payload))
            }

        }
        dispatch({
            type: types.SET_HOME_TAB,
            trendingTab: value === "trending" ? true : false,
            recommendedTab: value === "recommended" ? true : false,
            feedTab: value === "feed" ? true : false
        })
    }
}

export const getRecommendedFeed = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.GET_RECOMMENDED_FEED_LOADING,
                    isLoading: true
                })
                const params = {
                    "page": payload.pageNumber,
                    "limit": 20,
                    "search": ""
                }
                GET(`${config().accesspoint}${constants.EndPoint.RECOMMENDEDFEED}`,
                    params).then(result => {

                        let posts = []
                        posts = result.data.result.data.artists
                        let totalCount = 0
                        totalCount = result.data.result.data.totalCount
                        if (payload.pageNumber === 1) {
                            posts = result.data.result.data.artists;
                            totalCount = result.data.result.data.totalCount

                        } else {
                            const data = store.getState();
                            let prev_Posts = data.home.recommendedFeed;
                            posts = prev_Posts.concat(result.data.result.data.artists);
                            totalCount = result.data.result.data.totalCount
                        }


                        if (result.data.status) {
                            dispatch({
                                type: types.GET_RECOMMENDED_FEED_SUCCESS,
                                isLoading: false,
                                data: posts,
                                totalCount: totalCount
                            })
                        }
                        else {

                            dispatch({
                                type: types.GET_RECOMMENDED_FEED_FAIL,
                                isLoading: false
                            })
                        }
                    }).catch((error) => {
                        dispatch({
                            type: types.GET_RECOMMENDED_FEED_FAIL,
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
                    type: types.GET_RECOMMENDED_FEED_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const getTrendingFeed = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.GET_TRENDING_LOADING,
                    isLoading: true
                })
                const params = {
                    "page": payload.pageNumber,
                    "limit": 20,
                    "search": ""
                }
                GET(`${config().accesspoint}${constants.EndPoint.TRENDING}`,
                    params).then(result => {

                        if (result.data.status) {
                            let posts = []
                            posts = result.data.result.data[0].posts
                            let totalCount = 0
                            totalCount = result.data.result.data[0].totalCount

                            if (payload.pageNumber === 1) {
                                posts = result.data.result.data[0].posts;
                                totalCount = result.data.result.data[0].totalCount

                            } else {
                                const data = store.getState();
                                let prev_Posts = data.home.trendingFeed;
                                posts = prev_Posts.concat(result.data.result.data[0].posts);
                                totalCount = result.data.result.data[0].totalCount
                            }


                            dispatch({
                                type: types.GET_TRENDING_SUCCESS,
                                isLoading: false,
                                data: posts,
                                totalCount: totalCount
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
                                type: types.GET_TRENDING_FAIL,
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
                            type: types.GET_TRENDING_FAIL,
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
                    type: types.GET_TRENDING_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const handleNotificationData = (payload) => {
    return async (dispatch) => {
        dispatch({
            type: types.HANDLE_NOTIFICATION_DATA,
            notificationData: payload

        })
    }
}
export const getMyFeed = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.GET_MYFEED_LOADING,
                    isLoading: false
                })

                const params = {
                    "page": payload.pageNumber,
                    "limit": 20,
                    "search": ""
                }

                GET(`${config().accesspoint}${constants.EndPoint.MYFEED}`,
                    params).then(result => {

                        if (result.data.status) {
                            store.dispatch(handlePaymentLoader(false))
                            let myfeeds = result.data.result.data;
                            let posts = [];
                            posts = myfeeds.posts;
                            let totalCount = 0;
                            totalCount = myfeeds.totalCount;

                            if (payload.pageNumber === 1) {
                                posts = myfeeds.posts;
                                totalCount = myfeeds.totalCount

                            } else {
                                const data = store.getState();
                                let prev_Posts = data.home.myFeed;
                                posts = prev_Posts.concat(myfeeds.posts);
                                totalCount = myfeeds.totalCount
                            }

                            dispatch({
                                type: types.GET_MYFEED_SUCCESS,
                                isLoading: false,
                                data: posts,
                                feedTotalCount: totalCount
                            })
                        }
                        else {
                            dispatch({
                                type: types.GET_MYFEED_FAIL,
                                isLoading: false
                            })
                            store.dispatch(handlePaymentLoader(false))
                        }
                    }).catch((error) => {

                        store.dispatch(handlePaymentLoader(false))
                        dispatch({
                            type: types.GET_MYFEED_FAIL,
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
                    type: types.GET_MYFEED_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const setEmptySearchResult = () => {
    return async (dispatch) => {
        //const storeData = store.getState().registration;
        dispatch({
            type: types.GET_SEARCH_ARTIST_SUCCESS,
            isLoading: false,
            data: [],
        })
    }
}

export const searchArtist = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.GET_SEARCH_ARTIST_BY_NAME_LOADING,
                    isSearchingByName: true
                })
                const params = {
                    "page": "",
                    "limit": 10,
                    "search": ""
                }
                let search_url = constants.EndPoint.SEARCH_ARTIST + "/" + payload.query;
                if (payload.type == 'BrowseAll') {
                    dispatch({
                        type: types.GET_SEARCH_ARTIST_SUCCESS,
                        isLoading: false,
                        data: [],
                    })
                    dispatch({
                        type: types.GET_SEARCH_ARTIST_LOADING,
                        isLoading: true
                    })
                    search_url = constants.EndPoint.GENRE_ARTISTS + "/" + payload.query;
                }

                GET(`${config().accesspoint}${search_url}`,
                    params).then(result => {

                        if (result.data.status) {
                            dispatch({
                                type: types.GET_SEARCH_ARTIST_SUCCESS,
                                isLoading: false,
                                data: result.data.result.data[0].artists,
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
                                type: types.GET_SEARCH_ARTIST_BY_NAME_LOADING,
                                isSearchingByName: true
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
                            type: types.GET_SEARCH_ARTIST_BY_NAME_LOADING,
                            isSearchingByName: true
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
                    type: types.GET_SEARCH_ARTIST_BY_NAME_LOADING,
                    isSearchingByName: true
                })
            }
        })
    }
}

export const searchArtistByGenre = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                // dispatch({
                //     type: types.GET_RECOMMENDED_FEED_LOADING,
                //     isLoading: true
                // })
                const params = {
                    "page": "",
                    "limit": 10,
                    "search": ""
                }

                let search_url = constants.EndPoint.SEARCH_ARTIST + "/" + payload.query;
                if (payload.type == 'BrowseAll') {
                    dispatch({
                        type: types.GET_SEARCH_ARTIST_SUCCESS,
                        isLoading: false,
                        data: [],
                    })
                    dispatch({
                        type: types.GET_SEARCH_ARTIST_LOADING,
                        isLoading: true
                    })
                    search_url = constants.EndPoint.GENRE_ARTISTS + "/" + payload.query;
                }

                GET(`${config().accesspoint}${search_url}`,
                    params).then(result => {

                        if (result.data.status) {
                            dispatch({
                                type: types.GET_SEARCH_ARTIST_SUCCESS,
                                isLoading: false,
                                data: result.data.result.data[0].artists,
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
                                type: types.GET_SEARCH_ARTIST_FAIL,
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
                            type: types.GET_SEARCH_ARTIST_FAIL,
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
                    type: types.GET_SEARCH_ARTIST_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const getGenre = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                // dispatch({
                //     type: types.GET_GENRE_SUCCESS,
                //     isLoading: true
                // })
                const params = {
                    "page": "",
                    "limit": 10,
                    "search": ""
                }
                GET(`${constants.EndPoint.GET_GENRE}`, params
                ).then(result => {

                    if (result.data.status) {



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

export const subcribeArtistIntent = (data) => {
    let artistId = store.getState().profile.idOfArtist
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.SUBSCRIBE_LOADING,
                    isLoading: true
                })
                let body = {
                    "artistId": artistId,
                    "source": data.id,
                    "duration": JSON.stringify(data.duration),
                    "price": Math.trunc(data.price * 100),
                    "currency": "GBP",
                    "cardId": data.cardId
                }


                POST(`${config().accesspoint}${EndPoint.SUBSCRIBE_INTENT}`,
                    body).then(result => {

                        if (result.data.status) {

                            store.dispatch(handlePaymentLoader(false))
                            if (result.data.result.data.status === "succeeded") {
                                const payloadForSubscribe = {
                                    ...data,
                                    "subscriptionId": result.data.result.data.subscription_id,
                                }
                                store.dispatch(subcribeArtist(payloadForSubscribe))
                            } else if (result.data.result.data.status === "requires_action") {
                                stripe.confirmPaymentIntent({
                                    clientSecret: result.data.result.data.client_secret,
                                    paymentMethodId: result.data.result.data.payment_method,
                                    cvc: data.cvv,
                                    type: "card",
                                    setupFutureUsage: 'OffSession'
                                }).then(function (response) {
                                    if (response.status === 'succeeded') {
                                        const payloadForSubscribe = {
                                            ...data,
                                            "subscriptionId": result.data.result.data.subscription_id,
                                        }
                                        store.dispatch(subcribeArtist(payloadForSubscribe))
                                        store.dispatch(handlePaymentLoader(false))
                                    }
                                    else {
                                        dispatch({
                                            type: types.SUBSCRIBE_LOADING,
                                            isLoading: false
                                        })
                                        Toast.show({
                                            text1: constants.AppConstant.Bando,
                                            text2: "Payment failed!!!",
                                            type: "error",
                                            position: "top"
                                        });
                                    }
                                }).catch((err) => {
                                    dispatch({
                                        type: types.SUBSCRIBE_LOADING,
                                        isLoading: false
                                    })
                                    Toast.show({
                                        text1: constants.AppConstant.Bando,
                                        text2: "Payment failed!!!",
                                        type: "error",
                                        position: "top"
                                    });

                                })
                            } else {
                                Toast.show({
                                    text1: constants.AppConstant.Bando,
                                    text2: "Payment failed!!!",
                                    type: "error",
                                    position: "top"
                                });
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
                            store.dispatch(handlePaymentLoader(false))

                            dispatch({
                                type: types.SUBCRIBE_FAIL,
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
                        store.dispatch(handlePaymentLoader(false))

                        dispatch({
                            type: types.SUBSCRIBE_LOADING,
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
                    type: types.SUBSCRIBE_LOADING,
                    isLoading: false
                })
            }
        })
    }
}

export const subcribeArtist = (data) => {
    let aritstId = store.getState().profile.idOfArtist

    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.SUBSCRIBE_LOADING,
                    isLoading: true
                })
                let body = {
                    "artistId": aritstId,
                    "source": data.id,
                    "duration": JSON.stringify(data.duration),
                    "price": Math.trunc(data.price * 100),
                    "currency": "GBP",
                    "cardId": data.cardId,
                    "subscriptionId": data.subscriptionId,
                }


                POST(`${config().accesspoint}${EndPoint.SUBSCRIBE}`,
                    body).then(result => {

                        if (result.data.status) {

                            dispatch({
                                type: types.SUBSCRIBE_LOADING,
                                isLoading: false
                            })
                            dispatch({
                                type: types.SUBSCRIBE_SUCCESS,
                                artistSubcribe: result.data.result.data
                            })
                            store.dispatch(paymentSuccess(false, true, false))
                            //store.dispatch(getArtistDetail())
                            store.dispatch(getPaymentCardsList())
                            store.dispatch(getMyFeed({
                                "pageNumber": 1
                            }));

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
                                type: types.SUBCRIBE_FAIL,
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
                            type: types.SUBSCRIBE_LOADING,
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
                    type: types.SUBSCRIBE_LOADING,
                    isLoading: false
                })
            }
        })
    }
}

const handleLoadingWhenGetCardToken = () => {
    return async (dispatch) => {
        //const storeData = store.getState().registration;
        dispatch({
            type: types.BUY_MERCH_LOADING,
            isLoading: true,
        })
    }
}

export const handlePaymentLoader = (payload) => {
    return async (dispatch) => {
        dispatch({
            type: types.HANDLE_PAYMENT_LOADER,
            multipleClickDisabled: payload,
        })
    }
}

export const buyMerch = (payload) => {

    let aritstId = store.getState().profile.idOfArtist
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.BUY_MERCH_LOADING,
                    isLoading: true
                })
                let body = {
                    "artistId": aritstId,
                    "source": payload.tokenId,
                    "merchId": payload.merchId,
                    "price": payload.price * 100,
                    "currency": payload.currency,
                    "variation": payload.variation,
                    "cardId": payload.cardId
                }

                POST(`${config().accesspoint}${EndPoint.BUY_MERCH}`,
                    body).then(result => {
                        console.log("result.data.result.data", result.data.result.data);
                        console.log("result.data.result.data", JSON.stringify(result.data.result.data));
                        if (result.data.status) {

                            dispatch({
                                type: types.BUY_MERCH_SUCCESS,
                                buyMerch: result.data.result.data,
                            })
                            store.dispatch(handlePaymentLoader(false))
                            if (result.data.result.data.status === "succeeded") {

                                store.dispatch(buyMerchFinal(payload))

                            } else if (result.data.result.data.status === "requires_action") {
                                stripe.confirmPaymentIntent({
                                    clientSecret: result.data.result.data.client_secret,
                                    paymentMethodId: result.data.result.data.payment_method,
                                    cvc: payload.cvv,
                                    type: "card",
                                    setupFutureUsage: 'OffSession'
                                }).then(function (response) {
                                    if (response.status === 'succeeded') {
                                        store.dispatch(buyMerchFinal(payload))
                                        store.dispatch(handlePaymentLoader(false))
                                    }
                                    else {
                                        dispatch({
                                            type: types.BUY_MERCH_LOADING,
                                            isLoading: false
                                        })
                                        store.dispatch(handlePaymentLoader(false))
                                        Toast.show({
                                            text1: constants.AppConstant.Bando,
                                            text2: "Payment failed!!!",
                                            type: "error",
                                            position: "top"
                                        });
                                    }
                                }).catch((err) => {
                                    dispatch({
                                        type: types.BUY_MERCH_LOADING,
                                        isLoading: false
                                    })
                                    store.dispatch(handlePaymentLoader(false))
                                    Toast.show({
                                        text1: constants.AppConstant.Bando,
                                        text2: "Payment failed!!!",
                                        type: "error",
                                        position: "top"
                                    });

                                })
                            } else {
                                Toast.show({
                                    text1: constants.AppConstant.Bando,
                                    text2: "Payment failed!!!",
                                    type: "error",
                                    position: "top"
                                });
                                store.dispatch(handlePaymentLoader(false))
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
                            store.dispatch(handlePaymentLoader(false))

                            dispatch({
                                type: types.BUY_MERCH_FAIL,
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
                        store.dispatch(handlePaymentLoader(false))

                        dispatch({
                            type: types.BUY_MERCH_LOADING,
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
                    type: types.BUY_MERCH_LOADING,
                    isLoading: false
                })
            }
        })
    }
}

export const buyMerchFinal = (payload) => {
    let aritstId = store.getState().profile.idOfArtist
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.BUY_MERCH_LOADING,
                    isLoading: true
                })
                let body = {
                    "artistId": aritstId,
                    "source": payload.tokenId,
                    "merchId": payload.merchId,
                    "price": payload.price * 100,
                    "currency": payload.currency,
                    "variation": payload.variation,
                    "cardId": payload.cardId
                }

                POST(`${config().accesspoint}${EndPoint.BUY_MERCH_FINAL}`,
                    body).then(result => {

                        if (result.data.status) {
                            dispatch({
                                type: types.BUY_MERCH_LOADING,
                                isLoading: false
                            })
                            dispatch({
                                type: types.BUY_MERCH_SUCCESS,
                                buyMerch: result.data.result.data,
                            })
                            store.dispatch(paymentSuccess(false, true))
                            store.dispatch(getPaymentCardsList())
                            store.dispatch(getArtistDetail())

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
                                type: types.BUY_MERCH_FAIL,
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
                            type: types.BUY_MERCH_LOADING,
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
                    type: types.BUY_MERCH_LOADING,
                    isLoading: false
                })
            }
        })
    }
}

export const paymentSuccess = (cardModal, thankModal, isPaymentSuccess) => {

    return async (dispatch) => {
        if (isPaymentSuccess) {
            NavigationService.goBack()
        }
        dispatch({
            type: types.IS_PAYMENT_SUCCESS,
            cardModal: cardModal,
            thankModal: thankModal

        })

    }
}

export const clearNotificationDataWhenToggle = () => {
    return async (dispatch) => {
        dispatch({
            type: types.CLEAR_NOTIFICATION_DATA_WHEN_TOGGLE,
            apiNotificationData: []

        })
    }
}

export const getNotification = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                // dispatch({
                //     type: types.GET_NOTIFICATION_DATA_LOADING,
                //     isLoading: true
                // })
                const params = {
                    "page": payload.pageNumber,
                    "limit": 15,
                    "isRead": payload.isRead


                }
                GET(`${config().accesspoint}${constants.EndPoint.NOTIFICATION}`, params
                ).then(result => {
                    if (result.data.status) {

                        let posts = []
                        posts = result.data.result.data.data
                        let totalCount = 0
                        totalCount = result.data.result.data.totalCount

                        if (payload.pageNumber === 1) {
                            posts = result.data.result.data.data;
                            totalCount = result.data.result.data.totalCount

                        } else {
                            const data = store.getState();
                            let prev_Posts = data.home.apiNotificationData;
                            posts = prev_Posts.concat(result.data.result.data.data);
                            totalCount = result.data.result.data.totalCount
                        }



                        dispatch({
                            type: types.GET_NOTIFICATION_DATA_SUCCESS,
                            apiNotificationData: posts,
                            totalCount: totalCount,
                            count: result.data.result.data.unReadCount
                            // totalCount: result.data.result.data[0].totalCount
                        })
                        dispatch({
                            type: types.GET_NOTIFICATION_DATA_LOADING,
                            isLoading: false
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
                            type: types.GET_NOTIFICATION_DATA_FAIL,
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
                        type: types.GET_NOTIFICATION_DATA_FAIL,
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
                    type: types.GET_NOTIFICATION_DATA_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const viewNotification = (notificationID, childObjectId = "", notificationType) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.VIEW_NOTIFICATION_LOADING,
                    isLoading: true
                })
                const notificationNumber = notificationType ? notificationType : ""
                PUT(`${config().accesspoint}${constants.EndPoint.VIEW_NOTIFICATION}/${notificationID}?childObjectId=${childObjectId}&notificationType=${notificationNumber}`, {}
                ).then(result => {
                    if (result.data.status) {

                        dispatch({
                            type: types.VIEW_NOTIFICATION_SUCCESS,
                            viewNotificationData: result.data,
                            // totalCount: result.data.result.data[0].totalCount
                        })

                        dispatch({
                            type: types.VIEW_NOTIFICATION_LOADING,
                            isLoading: false
                        })
                        //  store.dispatch(getNotification())
                    }
                    else {
                        //result.data.result.data.msg
                        // Toast.show({
                        //     text1: constants.AppConstant.Bando,
                        //     text2: result.data.result.data.message,
                        //     type: "error",
                        //     position: "top"
                        // });

                        dispatch({
                            type: types.VIEW_NOTIFICATION_FAIL,
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
                        type: types.VIEW_NOTIFICATION_FAIL,
                        isLoading: false
                    })
                })

            } else {
                // Toast.show({
                //     text1: constants.AppConstant.Bando,
                //     text2: constants.AppConstant.network_error_message,
                //     type: "error",
                //     position: "top"
                // });

                dispatch({
                    type: types.VIEW_NOTIFICATION_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const handleIsReported = () => {
    return async (dispatch) => {
        dispatch({
            type: types.REPORT_POST_SUCCESS,
            isLoading: false,
            isReported: false
        })
    }
}

export const reportPost = (payload) => {
    return async (dispatch) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                dispatch({
                    type: types.REPORT_POST_LOADING,
                    isLoading: true
                })
                const body = {
                    "post_id": payload.post_id
                }
                POST(`${config().accesspoint}${constants.EndPoint.REPORT_POST}`,
                    body).then(result => {
                        if (result.data.status) {
                            setTimeout(() => {
                                dispatch({
                                    type: types.REPORT_POST_SUCCESS,
                                    isLoading: false,
                                    isReported: true
                                })

                                let payload = {
                                    "pageNumber": 1
                                }
                                store.dispatch(getMyFeed(payload));
                            }, 500);
                            if (!!payload?.collection) {
                                store.dispatch(getCollectionList((res) => {
                                    const selectedIndex = store.getState().collection.selectedIndex;
                                    store.dispatch(getCollectionDetails(res[selectedIndex], selectedIndex))
                                }))
                            }
                            // store.dispatch(getPostList(payloadForGetPostList))
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
                                type: types.REPORT_POST_FAIL,
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
                            type: types.REPORT_POST_FAIL,
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
                    type: types.REPORT_POST_FAIL,
                    isLoading: false
                })
            }
        })
    }
}

export const clearHomeData = () => {
    return async (dispatch) => {
        dispatch({
            type: types.CLEAR_HOME_DATA
        })
    }
}