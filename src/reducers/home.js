import types from '../constants/Types';
const initialstate = {
    recommendedFeed: [],
    recomendedCount: 0,
    trendingFeed: [],
    trendingCount: 0,
    myFeed: [],
    myFeedTotalCount: 0,
    trendingTab: true,
    recommendedTab: false,
    feedTab: false,


    //search artist
    searchArtistLoading: false,
    isSearchingByName: false,
    searchArtistList: [],
    artistSubcribe: null,
    buyMerch: null,
    cardModal: true,
    thankModal: false,
    notificationData: null,
    apiNotificationData: [],
    notificationCount: 0,
    notificationPaginationCount: 0,
    viewNotificationData: null,
    isReported: false,
    paymentMethodId: null,
    client_secret: null,
    multipleClickDisabled: false
}

const homeReducer = (prevState = initialstate, action) => {
    switch (action.type) {

        case types.SET_HOME_TAB:
            return {
                ...prevState,
                trendingTab: action.trendingTab,
                recommendedTab: action.recommendedTab,
                feedTab: action.feedTab
            }

        case types.GET_RECOMMENDED_FEED_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.GET_RECOMMENDED_FEED_SUCCESS:
            return {
                ...prevState,
                isLoading: action.isLoading,
                recommendedFeed: action.data,
                recomendedCount: action.totalCount
            }

        case types.GET_RECOMMENDED_FEED_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.GET_TRENDING_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.GET_TRENDING_SUCCESS:
            return {
                ...prevState,
                isLoading: action.isLoading,
                trendingFeed: action.data,
                trendingCount: action.totalCount
            }

        case types.GET_TRENDING_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.GET_MYFEED_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.GET_MYFEED_SUCCESS:
            return {
                ...prevState,
                isLoading: action.isLoading,
                myFeed: action.data,
                myFeedTotalCount: action.feedTotalCount
            }
        case types.GET_MYFEED_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.GET_ARTIST_DETAILS_LOADING:
            return {
                ...prevState,
                isSearchArtistList: action.isLoading
            }
        case types.GET_SEARCH_ARTIST_SUCCESS:
            return {
                ...prevState,
                isSearchArtistList: action.isLoading,
                isSearchingByName: action.isLoading,
                searchArtistList: action.data
            }

        case types.GET_SEARCH_ARTIST_BY_NAME_LOADING:
            return {
                ...prevState,
                isSearchingByName: action.isSearchingByName
            }

        case types.GET_SEARCH_ARTIST_FAIL:
            return {
                ...prevState,
                isSearchArtistList: action.isLoading
            }

        case types.GET_SEARCH_ARTIST_LOADING:
            return {
                ...prevState,
                isSearchArtistList: action.isLoading
            }

        case types.SUBSCRIBE_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.SUBSCRIBE_SUCCESS:
            return {
                ...prevState,
                artistSubcribe: action.artistSubcribe

            }

        case types.SUBCRIBE_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        // buy Merch

        case types.BUY_MERCH_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.BUY_MERCH_SUCCESS:
            return {
                ...prevState,
                buyMerch: action.buyMerch,
                client_secret: action.client_secret,
                paymentMethodId: action.paymentMethodId

            }

        case types.BUY_MERCH_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }


        case types.IS_PAYMENT_SUCCESS:
            return {
                ...prevState,
                cardModal: action.cardModal,
                thankModal: action.thankModal,
            }

        case types.HANDLE_NOTIFICATION_DATA:
            return {
                ...prevState,
                notificationData: action.notificationData
            }
        case types.GET_NOTIFICATION_DATA_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.GET_NOTIFICATION_DATA_SUCCESS:
            return {
                ...prevState,
                apiNotificationData: action.apiNotificationData,
                notificationCount: action.count,
                notificationPaginationCount: action.totalCount
            }
        case types.GET_NOTIFICATION_DATA_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.CLEAR_NOTIFICATION_DATA_WHEN_TOGGLE:
            return {
                ...prevState,
                apiNotificationData: action.apiNotificationData
            }



        case types.VIEW_NOTIFICATION_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.VIEW_NOTIFICATION_SUCCESS:
            return {
                ...prevState,
                viewNotificationData: action.viewNotificationData
            }
        case types.VIEW_NOTIFICATION_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }


        case types.REPORT_POST_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.REPORT_POST_SUCCESS:
            return {
                ...prevState,
                isLoading: action.isLoading,
                isReported: action.isReported
            }

        case types.REPORT_POST_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.HANDLE_PAYMENT_LOADER:
            return {
                ...prevState,
                multipleClickDisabled: action.multipleClickDisabled
            }

        case types.CLEAR_ALL_DATA:
            return {
                ...initialstate,
            }

        default:
            return prevState
    }
}
export default homeReducer;