import React, { useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    Modal,
    ScrollView,
    ImageBackground,
    Dimensions,
    Platform,
    Share,
    Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getProfileDataIntoHome, viewAllMedia, getAllAudio } from '../../../actions/profile';
import { buyMerch, paymentSuccess } from '../../../actions/home';
import { CreditCardInput } from "react-native-credit-card-input";
import stripe from 'tipsi-stripe';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import Foundation from 'react-native-vector-icons/Foundation';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Slider from '@react-native-community/slider';
import TrackPlayer, {
    usePlaybackState,
    useTrackPlayerProgress, useTrackPlayerEvents
} from "react-native-track-player";
import Toast from 'react-native-toast-message';
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';

import {
    setArtistID, getArtistDetail, getConsumerProfile,
    handleClickArtistDetail
} from '../../../actions/profile';
import { AudioSlider } from '../../../components/AudioListSlider';
import * as NavigationService from '../../../navigation/NavigationService';
import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import { setAudioPlayingState } from '../../../actions/audioMinimize';
import {
    getCommentList,
    CommentOnPost,
    getReplyList,
    ReplyOnComment,
    deleteParticularComment,
    likeOnPost,
    unlikeOnPost,
    sharePost,
    shareProfileDetail,
    trackPost,
    setSelectedPost,
    clearReplyList,
    clearCommentList
} from '../../../actions/post';
import {
    getPaymentCardsList,
} from '../../../actions/auth';
import { handlePaymentLoader } from '../../../actions/home';
import { useDebounce } from '../../../utils/multipleClick';

