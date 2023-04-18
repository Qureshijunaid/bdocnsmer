import types from '../constants/Types';
const initialstate = {
    media_type: {},
    media_url: null,
    title: "",
    description: "",
    merchandise: [],
    merchandiseSelectedId: [],
    originalMerchandiseArray: [],
    newPostSuccessResponse: null,
    newPostFail: null,
    isLoading: false,
    // cover_image: "",

    genreResponse: [],
    genres: [],
    totalCount: null,
    selectedGenreId: null,

    image: null,
    video: null,
    audio: null,
    media_duration: 0,
    // fileName: null,
    // fileType: null,
    audioDuration: null,
    videoDuration: null,
    cover_image: "https://techalchemybando.s3.ap-south-1.amazonaws.com/storage/images/1619790258647_Vector%2013.png",
    imageAudio: "",
    fileName: 'cover',
    fileType: 'image/png',
    changeVideoNewPostHandleToggle: false
    // title: null,
    // description: null,



}

const newPostReducer = (prevState = initialstate, action) => {
    switch (action.type) {
        case types.SET_NEW_POST_DATA:
            return {
                ...prevState,
                media_type: action.media_type,
                media_url: action.media_url,
                title: action.title,
                description: action.description,
                merchandise: action.merchandise,
                merchandiseSelectedId: action.merchandiseSelectedId,
                selectedGenreId: action.selectedGenreId,
                cover_image: action.cover_image,
                originalMerchandiseArray: action.originalMerchandiseArray,
                media_duration: action.media_duration,
            }
        case types.SET_LOCAL_DATA_POST:
            return {
                ...prevState,
                image: action.image,
                video: action.video,
                audio: action.audio,
                fileName: action.fileName,
                fileType: action.fileType,
                audioDuration: action.audioDuration,
                videoDuration: action.videoDuration,
                // selectedGenreId: action.selectedGenreId,
                // title: action.title,
                // description: action.description,
            }
        case types.GET_GENRE_SUCCESS:
            return {
                ...prevState,
                genreResponse: action.genreResponse,
                genres: action.genres,
                totalCount: action.totalCount,
                isLoading: action.isLoading,
            }
        case types.GET_GENRE_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading,
            }
        case types.NEW_POST_SUCCESS:
            return {
                ...prevState,
                newPostSuccessResponse: action.newPostSuccessResponse,
                isLoading: action.isLoading,
            }
        case types.CLEAR_NEW_POST_COVER_IMAGE:
            return {
                ...prevState,
                imageAudio: "https://homepages.cae.wisc.edu/~ece533/images/airplane.png",
            }

        case types.NEW_POST_FAIL:
            return {
                ...prevState,
                newPostFail: action.newPostFail,
                isLoading: action.isLoading,
            }
        case types.CLEAR_NEW_POST_DATA:
            return {
                ...prevState,
                media_type: null,
                media_url: null,
                title: "",
                description: "",
                merchandise: [],
                merchandiseSelectedId: [],
                originalMerchandiseArray: [],
                newPostSuccessResponse: null,
                newPostFail: null,
                isLoading: false,
                // cover_image: "",

                genreResponse: [],
                genres: [],
                totalCount: null,
                selectedGenreId: null,

                image: null,
                video: null,
                audio: null,
                // fileName: null,
                // fileType: null,
                audioDuration: null,
                videoDuration: null,
                cover_image: "https://homepages.cae.wisc.edu/~ece533/images/airplane.png",
                imageAudio: "https://homepages.cae.wisc.edu/~ece533/images/airplane.png",
                fileName: 'cover',
                fileType: 'image/png',
                // title: null,
                // description: null,
                //...initialstate
            }
        case types.SET_IMAGE_AUDIO:
            return {
                ...prevState,
                imageAudio: action.imageAudio,
            }

        case types.CHANGE_VIDEO_NEW_POST_HANDLE_TOGGLE:
            return {
                ...prevState,
                changeVideoNewPostHandleToggle: action.changeVideoNewPostHandleToggle
            }

        case types.CLEAR_ALL_DATA:
            return {
                ...initialstate,
            }
        default:
            return prevState
    }
}
export default newPostReducer;