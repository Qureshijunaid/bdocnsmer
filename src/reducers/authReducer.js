import types from '../constants/Types';
const initialstate = {
    userStatus: false,
    isRejected: false,
    accessToken: null,
    refreshToken: null,
    isAppLoading: true,
    isLoading: false,
    userRegistered: {},
    userData: [],
    purchasesList: [],
    subscriptionList: [],
    cardList: [],
    purchaseCardList: []
}

const authReducer = (prevState = initialstate, action) => {
    console.log("action", action);
    switch (action.type) {
        case types.AUTH_SWITCH_ROUTE:
            return {
                ...prevState,
                isLoading: action.isLoading,
                isAppLoading: action.isAppLoading,
                accessToken: action.accessToken,
                refreshToken: action.refreshToken
            }
        case types.GET_DATA_FROM_LOCAL:
            return {
                ...prevState,
                isLoading: action.isLoading,
                userRegistered: action.user
            }
        case types.LOGIN_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.LOGIN_SUCCESS:
            return {
                ...prevState,
                isLoading: action.isLoading,
                userRegistered: action.data
            }

        case types.LOGIN_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.LOGOUT_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.LOGOUT_SUCCESS:
            return {
                ...prevState,
                isLoading: action.isLoading,
            }

        case types.CLEAR_ALL_DATA:
            return {
                ...initialstate,
                isLoading: action.isLoading,

            }

        case types.LOGIN_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.PURCHASES_LIST_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.PURCHASES_LIST_SUCCESS:
            return {
                ...prevState,
                isLoading: action.isLoading,
                purchasesList: action.data
            }

        case types.PURCHASES_LIST_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.SUBSCRIPTION_LIST_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.SUBSCRIPTION_LIST_SUCCESS:
            return {
                ...prevState,
                isLoading: action.isLoading,
                subscriptionList: action.data
            }

        case types.SUBSCRIPTION_LIST_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.GET_CARDS_LIST_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.GET_CARDS_LIST_SUCCESS:
            return {
                ...prevState,
                isLoading: action.isLoading,
                cardList: action.data,
                purchaseCardList: action.modifiedPurchaseCardList
            }

        case types.GET_CARDS_LIST_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.SEND_FCM_TOKEN_LOADING:
            return {
                ...prevState,
            }
        case types.SEND_FCM_TOKEN_SUCCESS:
            return {
                ...prevState,
            }
        case types.SEND_FCM_TOKEN_FAIL:
            return {
                ...prevState,
            }

        case types.REQUEST_DELETE_MY_ACCOUNT_LOADING:
            return {
                ...prevState,
                isLoading: true
            }

        case types.REQUEST_DELETE_MY_ACCOUNT_SUCCESS:
            return {
                ...prevState,
                isLoading: false
            }

        case types.REQUEST_DELETE_MY_ACCOUNT_FAIL:
            return {
                ...prevState,
                isLoading: false
            }

        case types.REQUEST_CHANGE_CREDENTIAL_LOADING:
            return {
                ...prevState,
                isLoading: true
            }

        case types.REQUEST_CHANGE_CREDENTIAL_SUCCESS:
            return {
                ...prevState,
                isLoading: false
            }

        case types.REQUEST_CHANGE_CREDENTIAL_FAIL:
            return {
                ...prevState,
                isLoading: false
            }

        default:
            return prevState
    }
}
export default authReducer