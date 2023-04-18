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
import { getArtistDetail, setArtistID } from '../../../actions/profile';
import { connect } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as NavigationService from '../../../navigation/NavigationService';
import Toast from 'react-native-toast-message';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Foundation from 'react-native-vector-icons/Foundation';
import stripe from 'tipsi-stripe';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import VideoPlayer from '../../../components/AddVideoPost/react-native-video-controls/VideoPlayer';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import { paymentSuccess, buyMerch, handlePaymentLoader } from '../../../actions/home';
import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import {
    getCommentList,
    CommentOnPost,
    getReplyList,
    ReplyOnComment,
    deleteParticularComment,
    likeOnPost,
    unlikeOnPost,
    trackPost
} from '../../../actions/post';
import {
    getPaymentCardsList,
} from '../../../actions/auth';
import { downloadFile } from '../../../utils/DownloadVideo';
import { Button } from 'react-native-share';

const WIDTH = Dimensions.get("window").width;
const PostListVideo = (props) => {
    const [state, setState] = React.useState({
        pageNumber: 1,
        showMusicModal: false,
        showImageModal: false,
        showVideoModal: false,
        isNotificationData: props.route.params.notificationData,
        videoUrl: props.route.params.notificationData.chunk_url,
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
    const [showPopUp, setShowPopUp] = useState(true)

    useEffect(() => {
        props.dispatch(getPaymentCardsList())
        let data = {
            "_id": props.route.params.notificationData._id,
            "type": 2
        }
        props.dispatch(trackPost(data))
        const unsubscribe = props.navigation.addListener('focus', () => {
            setShowPopUp(true)
        });
        const unsubscribeOnBlur = props.navigation.addListener('blur', () => {
            setState({
                ...state,
                showVideoModal: false,
                paymentCardModal: false,
            })
            setShowPopUp(false)
        });
        return () => {
            unsubscribe;
            unsubscribeOnBlur;
        }
    }, [])


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
        console.log("post list video", props.route.params.notificationData);
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

    const handleCrossVideoModal = () => {
        handleLikeUnlikePost()
        props.navigation.goBack()
    }

    const handleMerchBuy = (merch, selectMerchVariant) => {
        handleLikeUnlikePost()
        props.dispatch(paymentSuccess(true, false, false))
        state.showVideoModal = false
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

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                <Components.ProgressView
                    isProgress={props.profile.isLoading}
                    title={constants.AppConstant.Bando}
                />
            </SafeAreaView>
            {/* video Modal */}

            <Modal
                animationType="slide"
                transparent={true}
                visible={showPopUp}
            >
                <ScrollView
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        // flex: 1,
                        // zIndex: 2
                    }}>
                    <View

                    >
                        <LinearGradient
                            colors={[constants.Colors.color_333333, constants.Colors.color_232323,]}
                            style={{
                                flex: 1,
                                marginTop: constants.vh(90),
                                height: "100%",
                                borderRadius: 10,
                                paddingHorizontal: constants.vw(20),
                                paddingTop: constants.vh(15),
                                // alignItems: "center"
                            }}>
                            <TouchableOpacity>
                                <Image
                                    source={constants.Images.HomeIndicator}
                                    style={{ alignSelf: "center" }}
                                />
                            </TouchableOpacity>
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
                                        onPress={() => showArtistDetail(state.isNotificationData.artistId)} >
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
                                            onPress={() => showArtistDetail(state.isNotificationData.artistId)} >

                                            <Text style={{
                                                fontSize: 23,
                                                fontWeight: "800",
                                                fontFamily: constants.Fonts.K2D_Regular,
                                                color: constants.Colors.white,
                                                // textTransform: 'capitalize'
                                            }} numberOfLines={2} > {
                                                    state.isNotificationData?.artistName
                                                }</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() =>
                                        handleCrossVideoModal()
                                    }
                                    activeOpacity={1}
                                    style={{
                                        width: constants.vw(25),
                                        height: constants.vw(25),
                                        borderRadius: constants.vw(25 / 2),
                                        backgroundColor: "rgba(194, 194, 194, 0.29)",
                                        // backgroundColor: "red",
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

                            {/* <View style={{ marginTop: constants.vh(33) }}> */}
                            <View style={[styles.card, { flex: 1 }]}>
                                <VideoPlayer
                                    source={
                                        state.isNotificationData.chunk_url ?
                                            {
                                                uri: state.isNotificationData.chunk_url,
                                                type: "m3u8"
                                            } :
                                            {
                                                uri: state.isNotificationData.media_url
                                            }
                                    }
                                    aspectType={state.isNotificationData?.aspectRatioType}
                                    showPostActionButton
                                    seekColor={"red"}
                                    paused={true}
                                    hideShutterView={true}
                                    poster={state.isNotificationData?.posterFrame ? state.isNotificationData?.posterFrame : constants.AppConstant.bandoLogo}
                                    posterResizeMode="cover"
                                    showOnStart={false}
                                    controlAnimationTiming={0}
                                    allowsExternalPlayback={false}
                                    durationCallback={(result) =>
                                        setState({
                                            ...state,
                                            videoDuration: result
                                        })}
                                    repeat={false}
                                    ignoreSilentSwitch={"ignore"}
                                    playWhenInactive={false}
                                    playInBackground={false}

                                // onPressFullScreen={(currentTime) => {
                                //     setState({
                                //         ...state,
                                //         showVideoModal: false
                                //     })
                                //     NavigationService.navigate(constants.ScreensName.VideoPlayer.name, {
                                //         url: state.isNotificationData.chunk_url ?state.isNotificationData.chunk_url :state.isNotificationData.media_url ,
                                //         initialPlayed: currentTime,
                                //         posterFrame: state.isNotificationData?.posterFrame ? state.isNotificationData?.posterFrame : constants.AppConstant.bandoLogo
                                //     })
                                // }}
                                />


                            </View>
                            {/* </View> */}
                            <View style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: "100%", alignItems: "center", marginTop: constants.vh(27)
                            }}>
                                <Text style={[styles.audioTitle, { width: "50%" }]}>{state.isNotificationData?.title}</Text>

                                <TouchableOpacity
                                    hitSlop={styles.hitSlop}
                                    activeOpacity={1}
                                    onPress={() => setState({
                                        ...state,
                                        isAudioLiked: !state.isAudioLiked
                                    })}
                                    style={{ marginEnd: 10 }}>
                                    <Image
                                        source={state.isAudioLiked ?
                                            constants.Images.Liked :
                                            constants.Images.Unliked
                                        }
                                    />
                                </TouchableOpacity>

                            </View>

                            <View style={{ marginTop: constants.vh(28), width: "100%" }}>
                                <Text style={styles.text16400}>{state.isNotificationData?.description}</Text>
                            </View>
                            {JSON.parse(state.isNotificationData?.merchandise).length > 0 &&
                                <View style={styles.merchandiseContainerModal}>
                                    <Text style={[styles.text18500, { color: constants.Colors.white }]}>Merchandise</Text>
                                    <Components.CountCard
                                        count={JSON.parse(state.isNotificationData?.merchandise).length}
                                    />
                                </View>
                            }

                            <View style={{ width: "100%" }}>
                                {JSON.parse(state.isNotificationData?.merchandise).length > 0 ?
                                    <Components.MerchandiseSlider
                                        images={JSON.parse(state.isNotificationData?.merchandise)}
                                        containerStyle={[styles.merchandiseSliderContainer]}
                                        showButton={false}
                                        sliderButtonSize={8}
                                        containerStyle={{
                                            height: constants.vh(650)
                                        }}
                                        selectedButtonColor={constants.Colors.color_FF3062}
                                        unselectedButtonBorderColor={"#fff"}
                                        onPressBuyNow={(result, selectMerchVariant) =>
                                            handleMerchBuy(result, selectMerchVariant)

                                        }
                                    /> : <View style={{ height: constants.vh(300) }} />}
                            </View>

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
    (PostListVideo);