import types from '../constants/Types';
const initialstate = {
    collections: [],
    postList: [],
    collectionDetail: null,
    selectedIndex: null,
    isLoading: false
}

const collectionReducer = (prevState = initialstate, action) => {
    switch (action.type) {

        case types.GET_COLLECTION_LIST_SUCCESS:
            return {
                ...prevState,
                collections: action.collections,
                isLoading: false
            }
        case types.GET_COLLECTION_DETAILS_SUCCESS:
            return {
                ...prevState,
                postList: action.postList,
                collectionDetail: action.collectionDetail,
                selectedIndex: action.selectedIndex,
                isLoading: false
            }


        default:
            return prevState
    }
}
export default collectionReducer;