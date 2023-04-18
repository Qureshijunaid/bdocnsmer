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
import FastImage from 'react-native-fast-image';

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
        imageHeight: constants.vh(361)
    })

    useEffect(() => {
        props.dispatch(getPaymentCardsList())
        let payload = {
            "_id": props.route.params.notificationData._id,
            "type": 1
        }
        props.dispatch(trackPost(payload))
        const unsubscribe = props.navigation.addListener('focus', () => {
            setShowPopUp(true)

        });
        const unsubscribeOnBlur = props.navigation.addListener('blur', () => {
            setShowPopUp(false)
        });

        return () => {
            unsubscribe;
            unsubscribeOnBlur;
        };
    }, [])

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

    const handleCrossImageModal = () => {
        handleLikeUnlikePost()
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


            {/* IMAGE */}

            <Modal
                animationType="slide"
                transparent={true}
                visible={showPopUp}
            >
                {/* <View style={styles.modalContainer}> */}
                {/* <TouchableWithoutFeedback style={{ flex: 1 }}> */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.modalDataContainer}>
                    <View style={{ alignSelf: 'center', width: '100%' }}>
                        <View style={{ ...styles.modalHeaderContainer, paddingHorizontal: 16 }}>
                            <View
                                style={styles.modalMerchandisingContainer}
                            >
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => showArtistDetail(state.isNotificationData.artistId)} >
                                    <Image
                                        source={

                                            state.isNotificationData.artistProfileImage != null ? { uri: state.isNotificationData.artistProfileImage } : { uri: constants.AppConstant.bandoLogo }
                                        }
                                        resizeMode={"cover"}
                                        style={styles.modalProfileImageContainer}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => showArtistDetail(state.isNotificationData.artistId)} >

                                    <Text style={[styles.text18500Images, { marginStart: constants.vw(11), width: '100%' }]} numberOfLines={2}>
                                        {
                                            state.isNotificationData?.artistName
                                        }
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                    handleCrossImageModal()
                                }}
                                style={styles.modalCrossContainer}
                            >
                                <Entypo
                                    name="cross"
                                    size={constants.vw(18)}
                                    color={constants.Colors.white}
                                />
                            </TouchableOpacity>
                        </View>

                        <View
                            style={styles.merchandiseImageContainer}>
                            <FastImage
                                source={{ uri: state.isNotificationData.media_url }}
                                style={{
                                    width: constants.vw(340),
                                    height: state.imageHeight,
                                    borderRadius: 8,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                                onLoadStart={() => { }}
                                onProgress={(e) => { }}
                                onLoad={(evt) => {
                                    setState({
                                        ...state,
                                        imageHeight: evt.nativeEvent.height / evt.nativeEvent.width * WIDTH
                                    })
                                }}
                            />
                        </View>
                        <View style={styles.modalTitleHeartContainer}>
                            <View style={styles.Container23Text}>
                                <Text style={styles.text23800}
                                >{state.isNotificationData.title}</Text>
                            </View>

                            <TouchableOpacity
                                hitSlop={styles.hitSlop}
                                activeOpacity={1}
                                onPress={() => {
                                    setState({
                                        ...state,
                                        isAudioLiked: !state.isAudioLiked
                                    })
                                }}
                                style={{ marginEnd: 10 }}>
                                <Image
                                    source={state.isAudioLiked ?
                                        constants.Images.Liked :
                                        constants.Images.Unliked
                                    }
                                />
                            </TouchableOpacity>

                        </View>
                        <View style={{ marginTop: 5, width: '95%', alignSelf: 'center' }}>
                            <Text style={styles.text16400Image}
                            >
                                {state.isNotificationData.description}
                            </Text>
                        </View>
                        {JSON.parse(state.isNotificationData?.merchandise).length > 0 &&
                            <View style={styles.merchandiseContainerImages}>
                                <Text style={[styles.text18500Images, { color: constants.Colors.white, marginRight: 10 }]}>Merchandise</Text>
                                <Components.CountCard
                                    count={JSON.parse(state.isNotificationData?.merchandise).length}
                                />
                            </View>
                        }

                        <View style={{ width: "100%", alignSelf: 'center', alignItems: 'center' }}>
                            {JSON.parse(state.isNotificationData?.merchandise).length > 0 ?
                                <Components.MerchandiseSlider
                                    images={JSON.parse(state.isNotificationData?.merchandise)}
                                    showButton={false}
                                    containerStyle={[styles.merchandiseSliderContainer, {
                                    }]}
                                    sliderButtonSize={8}
                                    containerStyle={{
                                        height: constants.vh(700)
                                    }}
                                    selectedButtonColor={constants.Colors.color_FF3062}
                                    unselectedButtonBorderColor={"#fff"}
                                    onPressBuyNow={(result, selectMerchVariant) =>
                                        handleMerchBuy(result, selectMerchVariant)
                                    }
                                /> : <View style={{ height: constants.vh(300) }} />}
                        </View>
                    </View>
                </ScrollView>
                {/* </TouchableWithoutFeedback> */}
                {/* </View> */}
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