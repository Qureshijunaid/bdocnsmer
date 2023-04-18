import types from '../constants/Types';

const initialstate = {
    showMinimizeAudio: false,
    isPlaying: false,
    audioName: "audio name (feat shan)",
    audioTrack: "",
    audioArtistProfile: "https://techalchemybando.s3.ap-south-1.amazonaws.com/storage/images/1619790258647_Vector%2013.png",
    audioContent: null
}

const audioMinimizeReducer = (prevState = initialstate, action) => {
    switch (action.type) {
        case types.AUDIO_PLAYING_MINIMIZED:
            return {
                ...prevState,
                showMinimizeAudio: action.showMinimizeAudio,
                isPlaying: action.isPlaying,
                audioName: action.audioName,
                audioTrack: action.audioTrack,
                audioArtistProfile: action.audioArtistProfile,
                audioContent: action.audioContent
            }
        case types.CLEAR_ALL_DATA:
            return {
                ...initialstate,
            }
        default:
            return prevState
    }
}
export default audioMinimizeReducer