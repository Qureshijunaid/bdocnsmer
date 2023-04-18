import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform,
    Modal,
    ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import Foundation from 'react-native-vector-icons/Foundation';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Slider from '@react-native-community/slider';
import Components from '../../components';
import TrackPlayer, {
    usePlaybackState,
    useTrackPlayerProgress,
    useTrackPlayerEvents,
    TrackPlayerEvents,
    play
} from "react-native-track-player";
import GestureRecognizer from 'react-native-swipe-gestures';
import * as NavigationService from '../../navigation/NavigationService';
import FastImage from 'react-native-fast-image';

import constants from '../../constants';
import { styles } from './styles';
import { setAudioPlayingState } from '../../actions/audioMinimize';
import {
    likeOnPost,
    unlikeOnPost,
} from '../../actions/post';
import { paymentSuccess } from '../../actions/home';
import { PostActionButton } from '../cards'

const AudioMinimize = (props) => {
    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: Platform.OS === "ios" ? 80 : 40
    };

    const [state, setState] = useState({
        showMaximizeAudioModal: false,
        multipleOpenMaximize: false,
    })

    const playbackState = usePlaybackState();
    useEffect(() => {
        handleEndOfAudio()
    }, [])
    const handleEndOfAudio = async () => {
        setInterval(async () => {
            let currentPosition = await TrackPlayer.getPosition()
            let totalDuration = await TrackPlayer.getDuration()
            if (Math.trunc(currentPosition) > 0 && Math.trunc(currentPosition) >= Math.trunc(totalDuration)) {
                handleCloseMinimizedAudio()
            }
        }, 1000);

    }
    const handleToggleStateAudio = async () => {
        if (props.audioMinimize.isPlaying) {
            await TrackPlayer.pause()
        } else {
            await TrackPlayer.play()
        }
        const payload = {
            showMinimizeAudio: true,
            isPlaying: props.audioMinimize.isPlaying ? false : true,
            audioName: props.audioMinimize.audioName,
            audioTrack: props.audioMinimize.audioTrack,
            audioArtistProfile: props.audioMinimize.audioArtistProfile
        }
        props.dispatch(setAudioPlayingState(payload))
    }
    const handleCloseMinimizedAudio = async () => {
        state.multipleOpenMaximize = false
        setState({
            ...state
        })
        await TrackPlayer.reset()
        //await TrackPlayer.destroy()
        const payload = {
            showMinimizeAudio: false,
            isPlaying: false,
            audioName: "",
            audioTrack: "",
            audioArtistProfile: ""
        }
        props.dispatch(setAudioPlayingState(payload))
    }

    const handleCrossAudioModal = async () => {
        state.multipleOpenMaximize = false
        state.showMaximizeAudioModal = false
        if (playbackState === TrackPlayer.STATE_PAUSED || playbackState === "ready" || playbackState === "loading" || playbackState === "idle") {
            const payload = {
                showMinimizeAudio: false,
                isPlaying: false,
                audioName: props.audioMinimize.audioContent.title,
                audioTrack: props.audioMinimize.audioContent.media_url,
                audioArtistProfile: props.audioMinimize.audioContent.cover_image,
                audioContent: props.audioMinimize.audioContent
            }
            props.dispatch(setAudioPlayingState(payload))

        } else {
            const payload = {
                showMinimizeAudio: true,
                isPlaying: true,
                audioName: props.audioMinimize.audioContent.title,
                audioTrack: props.audioMinimize.audioContent.media_url,
                audioArtistProfile: props.audioMinimize.audioContent.cover_image,
                audioContent: props.audioMinimize.audioContent
            }
            props.dispatch(setAudioPlayingState(payload))
        }

        if (Platform.OS == "android") {
            if (playbackState === 0 || playbackState === 1 || playbackState === 2 || playbackState === 8) {
                const payload = {
                    showMinimizeAudio: true,
                    isPlaying: false,
                    audioName: state.selectedAudio.title,
                    audioTrack: state.selectedAudio.media_url,
                    audioArtistProfile: state.selectedAudio.cover_image,
                    audioContent: state.selectedAudio
                }
                props.dispatch(setAudioPlayingState(payload))
            } else {
                const payload = {
                    showMinimizeAudio: true,
                    isPlaying: true,
                    audioName: state.selectedAudio.title,
                    audioTrack: state.selectedAudio.media_url,
                    audioArtistProfile: state.selectedAudio.cover_image,
                    audioContent: state.selectedAudio
                }
                props.dispatch(setAudioPlayingState(payload))
            }
        }


        setState({
            ...state
        })
        props.dispatch(setAudioPlayingState(payload))

    }
    const onSwipeDown = (gesture) => {
        handleCloseMinimizedAudio()
    }

    const { position, duration } = useTrackPlayerProgress(1000, null);

    const slidingCompleted = async value => {
        await TrackPlayer.seekTo(value * duration);
    };
    const handleLikeUnlikePost = () => {
        if (props.post.selectedPostData.isLiked === false) {
            const payload = {
                "post_id": props.audioMinimize.audioContent._id,
                "status": "like",
                "type": "artistDetails"
            }
            props.dispatch(likeOnPost(payload))
        } else {
            const payload = {
                "likeId": props.audioMinimize.audioContent.likes[0]._id,
                "postId": props.audioMinimize.audioContent._id,
                "type": "artistDetails"
            }
            props.dispatch(unlikeOnPost(payload))
        }
    }
    const forward = async () => {
        setState({
            ...state,
            isForward: true
        })
        let newPosition = await TrackPlayer.getPosition();
        let duration = await TrackPlayer.getDuration();
        newPosition += 10;
        if (newPosition > duration) {
            newPosition = duration;
        }
        TrackPlayer.seekTo(newPosition);
    }

    const backward = async () => {
        // await TrackPlayer.play();
        setState({
            ...state,
            isBackward: true
        })
        let newPosition = await TrackPlayer.getPosition();
        newPosition -= 10;
        if (newPosition < 0) {
            newPosition = 0;
        }
        TrackPlayer.seekTo(newPosition);
    };



    function pad(n, width, z = 0) {
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    const minutesAndSeconds = (position) => (

        [

            pad(Math.floor(position / 60), 2),
            pad(position % 60, 2),
        ]);

    const elapsed = minutesAndSeconds(Math.round(position));
    const remaining = minutesAndSeconds(duration);
    async function setup() {
        await TrackPlayer.setupPlayer({});
        await TrackPlayer.updateOptions({
            stopWithApp: true,
            capabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_STOP
            ],
            compactCapabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE
            ]
        });
    }
    const togglePlayback = async () => {
        const currentTrack = await TrackPlayer.getCurrentTrack();
        const getStateHere = await TrackPlayer.getState()

        if (currentTrack == null) {
            await TrackPlayer.reset();
            await TrackPlayer.add({
                id: "local-track",
                url: state.selectedAudio.media_url,
                title: state.selectedAudio.title,
                artist: state.selectedAudio?.artistName,
                artwork: state.image,
            });

            setState({
                ...state,
                isForward: false,
                isBackward: false
            })
            await TrackPlayer.play();
        } else {
            if (playbackState === TrackPlayer.STATE_PAUSED || playbackState === "ready") {
                await TrackPlayer.play();
                return 1;
            } else {
                if (playbackState === "idle" || playbackState === "loading") {
                    await TrackPlayer.pause();
                    return 1
                }

                await TrackPlayer.pause();
                if (getStateHere === 1) {
                    await TrackPlayer.reset();
                    togglePlayback()
                }
            }
        }
    }





    const handleMaximizeAudio = () => {
        const payload = {
            showMinimizeAudio: false,
            isPlaying: false,
            audioName: "",
            audioTrack: "",
            audioArtistProfile: "",
        }
        props.dispatch(setAudioPlayingState(payload))
        state.multipleOpenMaximize = true
        setState({
            ...state,
            showMaximizeAudioModal: true
        })
    }


    const handleMerchBuy = (merch, selectMerchVariant) => {
        props.dispatch(paymentSuccess(true, false, false))
        state.showMaximizeAudioModal = false
        setState({
            ...state,
            buyMerchDetail: merch,
            selectMerchVariant: selectMerchVariant
        })
        NavigationService.navigate(constants.ScreensName.Cards.name, {
            merch: merch,
            selectedSize: selectMerchVariant
        })
    }

    const handlePressShare = () => {
        handleCrossAudioModal()
        props.onPressShare()
    }
    const handlePressComment = () => {
        handleCrossAudioModal()
        props.onPressComment()
    }

    return (
        // <GestureRecognizer
        //     onSwipeDown={(state) => onSwipeDown(state)}
        //     config={config}
        //     style={{
        //         paddingHorizontal: 15,
        //         alignItems: "center",
        //     }}
        // >
        <>
            <TouchableOpacity
                style={{
                    paddingHorizontal: 15,
                    alignItems: "center",
                    alignSelf: "center",
                    position: "absolute",
                    bottom: constants.vh(24),
                    //   zIndex:999,
                    width: "100%",
                }}

                activeOpacity={1}
                onPress={handleMaximizeAudio}
                disabled={state.multipleOpenMaximize}
            >
                {
                    props.audioMinimize.showMinimizeAudio ?
                        <View style={styles.container}>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}>
                                <FastImage
                                    source={{
                                        uri:

                                            props.audioMinimize.audioArtistProfile != "" ?
                                                props.audioMinimize.audioArtistProfile : constants.AppConstant.bandoLogo,
                                        priority: FastImage.priority.high
                                    }}
                                    style={styles.profileImage}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                                <View style={{ marginStart: constants.vw(20) }}>
                                    <Text style={styles.text11normal}>Currently Playing</Text>
                                    <Text style={styles.text12bold} numberOfLines={1}>{props.audioMinimize.audioName}</Text>
                                </View>
                            </View>
                            <View style={{
                                alignSelf: "flex-end",
                                flexDirection: "row",
                                alignItems: "center"
                            }}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={handleToggleStateAudio}
                                    style={{
                                        width: constants.vw(40),
                                        height: constants.vw(40),
                                        borderRadius: constants.vw(40 / 2),
                                        backgroundColor: props.audioMinimize.isPlaying ? constants.Colors.color_B9B9B9 : constants.Colors.color_636363,
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <Foundation
                                        name={props.audioMinimize.isPlaying ? "pause" : "play"}
                                        color={props.audioMinimize.isPlaying ? "#000" : "#fff"}
                                        size={30}
                                    />
                                    {/* <Foundation
                                        name={playbackState !== TrackPlayer.STATE_PAUSED ? "pause" : "play"}
                                        color={playbackState !== TrackPlayer.STATE_PAUSED ? "#000" : "#fff"}
                                        size={30}
                                    /> */}

                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleCloseMinimizedAudio()}
                                    style={{
                                        width: constants.vw(40),
                                        height: constants.vw(40),
                                        borderRadius: constants.vw(40 / 2),
                                        backgroundColor: constants.Colors.color_B9B9B9,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginHorizontal: 5
                                    }}
                                >
                                    <FontAwesome
                                        name="close"
                                        size={constants.vw(22)}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        : null
                }
            </TouchableOpacity>




            <Modal
                animationType="slide"
                transparent={true}
                visible={state.showMaximizeAudioModal}
            >
                <ScrollView style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}>
                    <View

                    >
                        <LinearGradient
                            colors={[constants.Colors.color_333333, constants.Colors.color_232323,]}
                            style={{
                                flex: 1,
                                marginTop: constants.vh(90),
                                marginBottom: constants.vh(-10),
                                height: "100%",
                                borderRadius: 10,
                                paddingHorizontal: constants.vw(20),
                                paddingTop: constants.vh(15),
                                // alignItems: "center"
                                paddingBottom: constants.vh(100),

                            }}>
                            <Image
                                source={constants.Images.HomeIndicator}
                                style={{ alignSelf: "center" }}
                            />
                            <View
                                style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        alignItems: "center"
                                    }}
                                >
                                    <Image

                                        source={{
                                            uri: props.profile.artistDetail != null ?
                                                (props.profile.artistDetail[0]?.artistDeatils.profileImage ? props.profile.artistDetail[0].artistDeatils.profileImage : constants.AppConstant.bandoLogo) :
                                                constants.AppConstant.bandoLogo
                                        }}

                                        style={{
                                            width: constants.vw(33),
                                            height: constants.vw(33),
                                            borderRadius: constants.vw(33 / 2)
                                        }}
                                        resizeMode="cover"
                                    />
                                    <View style={{ marginStart: constants.vw(11), width: '80%' }}>
                                        <Text style={{
                                            fontSize: 20,
                                            fontWeight: "800",
                                            fontFamily: constants.Fonts.K2D_Regular,
                                            color: constants.Colors.white,
                                            // textTransform: 'capitalize'
                                        }}
                                            numberOfLines={2}
                                        >
                                            {
                                                props.profile.artistDetail != null ? (props.profile.artistDetail[0]?.artistDeatils.artistName ? props.profile.artistDetail[0].artistDeatils.artistName : props.profile.artistDetail[0]?.artistDeatils.firstName + " " + props.profile.artistDetail[0]?.artistDeatils.lastName) : ""
                                            }
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    hitSlop={styles.hitSlop}
                                    onPress={() =>
                                        handleCrossAudioModal()
                                    }
                                    activeOpacity={1}
                                    style={{
                                        width: constants.vw(25),
                                        height: constants.vw(25),
                                        borderRadius: constants.vw(25 / 2),
                                        backgroundColor: "rgba(194, 194, 194, 0.29)",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                    <Entypo
                                        name="cross"
                                        color={constants.Colors.white}
                                        size={18}
                                    />
                                </TouchableOpacity>

                            </View>

                            <View style={{ marginTop: constants.vh(33) }}>
                                <View style={[styles.card]}>
                                    <View style={[styles.cover, { justifyContent: 'center', alignItems: 'center' }]}>
                                        <Image style={styles.cover}
                                            source={{
                                                uri:
                                                    props.audioMinimize?.audioContent?.cover_image != "" ?
                                                        props.audioMinimize?.audioContent?.cover_image : constants.AppConstant.bandoLogo


                                            }}
                                            resizeMode={"cover"}
                                        />
                                    </View>
                                    {
                                        props.showActionButton &&
                                        <View style={{
                                            // alignItems: "flex-end", 
                                            // width: "90%",
                                            position: "absolute",
                                            top: constants.vh(10),
                                            alignSelf: "flex-end",
                                            marginTop: 10
                                        }}>
                                            <PostActionButton
                                                isLiked={props.audioMinimize?.audioContent?.isLiked}
                                                onPressLikeUnlike={() => handleLikeUnlikePost()}
                                                onPressShare={() => { handlePressShare() }}
                                                onPressComment={() => { handlePressComment() }}
                                            />
                                        </View>
                                    }

                                    <Text style={styles.audioTitle}>{props.audioMinimize?.audioContent?.title}</Text>
                                    <Text style={styles.albumText}>{props.audioMinimize?.audioContent?.album ? ("Album - " + props.audioMinimize?.audioContent?.album) : ""}</Text>
                                    <Slider
                                        style={{
                                            width: "100%",
                                            height: 30,
                                            borderRadius: 50,
                                            marginTop: constants.vh(24),
                                            // backgroundColor:
                                            // backgroundColor: "red"
                                        }}
                                        minimumValue={0}
                                        maximumValue={1}
                                        value={duration > 0 ? (
                                            state.isForward ? position / duration + 0.15 :
                                                (state.isBackward ? position / duration - 0.15 :
                                                    position / duration))
                                            : 0}
                                        // position / duration
                                        minimumTrackTintColor={constants.Colors.color_FF3062}
                                        maximumTrackTintColor={constants.Colors.white}
                                        thumbImage={constants.Images.Rectangle}
                                        //    onSlidingStart={slidingStarted}
                                        onSlidingComplete={slidingCompleted}
                                    />
                                    <View style={{ ...styles.timerContainer }}>
                                        <Text style={styles.text700Normal}>{elapsed[0] + ":" + elapsed[1]}</Text>
                                        <Text style={styles.text700Normal}>{remaining[0] + ":" + Math.round(remaining[1])}</Text>
                                    </View>
                                    <View style={styles.controls}>
                                        <TouchableOpacity
                                            onPress={() => backward()}
                                            style={styles.buttonContainer}
                                        >
                                            <Foundation
                                                name={"previous"}
                                                size={25}

                                            />
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.toggleButtonContainer}
                                            activeOpacity={1}
                                            onPress={() => togglePlayback()}
                                        >
                                            {Platform.OS == "ios" ?
                                                ((playbackState === "ready" || playbackState === "paused" || playbackState === "idle" || playbackState === "loading") ?
                                                    <Entypo
                                                        name={"controller-play"}
                                                        size={25}
                                                        color={constants.Colors.white}
                                                    />

                                                    :

                                                    <FontAwesome
                                                        name={"pause"}
                                                        size={25}
                                                        color={constants.Colors.white}
                                                    />
                                                )
                                                : (
                                                    playbackState === 3 ?
                                                        <FontAwesome
                                                            name={"pause"}
                                                            size={25}
                                                            color={constants.Colors.white}
                                                        />
                                                        :
                                                        <Entypo
                                                            name={"controller-play"}
                                                            size={25}
                                                            color={constants.Colors.white}
                                                        />
                                                )
                                            }
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => forward()}
                                            style={styles.buttonContainer}

                                        >
                                            <Foundation
                                                name={"next"}
                                                size={25}

                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginTop: constants.vh(24) }}>
                                <Text style={styles.text16400}
                                >
                                    {props.audioMinimize?.audioContent?.description}
                                </Text>
                            </View>
                            {
                                props.audioMinimize?.audioContent?.merchandise.length > 0 &&
                                <View style={styles.merchandiseContainerModal}>
                                    <Text style={[styles.text18500, { color: constants.Colors.white }]}>Merchandise</Text>
                                    <Components.CountCard
                                        count={props.audioMinimize?.audioContent?.merchandise.length > 0 ? props.audioMinimize?.audioContent?.merchandise.length : 0}
                                    />
                                </View>
                            }

                            <View style={{ width: "100%" }}>
                                {
                                    props.audioMinimize?.audioContent?.merchandise.length > 0 ?
                                        <Components.MerchandiseSlider
                                            images={props.audioMinimize?.audioContent?.merchandise}
                                            containerStyle={[styles.merchandiseSliderContainer]}
                                            showButton={false}
                                            containerStyle={{
                                                height: constants.vh(650)
                                            }}
                                            sliderButtonSize={8}
                                            selectedButtonColor={constants.Colors.color_FF3062}
                                            unselectedButtonBorderColor={"#fff"}
                                            onPressBuyNow={(result, selectMerchVariant) =>
                                                handleMerchBuy(result, selectMerchVariant)
                                            }
                                        /> : <View style={{ height: constants.vh(200) }} />

                                }

                            </View>

                        </LinearGradient>

                    </View>
                </ScrollView>
            </Modal>

        </>

        // </GestureRecognizer>
    )
}

function mapStateToProps(state) {
    const { audioMinimize, profile,
        post } = state
    return {
        audioMinimize, profile,
        post
    }
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps)
    (AudioMinimize);