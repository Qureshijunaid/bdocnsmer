import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
    StatusBar,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Platform,
    Modal,
    ImageBackground,
    Image,
    ImagePickerIOS,
    TouchableWithoutFeedback,
    Alert,
    SafeAreaView,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Foundation from 'react-native-vector-icons/Foundation';
import stripe from 'tipsi-stripe';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import VideoPlayer from '../../../components/AddVideoPost/react-native-video-controls/VideoPlayer';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import Slider from '@react-native-community/slider';
import TrackPlayer, {
    usePlaybackState,
    useTrackPlayerProgress, useTrackPlayerEvents
} from "react-native-track-player";
import { getArtistDetail } from '../../../actions/profile';
import { paymentSuccess, buyMerch, handlePaymentLoader } from '../../../actions/home';
import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import Toast from 'react-native-toast-message';
import * as NavigationService from '../../../navigation/NavigationService';
import { setAudioPlayingState, reSetAudioPlayingState } from '../../../actions/audioMinimize';
import {
    getCommentList,
    CommentOnPost,
    getReplyList,
    ReplyOnComment,
    deleteParticularComment,
    likeOnPost,
    unlikeOnPost,
    trackPost,
} from '../../../actions/post';
import {
    getPaymentCardsList,
} from '../../../actions/auth';
import {
    setArtistID,

} from '../../../actions/profile';
const WIDTH = Dimensions.get("window").width;
const PostList = (props) => {
    const [showPopUp, setShowPopUp] = useState(true)
    const [state, setState] = React.useState({
        pageNumber: 1,
        showMusicModal: false,
        showImageModal: false,
        showVideoModal: false,
        showMerchModal: false,
        isNotificationData: props.route.params.notificationData,
        selectedAudio: props.route.params.notificationData,
        isAudioLiked: props.route.params.notificationData.isLiked,
        paymentCardModal: false,
        thankModalState: true,
        buyMerchDetail: null,
        selectMerchVariant: 0,
        pageNumber: 1,
        merchandiseArray: [
            { id: 1, image: constants.Images.welcome1, title: "Nile Rodgers T-shirt", price: 20.99 },
            { id: 2, image: constants.Images.InvestorImage4, title: "Blueprint Hoodie", price: 80.99 },
            { id: 3, image: constants.Images.InvestorImage6, title: "Nile Rodgers T-shirt", price: 20.99 },
        ],
    })

    useEffect(() => {
        props.dispatch(getPaymentCardsList())
        let payload = {
            "_id": props.route.params.notificationData._id,
            "type": 1
        }
        props.dispatch(trackPost(payload))
        const subscribeOnFocus = props.navigation.addListener('focus', () => {
            setShowPopUp(true)

        });
        const unsubscribeOnBlur = props.navigation.addListener('blur', () => {
            setShowPopUp(false)
        });

        return () => {
            subscribeOnFocus;
            unsubscribeOnBlur;
        };
    }, [])

    const { position, duration } = useTrackPlayerProgress(1000, null);
    const playbackState = usePlaybackState();

    const slidingCompleted = async value => {
        await TrackPlayer.seekTo(value * duration);
    };

    const handleLikeUnlikePost = () => {
        // if (!props.home.multipleClickDisabled) {
        //     props.dispatch(handlePaymentLoader(true))
        if (state.isAudioLiked) {
            const payload = {
                "post_id": props.route.params.notificationData._id,
                "status": "like",
                "type": ""
            }
            props.dispatch(likeOnPost(payload))
        }
        console.log("post list", props.route.params.notificationData);
        let likes = JSON.parse(props.route?.params?.notificationData?.likes)
        if (!state.isAudioLiked && likes.length > 0) {
            const index = likes.findIndex(data => data.user_id === props.auth.userRegistered._id);
            if (index > -1) {
                const payload = {
                    "likeId": likes[index]._id,
                    "postId": props.route.params.notificationData._id,
                    "type": ""
                }
                props.dispatch(unlikeOnPost(payload))
            }

        }
        //}
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
        if (currentTrack == undefined) {


            await TrackPlayer.reset();
            //   await TrackPlayer.add(playlistData);
            await TrackPlayer.add({
                id: "local-track",
                url: state.isNotificationData?.media_url,
                title: state.isNotificationData?.title,
                artist: state.isNotificationData?.artistName,
                artwork: state.isNotificationData?.cover_image,
                // duration: 10
            });
            setState({
                ...state,
                isForward: false,
                isBackward: false
            })
            await TrackPlayer.play();
        } else {
            if (playbackState === TrackPlayer.STATE_PAUSED) {
                await TrackPlayer.play();
            } else {
                if (playbackState === "ready" || playbackState === "loading") {
                    await TrackPlayer.play();
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

    const handleOnShowAudio = async () => {
        await TrackPlayer.add({
            id: "local-track",
            url: state.isNotificationData?.media_url,
            title: state.isNotificationData?.title,
            artist: state.isNotificationData?.artistName,
            artwork: state.isNotificationData?.cover_image
            //"https://homepages.cae.wisc.edu/~ece533/images/airplane.png",
            // duration: 10
        });
        setState({
            ...state,
            isForward: false,
            isBackward: false
        })
    }

    const handleCrossAudioModal = async () => {
        handleLikeUnlikePost()
        // {
        //     Platform.OS === "ios" ?
        //         await TrackPlayer.pause()
        //         : await TrackPlayer.destroy()
        // }
        props.navigation.goBack()

    }

    const handleMerchBuy = (merch, selectMerchVariant) => {
        handleLikeUnlikePost()
        // props.dispatch(paymentSuccess(true, false))
        state.showMusicModal = false
        state.showImageModal = false
        setState({
            ...state,
            //paymentCardModal: true,
            buyMerchDetail: merch,
            selectMerchVariant: selectMerchVariant
        })
        NavigationService.navigate(constants.ScreensName.Cards.name, {
            merch: merch,
            selectedSize: selectMerchVariant,
        })
    }

    const showArtistDetail = (data) => {
        state.multipleClickDisabled = true
        setState({
            ...state
        })
        if (state.multipleClickDisabled) {
            props.dispatch(setArtistID(data))
            props.dispatch(getArtistDetail("homeArtistDetail"))
        }

    }

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                <Components.ProgressView
                    isProgress={props.profile.isLoading}
                    title={constants.AppConstant.Bando}
                />
            </SafeAreaView>

            {/* AUDIO */}

            <Modal
                animationType="slide"
                transparent={true}
                visible={showPopUp}
                onShow={() => {
                    handleOnShowAudio()
                }}
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
                                paddingBottom: constants.vh(100),
                                // alignItems: "center"
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
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => showArtistDetail(state.isNotificationData.artistId)}>
                                        <Image
                                            source={
                                                state.isNotificationData.artistProfileImage != null ? { uri: state.isNotificationData.artistProfileImage } : { uri: constants.AppConstant.bandoLogo }
                                            }
                                            style={{
                                                width: constants.vw(33),
                                                height: constants.vw(33),
                                                borderRadius: constants.vw(33 / 2)
                                            }}
                                            resizeMode="cover"
                                        />
                                    </TouchableOpacity>
                                    <View style={{ marginStart: constants.vw(11), width: '80%' }}>
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            onPress={() => showArtistDetail(state.isNotificationData.artistId)}>

                                            <Text style={{
                                                fontSize: 20,
                                                fontWeight: "800",
                                                fontFamily: constants.Fonts.K2D_Regular,
                                                color: constants.Colors.white,
                                                // textTransform: 'capitalize'
                                            }} numberOfLines={2}>{
                                                    state.isNotificationData?.artistName}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity
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
                                        size={25}
                                    />
                                </TouchableOpacity>

                            </View>

                            <View style={{ marginTop: constants.vh(33) }}>
                                <View style={[styles.card]}>
                                    <View style={[styles.cover, { justifyContent: 'center', alignItems: 'center' }]}>
                                        <Image style={styles.cover}
                                            source={{ uri: state.isNotificationData?.cover_image }}
                                            resizeMode={"cover"}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => {
                                            setState({
                                                ...state,
                                                isAudioLiked: !state.isAudioLiked
                                            })
                                        }}
                                        hitSlop={styles.hitSlop}
                                        style={{ alignItems: "flex-end", width: "90%" }}>
                                        <Image
                                            source={state.isAudioLiked ?
                                                constants.Images.Liked :
                                                constants.Images.Unliked
                                            }
                                        />
                                        {/* <AntDesign
                                            onPress={() => {
                                                setState({
                                                    ...state,
                                                    isAudioLiked: !state.isAudioLiked
                                                })
                                            }}
                                            name={"heart"}
                                            size={constants.vw(20)}

                                            color={
                                                state.isAudioLiked ? constants.Colors.color_FF3062 :
                                                    constants.Colors.color_636363}
                                        /> */}
                                    </TouchableOpacity>
                                    <Text style={styles.audioTitle}>{state.isNotificationData?.title}</Text>
                                    {/* <Text style={styles.albumText}>Album - {state.isNotificationData?.album}</Text> */}
                                    <Text style={styles.albumText}>{state.isNotificationData?.album ? ("Album - " + state.isNotificationData?.album) : ""}</Text>


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
                                        value={duration > 0 ?
                                            state.isForward ? position / duration + 0.15 :
                                                state.isBackward ? position / duration - 0.15 :
                                                    position / duration : 0}
                                        // position / duration
                                        minimumTrackTintColor={constants.Colors.color_FF3062}
                                        maximumTrackTintColor={constants.Colors.white}
                                        thumbImage={constants.Images.Rectangle}
                                        //    onSlidingStart={slidingStarted}
                                        onSlidingComplete={slidingCompleted}
                                    />
                                    <View style={styles.timerContainer}>
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
                                                ((playbackState === "paused" || playbackState === "idle" || playbackState === "loading" || playbackState === "ready") ?
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
                                                    />)
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
                                    {state.isNotificationData?.description}
                                </Text>
                            </View>
                            {
                                JSON.parse(state.isNotificationData?.merchandise).length > 0 &&
                                <View style={styles.merchandiseContainerModal}>
                                    <Text style={[styles.text18500, { color: constants.Colors.white }]}>Merchandise</Text>
                                    <Components.CountCard
                                        count={JSON.parse(state.isNotificationData?.merchandise).length}
                                    //count={state.isNotificationData?.merchandise.length}
                                    />

                                </View>
                            }

                            <View style={{ width: "100%" }}>
                                {JSON.parse(state.isNotificationData?.merchandise).length > 0 ?

                                    <Components.MerchandiseSlider
                                        images={JSON.parse(state.isNotificationData?.merchandise)}
                                        //images={state.isNotificationData?.merchandise}
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
                                    /> : <View style={{ height: constants.vh(300) }} />}
                            </View>
                            <View style={{ height: 50 }}><Text></Text></View>

                        </LinearGradient>

                    </View>
                </ScrollView>
            </Modal>

        </>
    )
}



function mapStateToProps(state) {
    const { auth, post, profile, home } = state
    return {
        auth,
        post,
        profile,
        home
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
    (PostList);