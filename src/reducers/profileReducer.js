import types from '../constants/Types';
const initialstate = {
    artistDetail: [],
    isLoadingArtistDetail: false,
    profileDataIntoHome: null,
    editProfileResponse: null,
    profileImage: null,
    coverImage: null,
    viewAllMediaSuccess: null,
    viewAllMediaFail: null,
    mediaList: [],
    mediaCount: 0,
    totalCount: 0,
    //consumer
    isLoading: false,
    imageList: [],
    imageCount: 0,
    audioList: [],
    audioCount: 0,
    videoList: [],
    videoCount: 0,
    idOfArtist: null,
    newArtistNotification: false,
    newContentNotification: false

}

const profileReducer = (prevState = initialstate, action) => {
    switch (action.type) {

        case types.GET_ARTIST_DETAILS_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading,
                isLoadingArtistDetail: action.isLoading
            }
        case types.GET_ARTIST_DETATILS_SUCCESS:
            return {
                ...prevState,
                artistDetail: action.artistDetail
            }
        case types.GET_ARTIST_DETATILS_FAIL:
            return {
                ...prevState,
            }
        case types.GET_PROFILE_DATA_INTO_HOMESCREEN:
            return {
                ...prevState,
                profileDataIntoHome: action.profileDataIntoHome
            }
        case types.EDIT_ARTIST_DETAIL_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.EDIT_ARTIST_DETAIL_SUCCESS:
            return {
                ...prevState,
                editProfileResponse: action.editProfileResponse,
            }
        case types.EDIT_ARTIST_DETAIL_FAIL:
            return {
                ...prevState,
            }
        case types.SAVE_EDIT_PROFILE_LOCAL_DATA:
            return {
                ...prevState,
                profileImage: action.profileImage,
                coverImage: action.coverImage
            }
        case types.VIEW_ALL_MEDIA_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.VIEW_ALL_MEDIA_SUCCESS:
            return {
                ...prevState,
                mediaList: action.mediaList,
                mediaCount: action.mediaCount,
            }
        case types.VIEW_ALL_MEDIA_FAIL:
            return {
                ...prevState,
                viewAllMediaFail: action.viewAllMediaFail
            }


        //consumer
        case types.GET_ARTIST_IMAGES_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.GET_ARTIST_IMAGES_SUCCESS:
            return {
                ...prevState,
                imageList: action.imageList,
                imageCount: action.totalCount,
            }
        case types.GET_ARTIST_IMAGES_FAIL:
            return {
                ...prevState,
                // viewAllMediaFail: action.viewAllMediaFail
            }
        case types.GET_ARTIST_AUDIO_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.GET_ARTIST_AUDIO_SUCCESS:
            return {
                ...prevState,
                audioList: action.audioList,
                totalCount: action.totalCount,
            }
        case types.GET_ARTIST_AUDIO_FAIL:
            return {
                ...prevState,
            }

        case types.GET_ARTIST_VIDEO_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.GET_ARTIST_VIDEO_SUCCESS:
            return {
                ...prevState,
                videoList: action.videoList,
                totalCount: action.totalCount,
            }
        case types.GET_ARTIST_VIDEO_FAIL:
            return {
                ...prevState,
            }

        case types.SET_ARTIST_ID:
            return {
                ...prevState,
                idOfArtist: action.idOfArtist
            }
        case types.UPDATING_SHIPPING_ADDRESS:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.UPDATING_SHIPPING_ADDRESS_SUCCESS:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.EDIT_CONSUMER_PROFILE_DETAIL_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }



        case types.SET_NEW_ARTIST_NOTIFICATION_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.SET_NEW_ARTIST_NOTIFICATION_SUCCESS:
            return {
                ...prevState,
                newArtistNotification: action.data
            }
        case types.SET_NEW_ARTIST_NOTIFICATION_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }




        case types.SET_NEW_CONTENT_NOTIFICATION_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.SET_NEW_CONTENT_NOTIFICATION_SUCCESS:
            return {
                ...prevState,
                newContentNotification: action.data
            }
        case types.SET_NEW_CONTENT_NOTIFICATION_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.CLEAR_ALL_DATA:
            return {
                ...initialstate,
            }
        default:
            return prevState
    }
}
export default profileReducer;