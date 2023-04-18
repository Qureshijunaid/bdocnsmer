import types from '../constants/Types';
const initialstate = {
    isLoading: false,
    postList: [],
    commentList: [],
    replyList: [],
    postCount: 0,
    isPostDeleted: false,
    selectedPostId: null,
    selectedPostData: null,
    postShareUrl: "",
    postDetailData: null,
}

const postReducer = (prevState = initialstate, action) => {
    switch (action.type) {
        case types.GET_POST_LIST_LOADING:
            return {
                ...prevState,
                isLoading: true
            }

        case types.GET_POST_LIST_SUCCESS:
            return {
                ...prevState,
                isLoading: false,
                postList: action.post,
                postCount: action.totalCount
            }
        case types.GET_POST_LIST_FAIL:
            return {
                ...prevState,
                isLoading: false
            }

        case types.GET_COMMENT_LIST_LOADING:
            return {
                ...prevState,
                isLoading: true
            }

        case types.GET_COMMENT_LIST_SUCCESS:
            return {
                ...prevState,
                isLoading: false,
                commentList: action.comment
            }
        case types.GET_COMMENT_LIST_FAIL:
            return {
                ...prevState,
                isLoading: false
            }

        case types.GET_REPLY_LIST_LOADING:
            return {
                ...prevState,
                isLoading: true
            }

        case types.GET_REPLY_LIST_SUCCESS:
            return {
                ...prevState,
                isLoading: false,
                replyList: action.reply
            }
        case types.GET_REPLY_LIST_FAIL:
            return {
                ...prevState,
                isLoading: false
            }

        case types.DELETE_POST_LOADING:
            return {
                ...prevState,
                isLoading: true
            }

        case types.DELETE_POST_SUCCESS:
            return {
                ...prevState,
                isLoading: false,
                isPostDeleted: true
            }
        case types.DELETE_POST_FAIL:
            return {
                ...prevState,
                isLoading: false
            }
        case types.SET_SELECTED_POST:
            return {
                ...prevState,
                selectedPostId: action.post_id,
                selectedPostData: action.post_data
            }



        case types.SHARE_POST_LOADING:
            return {
                ...prevState,
                isLoading: true
            }

        case types.SHARE_POST_SUCCESS:
            return {
                ...prevState,
                isLoading: false,
                postShareUrl: action.postShareUrl
            }
        case types.SHARE_POST_FAIL:
            return {
                ...prevState,
                isLoading: false
            }


        case types.TRACK_POST_LOADING:
            return {
                ...prevState,
                isLoading: true
            }

        case types.TRACK_POST_SUCCESS:
            return {
                ...prevState,
                isLoading: false,
            }
        case types.TRACK_POST_FAIL:
            return {
                ...prevState,
                isLoading: false
            }



        case types.GET_POST_DETAILS_LOADING:
            return {
                ...prevState,
                isLoading: true
            }

        case types.GET_POST_DETAILS_SUCCESS:
            return {
                ...prevState,
                postDetailData: action.postDetailData
            }
        case types.GET_POST_DETAILS_FAIL:
            return {
                ...prevState,
                isLoading: false
            }

        case types.CLEAR_COMMENT_LIST:
            return {
                ...prevState,
                commentList: []
            }

        case types.CLEAR_REPLY_LIST:
            return {
                ...prevState,
                replyList: []
            }

        case types.CLEAR_ALL_DATA:
            return {
                ...initialstate,
            }
        default:
            return prevState
    }
}
export default postReducer;