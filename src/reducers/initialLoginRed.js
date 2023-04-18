import types from '../constants/Types';
const initialstate = {
    email: null,
    password: null,
    coverphoto: '',
    coverPhotoName: "profile",
    coverPhotoType: "image/png",
    phoneCode: null,
    countryName: "GB",
    profilePhoto: '',
    profilePhotoName: "profile",
    profilePhotoType: "image/png",
    phoneCode: null,
    phoneNumber: null,
    bio: null,
    priceBands: [],
    genre: null,
    isLoading: false,


}

const initialLoginReducer = (prevState = initialstate, action) => {
    switch (action.type) {
        case types.SET_INITIAL_LOGIN_DATA:
            return {
                ...prevState,
                email: action.email,
                password: action.password,
                coverphoto: action.coverphoto,
                profilePhoto: action.profilePhoto,
                phoneCode: action.phoneCode,
                phoneNumber: action.phoneNumber,
                countryName: action.countryName,
                bio: action.bio,
                priceBands: action.priceBands,
                genre: action.genre,
                coverPhotoName: action.coverPhotoName,
                coverPhotoType: action.coverPhotoType,
                profilePhotoName: action.profilePhotoName,
                profilePhotoType: action.profilePhotoType,
            }
        case types.INTIAL_LOGIN_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.INTIAL_LOGIN_SUCCESS:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.INTIAL_LOGIN_FAIL:
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
export default initialLoginReducer