const WIDTH = Dimensions.get("window").width;
const imageUrl = "https://homepages.cae.wisc.edu/~ece533/images/airplane.png";
const AudioList = (props) => {
    const { debounce } = useDebounce();
    const [state, setState] = React.useState({
        pageNumber: 1,
        showMusicModal: false,
        isSelectedAudioData: null,
        isAudioLiked: false,
        paymentCardModal: false,
        thankModalState: true,
        buyMerchDetail: null,
        selectMerchVariant: 0,
        pageNumber: 1,
        selectedAudio: "",
        selectedCommentArtistId: null,
        isDeletingComment: false,
        selectedCommentToDelete: null,
        showComment: false,
        comment: "",
        comment_id: null,
        selectedPost: null,
        commentArray: [],
        showReply: false,
        selectedPostTitle: '',
        shouldVideoPaused: false,
        reply: '',
        commented_by_id: null,
        isCommenting: false,
        selectedCommentArtistImage: null,
        selectedCommentArtistName: ""
        // isPlayingAudio: (playbackState === "ready" || playbackState === "paused" || playbackState === "idle" || playbackState === "loading") ? false : true,
    })
    // useEffect(() => {
    //     console.log(playbackState);
    // })
    useEffect(() => {
        let payload = {
            "pageNumber": state.pageNumber
        }
        props.dispatch(getAllAudio(payload))
        props.dispatch(getPaymentCardsList())
        const subscribeOnFocus = props.navigation.addListener('focus', () => {
            if (props.route.params?.notificationData) {
                handleAudioPress(props.route.params?.notificationData)
            }
        });
        const unsubscribeOnBlur = props.navigation.addListener('blur', () => {
            setState({
                ...state,
                showMusicModal: false,
                showComment: false,
                isDeletingComment: false
            })
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
        if (!props.home.multipleClickDisabled) {
            props.dispatch(handlePaymentLoader(true))
            if (props.post.selectedPostData.isLiked === false) {
                const payload = {
                    "post_id": props.post.selectedPostData._id,
                    "status": "like",
                    "type": "viewAllAudio"
                }
                props.dispatch(likeOnPost(payload))
            } else {
                const index = props.post.selectedPostData.likes.findIndex(data => data.user_id === props.auth.userRegistered._id);
                const payload = {
                    "likeId": props.post.selectedPostData.likes[index]._id,
                    "postId": props.post.selectedPostData._id,
                    "type": "viewAllAudio"
                }
                props.dispatch(unlikeOnPost(payload))
            }
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
    // let currentTrack;
    const togglePlayback = async () => {
        state.currentTrack = await TrackPlayer.getCurrentTrack();
        const getStateHere = await TrackPlayer.getState()
        if (state.currentTrack == null) {
            await TrackPlayer.reset();
            await TrackPlayer.add({
                id: "local-track",
                url: state.selectedAudio.media_url,
                title: state.selectedAudio.title,
                artist: state.selectedAudio?.artistName,
                artwork: state.image,
            });
            TrackPlayer.setVolume(1)
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

    const handleOnReached = () => {
        if (props.profile.totalCount > props.profile.audioList.length) {
            state.pageNumber = state.pageNumber + 1
            setState({
                ...state
            })
            let payload = {
                "pageNumber": state.pageNumber
            }
            props.dispatch(getAllAudio(payload))
        }
    }

    const handleOpenMusicModal = async (item) => {
        console.log("handleOpenMusicModal", item);
        const payload = {
            "post_id": item._id,
            "post_data": item
        }
        props.dispatch(setSelectedPost(payload))
        TrackPlayer.destroy()
        try {
            await TrackPlayer.reset();
            await TrackPlayer.add({
                id: "local-track",
                url: item.media_url,
                title: item.title,
                artist: item?.artistName ? item?.artistName : item.artistDetails[0].artistName ?
                    item.artistDetails[0].artistName :
                    `${item.artistDetails[0].firstName} ${item.artistDetails[0].lastName}`,
                artwork: item.cover_image
                // duration: 28
            });
            TrackPlayer.setVolume(1)
            let result = await TrackPlayer.getDuration()
            // setTimeout(() => {
            setState({
                ...state,
                showMusicModal: true,
                selectedAudio: item
            })
            // }, 1000)

            return result;
        }
        catch (err) {

        }
    }

    const handleAudioPress = async (audio) => {
        console.log("handleAudioPress");
        let payload = {
            "_id": audio._id,
            "type": 1
        }
        await props.dispatch(trackPost(payload))

        state.isSelectedAudioData = audio
        setState({
            ...state,
            // showMusicModal: true,
        })
        handleOpenMusicModal(audio)
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

    const handleCrossAudioModal = async () => {
        // await TrackPlayer.pause();
        state.showMusicModal = false
        setState({ ...state })
        if (playbackState === TrackPlayer.STATE_PAUSED || playbackState === "ready" || playbackState === "loading" || playbackState === "idle") {
            const payload = {
                showMinimizeAudio: true,
                isPlaying: false,
                audioName: state.selectedAudio.title,
                audioTrack: state.selectedAudio.media_url,
                audioArtistProfile: state.selectedAudio.cover_image,
                audioContent: props.post.selectedPostData
            }
            props.dispatch(setAudioPlayingState(payload))
        } else {
            const payload = {
                showMinimizeAudio: true,
                isPlaying: true,
                audioName: state.selectedAudio.title,
                audioTrack: state.selectedAudio.media_url,
                audioArtistProfile: state.selectedAudio.cover_image,
                audioContent: props.post.selectedPostData
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
                    audioContent: props.post.selectedPostData
                }
                props.dispatch(setAudioPlayingState(payload))
            } else {
                const payload = {
                    showMinimizeAudio: true,
                    isPlaying: true,
                    audioName: state.selectedAudio.title,
                    audioTrack: state.selectedAudio.media_url,
                    audioArtistProfile: state.selectedAudio.cover_image,
                    audioContent: props.post.selectedPostData
                }
                props.dispatch(setAudioPlayingState(payload))
            }
        }

    }

    const handleNavigateToHomeScreen = (data) => {
        props.dispatch(getProfileDataIntoHome(data))
    }

    const renderAudioList = ({ item, index }) => {
        return (
            <View style={{
                marginTop: 10
            }}>
                <Components.AudioListCard
                    image={{
                        uri: item.cover_image != "" ? item.cover_image
                            : constants.AppConstant.bandoLogo,
                        priority: FastImage.priority.high
                    }}
                    title={item.title}
                    genre={item.album}
                    onPress={() => { handleAudioPress(item) }}
                />
            </View>
        )
    }

    const handleMerchBuy = (merch, selectMerchVariant) => {
        props.dispatch(paymentSuccess(true, false, false))
        state.showMusicModal = false
        setState({
            ...state,
            //paymentCardModal: true,
            buyMerchDetail: merch,
            selectMerchVariant: selectMerchVariant
        })
        NavigationService.navigate(constants.ScreensName.Cards.name, {
            merch: merch,
            selectedSize: selectMerchVariant
        })
    }

    const makePayment = (tokenId, cardId) => {

        let payload = {
            tokenId: tokenId,
            merchId: state.buyMerchDetail._id,
            price: state.buyMerchDetail.price_details[0].variations.length > 0 ?
                state.buyMerchDetail.price_details[0].variations[0].price :
                state.buyMerchDetail.price_details[0].price,

            currency:
                state.buyMerchDetail.price_details[0].variations.length > 0 ?
                    state.buyMerchDetail.price_details[0].variations[0].currency :
                    state.buyMerchDetail.price_details[0].currency,

            variation: state.buyMerchDetail.price_details[0].variations.length > 0 ?
                state.buyMerchDetail.price_details[0].variations[state.selectMerchVariant]._id :
                null,
            cardId: cardId
        }

        props.dispatch(buyMerch(payload))
    }

    const requestPayment = (cardDetails, cardId) => {
        if (cardDetails) {
            if (cardDetails.number == "") {
                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: "Please enter your card number",
                    type: "error",
                    position: "top"
                });
                return 1;
            }

            if (cardDetails.expiry == "") {
                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: "Please enter your card expiry date",
                    type: "error",
                    position: "top"
                });
                return 1;
            }

            if (cardDetails.cvc == "") {
                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: "Please enter cvc/cvv",
                    type: "error",
                    position: "top"
                });
                return 1;
            }
            let expireMonth = parseInt(cardDetails.expiry.split("/")[0]);
            let expireYear = parseInt(cardDetails.expiry.split("/")[1]);

            stripe
                .createTokenWithCard({
                    number: cardDetails.number,
                    expMonth: expireMonth,
                    expYear: expireYear,
                    cvc: cardDetails.cvc
                })
                .then(stripeTokenInfo => {
                    makePayment(stripeTokenInfo.tokenId, "")
                })
                .catch(error => {
                    Toast.show({
                        text1: constants.AppConstant.Bando,
                        text2: error.message,
                        type: "error",
                        position: "top"
                    });
                })
                .finally(() => {
                });

        } else if (cardId) {
            makePayment("", cardId)

        } else {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter your card details",
                type: "error",
                position: "top"
            });
            return 1;
        }
    }

    const handleOnSharePost = async (item) => {
        state.multipleClickShareDisabled = true
        setState({
            ...state,
        })
        const payload = {
            "post_id": item._id
        }

        props.dispatch(
            sharePost(
                payload,
                (response) => {
                    if (response != null) {
                        state.multipleClickShareDisabled = false
                        setState({
                            ...state
                        })
                        sharePostModal(response)
                    }


                },
                (error) => {
                    state.multipleClickShareDisabled = false
                    setState({
                        ...state
                    })
                }
            )
        )
    }

    const sharePostModal = async (data) => {
        try {
            const result = await Share.share({
                message:
                    `Hey, Look at this post. ${data}`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    }

    const getAudioVolume = async () => {
        let vol = await TrackPlayer.getVolume()
        console.log("audioMute vol", vol);
        vol === 0 ? handleVideoMuteUnmute(false) : handleVideoMuteUnmute(true)
    }

    const handleVideoMuteUnmute = (value) => {
        videoMute.current = !value
        if (value) {
            TrackPlayer.setVolume(0)
            setState({
                ...state,
                audioMute: true
            })
        } else {
            TrackPlayer.setVolume(1)
            setState({
                ...state,
                audioMute: false
            })
        }
        console.log("videoMute.current", videoMute.current, state.audioMutew);
    }

    const handleShowReply = (item) => {
        if (item.user_id === props.auth.userRegistered._id) {
            const payload = {
                comment_id: item._id
            }
            props.dispatch(getReplyList(payload))
            setState({
                ...state,
                //selectedPostTitle: item.comment,
                showReply: true,
                selectedComment: item._id,
            })
        }

    }

    const renderComment = ({ item, index }) => {
        return (
            <View style={{
                marginTop: 7
            }}>
                <Components.CommentCard
                    profileImage={item.userProfileImage ? item.userProfileImage : constants.AppConstant.bandoLogo}
                    comment={item.comment}
                    date={moment(item.commentedAt).format('DD-MM-YYYY')}
                    isReply={false}
                    replyCount={0}
                    commentorName={`${item.userFirstName} ${item.userLastName}`}
                    showDelete={item.user_id === props.auth.userRegistered._id ? true : false}
                    onPressShowReply={() => {
                        handleShowReply(item)
                    }}
                    onPressDelete={() => {
                        state.showComment = false
                        setTimeout(() => {
                            setState({
                                ...state,
                                selectedCommentToDelete: item,
                                isDeletingComment: true
                            })
                        }, 500);

                        // handleDeleteComment(item)
                    }}
                />
            </View>
        )
    }

    const handleShowComment = async (item, type) => {
        console.log("item", item);
        state.showMusicModal = false
        const payload = {
            post_id: item._id
        }
        await props.dispatch(getCommentList(payload))
        let artistDetail = props.profile.artistDetail[0].artistDeatils
        let firstName = artistDetail ? (artistDetail.firstName ? artistDetail.firstName : '') : '';
        let lastName = artistDetail ? (artistDetail.lastName ? artistDetail.lastName : '') : '';
        let artistName = artistDetail ? (artistDetail.artistName ? artistDetail.artistName : "") : '';
        let profileImage = artistDetail.profileImage ? artistDetail.profileImage : constants.AppConstant.bandoLogo;
        console.log("complete0");
        setTimeout(() => {
            setState({
                ...state,
                selectedCommentArtistId: item.artistId,
                selectedPost: item._id,
                commentArray: item.comments,
                selectedPostTitle: (artistName ? artistName : `${firstName} ${lastName}`),
                //item.title,
                showComment: true,
                selectedCommentArtistImage: profileImage,
                selectedCommentArtistName: (artistName ? artistName : `${firstName} ${lastName}`)
            });
            console.log("complete2");
        }, 300);
        console.log("complete1");
    }

    const handleDeleteComment = async (item) => {

        const payload = {
            "comment_id": item._id,
            "post_id": state.selectedPost
        }
        await props.dispatch(deleteParticularComment(payload))
        state.isDeletingComment = false
        setTimeout(() => {
            setState({
                ...state,
                showComment: true,
            })
        }, 300);
    }

    const handleCommentToPost = () => {
        let addNewcomment = state.comment.replace(/^\s+|\s+$/g, '')
        Keyboard.dismiss()
        if (addNewcomment.length < 1) {
            return 1;
        }
        const payload = {
            "post_id": state.selectedPost,
            "comment": addNewcomment
        }
        props.dispatch(CommentOnPost(payload))
        setState({
            ...state,
            comment: "",
            isCommenting: false
        })
    }

    const renderReply = ({ item, index }) => {
        return (
            <>
                <View
                    style={{
                        width: "90%",
                        alignSelf: (item.commentBy === "user" ? "flex-end" : "flex-start"),
                        alignItems: (item.commentBy === "user" ? "flex-end" : "flex-start"),
                    }}
                >
                    <Components.ReplyCard
                        time={moment(item.commentedAt).format('DD/MM/YY HH:mm')}
                        reply={item.comment}
                        profileImage={item.commentBy === "user" ? null :
                            (item.userProfileImage ? item.userProfileImage : constants.AppConstant.bandoLogo)
                        }
                        alignContent={(item.commentBy === "user" ? "flex-end" : "flex-start")}
                        backgroundColor={item.commentBy === "artist" ? "#fff" : "#000"}
                        textColor={item.commentBy === "artist" ? "#000" : "#fff"}
                        textAlign={item.commentBy === "artist" ? "left" : "right"}
                    />
                </View>
            </>
        )
    }

    const handleReplyToComment = () => {
        let comment = state.reply.replace(/^\s+|\s+$/g, '')
        // Keyboard.dismiss()
        if (comment.length < 1) {
            return 1;
        }
        const payload = {
            "post_id": state.selectedPost,
            "parent_id": state.selectedComment,
            "comment": comment,
        }
        props.dispatch(ReplyOnComment(payload))
        setState({
            ...state,
            reply: ""
        })
    }

    const renderListEmptyComment = () => {
        return (
            <View style={{
                flex: 1,
                marginTop: constants.vh(150),
            }}>
                <Components.NoPostFound
                    title="No comments yet."
                />
            </View>

        )
    }

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                <View style={styles.dataContainer}>
                    <View style={styles.headerWithICon}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => props.navigation.goBack()}
                        >
                            <FontAwesome
                                name="chevron-left"
                                size={25}
                                color={constants.Colors.white}
                            />

                        </TouchableOpacity>
                        <View style={[styles.headerImageConainer, { borderRadius: constants.vh(33) / 2 }]}>
                            <FastImage
                                style={styles.headerImageConainer}
                                source={
                                    props.auth?.userRegistered?.profileImage != null ?
                                        {
                                            uri: props.auth?.userRegistered?.profileImage,
                                            priority: FastImage.priority.high
                                        }
                                        : {
                                            uri: constants.AppConstant.bandoLogo,
                                            priority: FastImage.priority.high
                                        }}
                                resizeMode={FastImage.resizeMode.cover}
                                onLoadStart={() => { }}
                                onProgress={(e) => { }}
                                onLoad={(e) => { }}
                            />
                        </View>

                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.text35bold}>{props.profile?.audioList.length > 1 ? 'Audios' : 'Audio'}</Text>
                    </View>

                    <View style={styles.listContainer}>
                        <FlatList
                            data={props.profile?.audioList}
                            renderItem={renderAudioList}
                            keyExtractor={(item, index) => index.toString()}
                            onEndReached={handleOnReached}
                            onEndReachedThreshold={0.5}
                        />
                    </View>
                </View>
                <Components.ProgressView
                    isProgress={props.profile.isLoading}
                    title={constants.AppConstant.Bando}
                />
                <Components.AudioMinimize
                    onPressShare={() => debounce(() => handleOnSharePost(props.post?.selectedPostData))}
                    onPressComment={() => { handleShowComment(props.post?.selectedPostData, "audio") }}
                />
            </SafeAreaView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={state.showMusicModal}
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
                                        onPress={() => showArtistDetail(props.profile.idOfArtist)}>
                                        <Image

                                            source={{
                                                uri: props.profile.artistDetail != null ?
                                                    (props.profile.artistDetail[0].artistDeatils.profileImage ? props.profile.artistDetail[0].artistDeatils.profileImage : constants.AppConstant.bandoLogo) :
                                                    constants.AppConstant.bandoLogo
                                            }}

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
                                            onPress={() => showArtistDetail(props.profile.idOfArtist)}>
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
                                                    props.profile.artistDetail != null ? (props.profile.artistDetail[0].artistDeatils.artistName ? props.profile.artistDetail[0].artistDeatils.artistName : props.profile.artistDetail[0].artistDeatils.firstName + " " + props.profile.artistDetail[0].artistDeatils.lastName) : ""
                                                }
                                            </Text>
                                        </TouchableOpacity>
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
                                        <FastImage
                                            style={styles.cover}
                                            source={{
                                                uri: props.post?.selectedPostData?.cover_image,
                                                priority: FastImage.priority.high
                                            }}
                                            resizeMode={FastImage.resizeMode.cover}
                                            onLoadStart={() => { }}
                                            onProgress={(e) => { }}
                                            onLoad={(e) => { }}
                                        />
                                    </View>
                                    <View style={styles.postActionButton}>
                                        <Components.PostActionButton
                                            isLiked={props.post?.selectedPostData?.isLiked}
                                            onPressLikeUnlike={() => handleLikeUnlikePost()}
                                            onPressShare={() => debounce(() => handleOnSharePost(props.post?.selectedPostData))}
                                            // muted={videoMute.current}
                                            // onPressMuteUnmute={() => {
                                            //     getAudioVolume()
                                            // }}
                                            onPressComment={() => { handleShowComment(props.post?.selectedPostData, "audio") }}
                                        />
                                    </View>
                                    <Text style={styles.audioTitle}>{props.post.selectedPostData?.title}</Text>
                                    <Text style={styles.albumText}>{props.post.selectedPostData?.album ? ("Album - " + state.isSelectedAudioData?.album) : ""}</Text>
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
                                    {props.post.selectedPostData?.description}
                                </Text>
                            </View>
                            {
                                props.post.selectedPostData?.merchandise.length > 0 &&
                                <View style={styles.merchandiseContainerModal}>
                                    <Text style={[styles.text18500, { color: constants.Colors.white }]}>Merchandise</Text>
                                    <Components.CountCard
                                        count={state?.isSelectedAudioData?.merchandise.length > 0 ? state?.isSelectedAudioData?.merchandise.length : 0}
                                    />
                                </View>
                            }

                            <View style={{ width: "100%" }}>
                                {
                                    props.post.selectedPostData?.merchandise.length > 0 ?
                                        <Components.MerchandiseSlider
                                            images={props.post.selectedPostData?.merchandise}
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


            {/* card Modal */}

            <Modal
                visible={state.paymentCardModal && props.home.cardModal}
                animationType="slide"
                transparent={true}
                marginHorizontal={0}
                marginBottom={0}
            >
                <View style={[styles.carPaymentModal, {
                    // marginTop: constants.vh(293)
                }]}>
                    {/* <KeyboardAwareScrollView
                        extraHeight={-100}
                        keyboardOpeningTime={10}
                        style={{ flex: 1, width: "100%" }}
                    > */}
                    <View style={{
                        // borderRadius: 15,
                        // position: "absolute",
                        // width: "100%",
                        // height: constants.vh(610),
                        // backgroundColor: 'black',
                        // marginTop: constants.vh(210),
                        borderRadius: 15,
                        //position: "absolute",
                        width: "100%",
                        height: constants.vh(610),
                        backgroundColor: 'black',
                        marginTop: constants.vh(200),
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                state.paymentCardModal = false
                                setState({
                                    ...state,
                                })
                            }}
                            activeOpacity={1}
                            hitSlop={styles.hitSlop}
                            style={[styles.headerCrossContainerSubscription, {
                                backgroundColor: "rgba(255,255,255,0.51)",
                                alignSelf: "flex-end",
                            }]}>

                            <AntDesign
                                name="close"
                                color={constants.Colors.white}
                                size={18}
                            />

                        </TouchableOpacity>
                        <View style={{
                            width: WIDTH,
                            alignSelf: "center",
                            marginTop: 10
                        }}>
                            <Components.PaymentSliderFlatList
                                cardList={props.auth.purchaseCardList}
                                handlePayment={(cardDetails, cardId) => requestPayment(cardDetails, cardId)}
                            />
                        </View>
                    </View>
                    {/* </KeyboardAwareScrollView> */}
                </View>
                <Components.ProgressView
                    isProgress={props.home.isLoading}
                    title={constants.AppConstant.Bando}
                />
            </Modal>



            {/* payment success modal */}
            {props.home.buyMerch != null ? <Modal
                visible={props.home.thankModal}
                animationType="slide"
                transparent={true}
            >
                <LinearGradient
                    colors={['rgb(47,46,48)', 'rgb(20,20,35)']}
                    style={{
                        flex: 1,
                        marginTop: constants.vh(300),
                        height: "50%",
                        borderRadius: 10,
                    }}
                >
                    <View
                    >

                        <View style={{

                            borderRadius: 15,
                            position: "absolute",
                            width: "100%"
                        }}>

                            <ImageBackground
                                source={constants.Images.BlueEllipses}
                                style={{
                                    width: "100%",
                                    // height:constants.vh(200),
                                    height: constants.vh(400),
                                    // marginTop: constants.vh(50),
                                    justifyContent: 'center',
                                    resizeMode: "stretch",
                                    alignSelf: "center",
                                }}
                            >
                                <View style={[styles.headerCrossContainerSubscription, {
                                    backgroundColor: "rgba(255,255,255,0.51)",
                                    alignSelf: "flex-end",
                                }]}>

                                    <AntDesign
                                        name="close"
                                        color={constants.Colors.white}
                                        size={18}
                                        onPress={() => {
                                            props.dispatch(paymentSuccess(false, false, true))
                                        }}
                                    />

                                </View>
                                <View style={{ alignSelf: "center" }}>
                                    <Image
                                        source={constants.Images.paymentThankLogo}
                                        resizeMode={"contain"}
                                    />

                                </View>
                                <View style={{ alignSelf: "center", marginTop: constants.vh(31) }}>
                                    <Text style={styles.text40700}>Thank you</Text>


                                </View>
                                <View style={{ alignSelf: "center" }}>
                                    <Text style={styles.text16400}>{constants.ConstStrings.paymentSuccess}</Text>
                                </View>

                            </ImageBackground>


                            <View style={{
                                width: "90%", alignSelf: "center",
                                // marginTop:constants.vh(111)
                            }}>
                                <Components.PrimaryButton
                                    title="Close"
                                    backgroundColor={constants.Colors.color_FF3062}
                                    onPress={() => {
                                        props.dispatch(paymentSuccess(false, false, true))
                                    }}
                                />
                            </View>




                        </View>

                    </View>
                </LinearGradient>
            </Modal> : null}

            {/* ALERT FOR REPORTED COMMENT */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.home.isReported}
            >
                <View
                    style={styles.modalMain}
                >
                    <View style={styles.modalSecondry}>
                        {/* <Text style={{
                                fontSize: 23,
                                fontWeight: "bold",
                                color: "#fff"
                            }}>Delete Post?</Text> */}
                        <Text
                            style={styles.text16C4C4C4}
                        >The post was</Text>
                        <Text
                            style={styles.text16C4C4C4}
                        > reported!</Text>

                    </View>
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => props.dispatch(handleIsReported())}
                            style={[styles.modalButton, { width: "100%" }]}
                        >
                            <Text style={styles.text16white}>OK</Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </Modal>

            {/* MODAL OF COMMENT */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={state.showComment}
            >

                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        setState({
                            ...state,
                            showComment: false,
                            showReply: false
                        })
                        Keyboard.dismiss()
                    }}
                    style={styles.modalCommentMain}
                >
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps="handled"
                        enableOnAndroid={false}
                        extraHeight={150}
                        keyboardOpeningTime={10}
                        style={{ flex: 1, width: "100%", }}
                    >

                        <TouchableOpacity
                            onPress={() => {
                                // props.dispatch(clearReplyList())
                                // props.dispatch(clearCommentList())
                                Keyboard.dismiss()
                            }}
                            activeOpacity={1}
                            style={[styles.modalCommentSecondry, {
                                marginTop: constants.vh(200)
                            }]}>
                            <View
                                style={{
                                    width: "20%",
                                    height: 5,
                                    backgroundColor: constants.Colors.color_232323,
                                    borderRadius: 20,
                                    alignSelf: "center"
                                }}
                            />
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    paddingVertical: constants.vh(20),
                                }}
                            >
                                <View
                                    style={{
                                        width: "90%",
                                        flexDirection: "row",
                                        alignItems: "center",

                                    }}
                                >
                                    {
                                        state.isCommenting &&
                                        <TouchableOpacity
                                            onPress={() => {
                                                state.isCommenting = false
                                                setState({
                                                    ...state
                                                })
                                            }}
                                            activeOpacity={1}
                                            hitSlop={styles.hitSlop}
                                        >
                                            <AntDesign
                                                name="left"
                                                size={30}
                                                color="#fff"
                                            />
                                        </TouchableOpacity>
                                    }
                                    {
                                        state.showReply &&
                                        <TouchableOpacity
                                            onPress={() => {
                                                state.showReply = false;
                                                props.dispatch(clearReplyList())
                                                setState({
                                                    ...state
                                                })
                                            }}
                                            activeOpacity={1}
                                            hitSlop={styles.hitSlop}
                                        >
                                            <AntDesign
                                                name="left"
                                                size={30}
                                                color="#fff"
                                            />
                                        </TouchableOpacity>
                                    }
                                    <View style={{ width: "90%" }}>
                                        <Text
                                            // numberOfLines={1}
                                            style={{
                                                fontSize: 18,
                                                fontWeight: "500",
                                                color: "#F0F0F0",
                                                // paddingVertical: constants.vh(20),
                                                // textTransform: 'capitalize',
                                                marginStart: (state.isCommenting || state.showReply) ? constants.vw(15) : 0
                                            }}>{state.showReply ? state.selectedPostTitle : (state.isCommenting ? "Add Comment" : "Comments")}</Text>

                                    </View>

                                </View>

                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.crossIconContainer}>
                                    <Entypo
                                        onPress={() => {
                                            props.dispatch(clearReplyList());
                                            props.dispatch(clearCommentList());
                                            setState({
                                                ...state,
                                                showComment: false,
                                                isCommenting: false,
                                                showReply: false
                                            })
                                        }}
                                        // onPress={() => {
                                        //     state.showReply = false;
                                        //     props.dispatch(clearReplyList())
                                        //     setState({
                                        //         ...state
                                        //     })
                                        // }}
                                        name="cross"
                                        color={constants.Colors.white}
                                        size={25}
                                    />
                                </TouchableOpacity>
                            </View>
                            {
                                !state.showReply && !state.isCommenting &&
                                <>
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        alignItems: "center"
                                    }}>
                                        <TouchableOpacity
                                            onPress={() => { showArtistDetail(state.selectedCommentArtistId) }}
                                        >

                                            <Image
                                                source={{ uri: state.selectedCommentArtistImage }}
                                                style={{
                                                    width: constants.vw(50),
                                                    height: constants.vw(50),
                                                    borderRadius: constants.vw(50 / 2),
                                                    resizeMode: "cover"
                                                }}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            onPress={() => {
                                                props.dispatch(clearReplyList());
                                                props.dispatch(clearCommentList());
                                                showArtistDetail(state.selectedCommentArtistId)
                                            }}
                                        >
                                            <Text style={[styles.text25bold, { textTransform: "capitalize" }]}>{state.selectedCommentArtistName}</Text>

                                        </TouchableOpacity>
                                    </View>
                                    <View
                                        style={{
                                            marginTop: constants.vh(31),
                                            flex: 1
                                        }}
                                    >
                                        <FlatList
                                            data={props.post.commentList}
                                            renderItem={renderComment}
                                            keyExtractor={(item, index) => index.toString()}
                                            showsVerticalScrollIndicator={false}
                                            ListEmptyComponent={renderListEmptyComment}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => {
                                            setState({
                                                ...state,
                                                isCommenting: true
                                            })
                                        }}
                                        style={{
                                            width: constants.vw(59),
                                            height: constants.vw(59),
                                            borderRadius: constants.vw(59 / 2),
                                            justifyContent: "center",
                                            alignItems: "center",
                                            backgroundColor: constants.Colors.color_FF005C,
                                            alignSelf: "flex-end"
                                        }}
                                    >
                                        <AntDesign
                                            name="plus"
                                            size={30}
                                            color={constants.Colors.white}
                                        />
                                    </TouchableOpacity>
                                </>
                            }
                            {
                                state.showReply &&
                                <>
                                    <View
                                        style={{
                                            marginTop: constants.vh(31),
                                            flex: 1
                                        }}
                                    >
                                        <FlatList
                                            inverted
                                            data={props.post.replyList}
                                            showsVerticalScrollIndicator={false}
                                            renderItem={renderReply}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                        <View
                                            style={{
                                                marginTop: 10,
                                            }}
                                        >
                                            <Components.SendReplyInputConsumer
                                                value={state.reply}
                                                onChangeText={(reply) => {
                                                    // if (reply.length < 401) {
                                                    setState({
                                                        ...state,
                                                        reply: reply
                                                    })
                                                    // }
                                                }}
                                                showSpeaker={true}
                                                onPressSend={handleReplyToComment}
                                            //onSubmitEditing={handleReplyToComment}
                                            //autoFocus
                                            />
                                        </View>
                                    </View>
                                </>
                            }
                            {
                                state.isCommenting &&
                                <>

                                    <View
                                        style={{
                                            position: "absolute",
                                            bottom: 10,
                                            width: "100%",
                                            marginHorizontal: 15,
                                        }}
                                    >

                                        <Components.SendReplyInputConsumer
                                            placeholder={"Type something..."}
                                            value={state.comment}
                                            onChangeText={(comment) => {
                                                // if (comment.length < 401) {
                                                setState({
                                                    ...state,
                                                    comment: comment
                                                })
                                                // }
                                            }}
                                            showSpeaker
                                            //onSubmitEditing={handleCommentToPost}
                                            onPressSend={handleCommentToPost}
                                        //autoFocus
                                        />
                                    </View>
                                </>
                            }

                        </TouchableOpacity>
                    </KeyboardAwareScrollView>
                </TouchableOpacity>
            </Modal>

            {/* ALERT FOR DELETE COMMENT */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={state.isDeletingComment}
            >
                <View
                    style={[styles.modalMain]}
                >
                    <View style={styles.modalSecondry}>
                        <Text style={styles.text23white}>Delete Comment?</Text>
                        <Text
                            style={styles.text16C4C4C4}
                        >You sure you want to</Text>
                        <Text
                            style={styles.text16C4C4C4}
                        >delete this comment?</Text>

                    </View>
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => handleDeleteComment(state.selectedCommentToDelete)}
                            style={styles.modalButton}
                        >
                            <Text
                                style={[styles.text16white, {
                                    color: "#FF4F4F",
                                }]}
                            >Delete</Text>
                        </TouchableOpacity>
                        <View
                            style={{
                                paddingVertical: constants.vh(28),
                                width: 2,
                                backgroundColor: "rgba(84, 84, 88, 0.65)"
                            }}
                        />
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                state.isDeletingComment = false
                                setTimeout(() => {
                                    setState({
                                        ...state,
                                        showComment: true,
                                    })
                                }, 300);

                            }}
                            style={styles.modalButton}
                        >
                            <Text
                                style={styles.text16white}
                            >Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

        </>
    )
}

function mapStateToProps(state) {
    let { post, profile, home, auth } = state;
    return {
        post, profile, home, auth
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AudioList);