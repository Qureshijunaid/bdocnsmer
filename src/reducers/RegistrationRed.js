import types from '../constants/Types';
const initialstate = {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    artistName: '',
    gender: null,
    dob: "",
    aboutYou: "",
    bandoUsage: [],
    socialMedia: [],
    isLoading: false,
    forgetPasswordResponse: null,
    forgetPasswordFailResponse: null,
    emailForget: null,
    phoneCode: null,
    phoneNumber: null,
    countryName: "GB",
    shipping_address: [],

    genreResponse: [],
    genres: [],
    totalCount: null,

    profilePhoto: '',
    profilePhotoName: "profile",
    profilePhotoType: "image/png",

    artistAddedNotify: true,
    contentAddedNotify: false,

    //login by social if all empty then use email login.
    gmail: '',
    facebook: '',
    apple: '',
    isAppleLogin: false,
    appleFirebaseUid: ""
}

const RegistrationReducer = (prevState = initialstate, action) => {
    switch (action.type) {
        case types.SET_REGISTRATION_DATA:
            return {
                ...prevState,
                firstName: action.firstName,
                lastName: action.lastName,
                email: action.email,
                artistName: action.artistName,
                dob: action.dob,
                aboutYou: action.aboutYou,
                bandoUsage: action.bandoUsage,
                socialMedia: action.socialMedia,
                password: action.password,
                gender: action.gender,
                phoneCode: action.phoneCode,
                phoneNumber: action.phoneNumber,
                countryName: action.countryName,
                shipping_address: action.shipping_address,
                profilePhoto: action.profilePhoto,
                profilePhotoType: action.profilePhotoType,
                profilePhotoName: action.profilePhotoName,
                artistAddedNotify: action.artistAddedNotify,
                contentAddedNotify: action.contentAddedNotify,
                gmail: action.gmail,
                facebook: action.facebook,
                apple: action.apple
            }

        case types.SET_SOCIAL_LOGIN_REGISTRATION_DATA:
            return {
                ...prevState,
                firstName: action.firstName,
                lastName: action.lastName,
                email: action.email,
                gmail: action.gmail,
                facebook: action.facebook,
                apple: action.apple,
                appleFirebaseUid: action.appleFirebaseUid
            }

        case types.SEND_OTP_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.SEND_OTP_SUCCESS:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.SEND_OTP_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.VERIFY_OTP_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.VERIFY_OTP_SUCCESS:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.VERIFY_OTP_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.LOGOUT_SUCCESS:
            return {
                ...prevState,
                isLoading: false
            }
        case types.LOGOUT_FAIL:
            return {
                ...prevState,
                isLoading: false
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

        case types.SELECT_USER_GENRE:
            return {
                ...prevState,
                genres: action.updatedGenre
            }

        /* Old Code of artist*/

        case types.REGISTER_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.REGISTER_SUCCESS:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.REGISTER_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.VERIFY_EMAIL_LOADING:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.VERIFY_EMAIL_SUCCESS:
            return {
                ...prevState,
                isLoading: action.isLoading
            }

        case types.VERIFY_EMAIL_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.SET_EMAIL:
            return {
                ...prevState,
                emailForget: action.emailForget
            }
        case types.FORGET_PASSWORD_SUCCESS:
            return {
                ...prevState,
                isLoading: action.isLoading,
                forgetPasswordResponse: action.forgetPasswordResponse,
            }
        case types.FORGET_PASSWORD_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading,
                forgetPasswordFailResponse: action.forgetPasswordFailResponse,
            }
        case types.RESET_PASSWORD_SUCCESS:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.RESET_PASSWORD_FAIL:
            return {
                ...prevState,
                isLoading: action.isLoading
            }
        case types.EMAIL_NULL:
            return {
                ...prevState,
                emailForget: null
            }

        case types.SET_FORGET_PASSWORD_RESET_TOKEN:
            return {
                ...prevState,
                forgetPasswordResponse: action.forgetPasswordResetToken
            }
        case types.CLEAR_FORGET_PASSWORD:
            return {
                ...prevState,
                forgetPasswordFailResponse: action.forgetPasswordFailResponse
            }
        case types.IS_APPLE_LOGIN:
            return {
                ...prevState,
                isAppleLogin: action.isAppleLogin
            }

        case types.CLEAR_ALL_DATA:
            return {
                ...initialstate,
            }
        default:
            return prevState
    }
}
export default RegistrationReducer