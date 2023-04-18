import types from '../constants/Types';
const initialstate = {
    isLoading: false,
    newMerchImageArray: [],
    merchType: [{ "id": 0, type: "Bulk Product", "isSelected": false },
    { "id": 1, type: "Unique Product", "isSelected": false }],
    merchDescription: "",
    merchName: "",
    price: "",
    merchTypeSelected: null,
    quantity: "",
    variationName: "",
    variationData: [],
    currency: "",
    newMerchResponse: null,
    merchList: [],
    deletedMerch: false,
    merchToBeEdited: null,
    isEditingMerch: false,
    editNewMerchImages: [],
    editOldUrl: [],
    editReplaceMerchImages: [],
    totalCount: 0


    // merchType: null,
}

const merchReducer = (prevState = initialstate, action) => {
    switch (action.type) {
        case types.SET_NEW_MERCH_DATA:
            return {
                ...prevState,
                newMerchImageArray: action.newMerchImageArray,
                merchName: action.merchName,
                merchDescription: action.merchDescription,
                merchType: action.merchType,
                price: action.price,
                merchTypeSelected: action.merchTypeSelected,
                quantity: action.quantity,
                variationName: action.variationName,
                variationData: action.variationData,
                currency: action.currency,
            }

        case types.CHANGE_PHOTO_OF_VISIBLE_INDEX:
            return {
                ...prevState,
                newMerchImageArray: action.newMerchImageArray
            }
        case types.CLEAR_NEW_MERCH_DATA:
            return {
                ...initialstate
            }
        case types.POST_NEW_MERCH_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.POST_NEW_MERCH_SUCCESS:
            return {
                ...prevState,
                newMerchResponse: action.newMerchResponse
            }
        case types.POST_NEW_MERCH_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.GET_MERCHLIST_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.GET_MERCHLIST_SUCCESS:
            return {
                ...prevState,
                isLoading: action.isLoading,
                merchList: action.merchList,
                totalCount: action.totalCount,
            }
        case types.GET_MERCHLIST_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.CHANGE_MERCH_STATUS_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.CHANGE_MERCH_STATUS_SUCCESS:
            return {
                ...prevState,
                deletedMerch: true
            }
        case types.CHANGE_MERCH_STATUS_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.MERCH_TO_BE_EDIT:
            return {
                ...prevState,
                merchToBeEdited: action.data,
                newMerchImageArray: action.data.images,
                isEditingMerch: true
            }
        case types.SET_EDIT_MERCH_DATA:
            return {
                ...prevState,
                editNewMerchImages: action.editNewMerchImages,
                editOldUrl: action.editOldUrl,
                editReplaceMerchImages: action.editReplaceMerchImages,
                merchName: action.merchName,
                merchDescription: action.merchDescription,
                merchType: action.merchType,
                price: action.price,
                merchTypeSelected: action.merchTypeSelected,
                quantity: action.quantity,
                variationName: action.variationName,
                variationData: action.variationData,
                currency: action.currency,
            }
        case types.CLEAR_ALL_DATA:
            return {
                ...initialstate,
            }

        default:
            return prevState
    }
}
export default merchReducer;