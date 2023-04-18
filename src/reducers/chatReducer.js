import types from '../constants/Types';

const initialstate = {
    subcribedArtistList: [],
    subcribedChatArtistList: [],
    searchArtistForChat: [],
    isLoading: false,
    totalCount: 0,

    firebaseMessages: [],
    firebaseMessageCounter: 0,
    navigationStatusFromChat: false,
    firebaseParamData: null

}

const chatReducer = (prevState = initialstate, action) => {
    switch (action.type) {
        case types.SUBSCRIBE_ARTIST_LIST_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.SUBSCRIBE_ARTIST_LIST_SUCCESS:
            return {
                ...prevState,
                subcribedArtistList: action.data,
                totalCount: action.totalCount,
            }
        case types.SUBSCRIBE_ARTIST_LIST_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }


        case types.SUBCRIBED_ARTIST_CHAT_LIST_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.SUBCRIBED_ARTIST_CHAT_LIST_SUCCESS:
            return {
                ...prevState,
                subcribedChatArtistList: action.subcribedChatArtistList,
                // totalCount: action.totalCount,
            }
        case types.SUBCRIBED_ARTIST_CHAT_LIST_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.POST_LAST_CHAT_MESSAGE_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.POST_LAST_CHAT_MESSAGE_SUCCESS:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.POST_LAST_CHAT_MESSAGE_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.SEARCH_ARTIST_FOR_CHAT_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.SEARCH_ARTIST_FOR_CHAT_SUCCESS:
            return {
                ...prevState,
                searchArtistForChat: action.data,
            }
        case types.SEARCH_ARTIST_FOR_CHAT_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.CLEAR_SEARCH_ARTIST_FOR_CHAT:
            return {
                ...prevState,
                searchArtistForChat: []
            }

        case types.SET_FIREBASE_MESSAGE:
            return {
                ...prevState,
                firebaseMessages: action.firebaseMessages,
                firebaseMessageCounter:


                    action.firebaseMessageCounter
            }

        case types.CLEAR_FIREBASE_MESSAGE:
            return {
                ...prevState,
                firebaseMessages: []
            }
        case types.SET_NAVIGATION_FOR_SUBCRIBED_CHAT:
            return {
                ...prevState,
                navigationStatusFromChat: true,
            }
        case types.CLEAN_NAVIGATION_FOR_SUBCRIBED_CHAT:
            return {
                ...prevState,
                navigationStatusFromChat: false
            }
        case types.SET_DATA_FOR_RECENT_CHAT:
            return {
                ...prevState,
                subcribedChatArtistList: action.subcribedChatArtistList,
            }
        case types.SET_SEARCH_PARAMS_OF_FIREBASE:
            return {
                ...prevState,
                firebaseParamData: action.firebaseParamData,
            }

        case types.CLEAR_ALL_DATA:
            return {
                ...initialstate,
            }

        default:
            return prevState
    }
}
export default chatReducer