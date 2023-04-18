import React, { createRef, useEffect, useState } from 'react';
import {
    SafeAreaView,
    StatusBar,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Modal,
    ScrollView,
    Image,
    ImageBackground,
    Dimensions,
    Keyboard,
    Share
} from 'react-native';
import {
    setArtistID, getArtistDetail, getConsumerProfile,
    handleClickArtistDetail
} from '../../../actions/profile';
import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import VideoPlayer from '../../../components/AddVideoPost/react-native-video-controls/VideoPlayer';
import { getProfileDataIntoHome, viewAllMedia, getAllVideo } from '../../../actions/profile'
import { buyMerch, paymentSuccess } from '../../../actions/home';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import { CreditCardInput } from "react-native-credit-card-input";
import stripe from 'tipsi-stripe';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import TrackPlayer, {
    usePlaybackState,
    useTrackPlayerProgress, useTrackPlayerEvents
} from "react-native-track-player";
import FastImage from 'react-native-fast-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import Orientation from 'react-native-orientation-locker';

import * as NavigationService from '../../../navigation/NavigationService';
import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import { setAudioPlayingState, reSetAudioPlayingState } from '../../../actions/audioMinimize';
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
    clearCommentList,
    deletePost,
} from '../../../actions/post';
import {
    getPaymentCardsList,
} from '../../../actions/auth';
import { handlePaymentLoader } from '../../../actions/home';
import { downloadFile } from '../../../utils/DownloadVideo';
import { useDebounce } from '../../../utils/multipleClick';

const WIDTH = Dimensions.get("window").width;
const VideoList = (props) => {
    const actionSheetRef = createRef();
    const { debounce } = useDebounce();
    const [videoUri, setVideoUri] = useState("")
    const [state, setState] = React.useState({
        selectedPost: null,
        showVideoModal: false,
        isSelectedVideoData: null,
        deleteAlert: false,
        pageNumber: 1,
        paymentCardModal: false,
        thankModalState: true,
        buyMerchDetail: null,
        selectMerchVariant: 0,
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
        selectedCommentArtistName: "",
    })
    useEffect(() => {
        let payload = {
            "pageNumber": state.pageNumber
        }
        props.dispatch(getAllVideo(payload))
        props.dispatch(getPaymentCardsList())
        const subscribeOnFocus = props.navigation.addListener('focus', () => {
            if (props.route.params?.notificationData) {
                console.log("trigger focus handleVideoPress");
                handleVideoPress(props.route.params?.notificationData)
            }
            setState({
                ...state,
                shouldVideoPaused: false
            })
        });
        const unsubscribeOnBlur = props.navigation.addListener('blur', () => {
            setState({
                ...state,
                showVideoModal: false,
                showComment: false,
                isDeletingComment: false,
                shouldVideoPaused: true
            })
        });
        return () => {
            subscribeOnFocus;
            unsubscribeOnBlur;
        };
    }, [])

    const handleLikeUnlikePost = () => {
        if (!props.home.multipleClickDisabled) {
            props.dispatch(handlePaymentLoader(true))
            if (props.post.selectedPostData.isLiked === false) {
                const payload = {
                    "post_id": props.post.selectedPostData._id,
                    "status": "like",
                    "type": "viewAllVideo"
                }
                props.dispatch(likeOnPost(payload))
            } else {
                const index = props.post.selectedPostData.likes.findIndex(data => data.user_id === props.auth.userRegistered._id);
                const payload = {
                    "likeId": props.post.selectedPostData.likes[index]._id,
                    "postId": props.post.selectedPostData._id,
                    "type": "viewAllVideo"
                }
                props.dispatch(unlikeOnPost(payload))
            }
        }
    }

    const handleVideoPress = async (video) => {
        downloadFile(video.media_url).then(res => {
            if (res) {
                setVideoUri(res)
                let videos = {
                    ...video,
                    media_url: res,
                    chunk_url: res
                }
                const payload = {
                    "post_id": video._id,
                    "post_data": videos,
                }
                props.dispatch(setSelectedPost(payload))
                let data = {
                    "_id": video._id,
                    "type": 2
                }
                props.dispatch(trackPost(data))
                TrackPlayer.reset()
                TrackPlayer.destroy()
                props.dispatch(reSetAudioPlayingState())
                state.isSelectedVideoData = videos
                setState({
                    ...state,
                    showVideoModal: true,

                })
            } else {
                if (video.chunk_url) {
                    setVideoUri(video.chunk_url)
                } else {
                    setVideoUri(video.media_url)
                }
                const payload = {
                    "post_id": video._id,
                    "post_data": video,
                }
                props.dispatch(setSelectedPost(payload))
                let data = {
                    "_id": video._id,
                    "type": 2
                }
                props.dispatch(trackPost(data))
                TrackPlayer.reset()
                TrackPlayer.destroy()
                props.dispatch(reSetAudioPlayingState())
                state.isSelectedVideoData = video
                setState({
                    ...state,
                    showVideoModal: true,

                })
            }
        })

    }

    const handleCrossVideoModal = () => {

        setState({ ...state, showVideoModal: false })
    }

    const handleOpenMusicModal = async (item) => {
        setState({
            ...state,
            showMusicModal: true
        })

    }

    const renderVideoList = ({ item, index }) => {
        return (
            <View style={{
                marginTop: 10
            }}>
                <Components.VideoListCard
                    image={{
                        uri: item?.posterFrame ? item?.posterFrame
                            : constants.AppConstant.bandoLogo,
                        priority: FastImage.priority.high
                    }}
                    duration={item.media_duration}
                    title={item.title}
                    views={item.view}
                    onPress={() => handleVideoPress(item)}
                    onPressIcon={() => handleVideoPress(item)}
                />
            </View>

        )
    }

    const handleEdit = () => {
        handleActionSheet(false)
    }

    const handleThreeDotPress = (item) => {
        handleActionSheet(true)
        state.selectedPost = item
        setState({
            ...state,
        })
    }

    const handleDeletePost = () => {
        const payload = {
            "post_id": state.selectedPost
        }
        props.dispatch(deletePost(payload))
        setState({
            ...state,
            deleteAlert: false,
        })
        let data = {
            "media_type": "video"
        }
        props.dispatch(viewAllMedia(data))
    }

    const handleActionSheet = (value) => {
        actionSheetRef.current?.setModalVisible(value);
    }

    const handleOpenDelete = async () => {
        await handleActionSheet(false)
        // state.deleteAlert = true
        if (Platform.OS === "ios") {
            setTimeout(() => {
                setState({
                    ...state,
                    deleteAlert: true
                })
            }, 500);
        } else {
            setState({
                ...state,
                deleteAlert: true
            })
        }
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

    const handleOnReached = async () => {
        if (props.profile.totalCount > props.profile.videoList.length) {
            state.pageNumber = state.pageNumber + 1
            setState({
                ...state
            })
            let payload = {
                "pageNumber": state.pageNumber
            }
            props.dispatch(getAllVideo(payload))
        }
    }

    const handleMerchBuy = (merch, selectMerchVariant) => {
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
        state.showVideoModal = false
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
                    <View style={styles.titleContainer}>
                        <Text style={styles.text35bold}>{props.profile.videoList.length > 1 ? 'Videos' : 'Video'}</Text>
                    </View>

                    <View style={styles.listContainer}>
                        <FlatList
                            data={
                                props.profile.videoList}
                            renderItem={renderVideoList}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
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
            {state.showVideoModal &&
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={state.showVideoModal}
                >

                    <ScrollView
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            flex: 1,
                            zIndex: 2
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
                                    paddingTop: constants.vh(16),
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

                                                }}
                                                    numberOfLines={2}
                                                >
                                                    {props.profile.artistDetail != null ? (props.profile.artistDetail[0].artistDeatils.artistName ? props.profile.artistDetail[0].artistDeatils.artistName : props.profile.artistDetail[0].artistDeatils.firstName + " " + props.profile.artistDetail[0].artistDeatils.lastName) : ""}
                                                </Text>
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

                                <View style={[styles.card, { flex: 1 }]}>
                                    <VideoPlayer
                                        source={
                                            videoUri.includes(".m3u8") ?
                                                {
                                                    uri: videoUri,
                                                    type: "m3u8"
                                                } :
                                                { uri: videoUri }
                                        }
                                        aspectType={state.isSelectedVideoData?.aspectRatioType}
                                        // source={
                                        //     props.post.selectedPostData?.chunk_url ?
                                        //         {
                                        //             uri: props.post.selectedPostData.chunk_url,
                                        //             type: "m3u8"
                                        //         } :
                                        //         { uri: props.post.selectedPostData?.media_url }
                                        // }
                                        // controls={true}
                                        seekColor={"red"}
                                        paused={state.shouldVideoPaused}
                                        hideShutterView={true}
                                        poster={
                                            props.post.selectedPostData?.posterFrame ?
                                                props.post.selectedPostData?.posterFrame :
                                                constants.AppConstant.bandoLogo
                                        }
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
                                        isLiked={props.post?.selectedPostData?.isLiked}
                                        onPressLikeUnlike={() => handleLikeUnlikePost()}
                                        onPressShare={() => debounce(() => handleOnSharePost(props.post?.selectedPostData))}
                                        onPressComment={() => { handleShowComment(props.post?.selectedPostData, "video") }}
                                        onPressFullScreen={(currentTime) => {
                                            setState({
                                                ...state,
                                                showVideoModal: false
                                            })
                                            NavigationService.navigate(constants.ScreensName.VideoPlayer.name, {
                                                url: videoUri,
                                                initialPlayed: currentTime,
                                                posterFrame: props.post.selectedPostData?.posterFrame ? props.post.selectedPostData.posterFrame : constants.AppConstant.bandoLogo
                                            })
                                        }}
                                        muted={false}
                                    />


                                </View>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: "100%", alignItems: "center", marginTop: constants.vh(27)
                                }}>

                                    <Text style={[styles.audioTitle, { width: "50%" }]}>{props.post.selectedPostData?.title}</Text>
                                    {/* <TouchableOpacity
                                        hitSlop={styles.hitSlop}
                                        activeOpacity={1}
                                        onPress={() => handleLikeUnlikePost()}
                                        style={{ marginEnd: 10 }}>

                                        <Image
                                            source={props.post?.selectedPostData?.isLiked ?
                                                constants.Images.Liked :
                                                constants.Images.Unliked
                                            }
                                        />

                                    </TouchableOpacity> */}
                                </View>

                                <View style={{ marginTop: constants.vh(28), width: "100%" }}>
                                    <Text style={styles.text16400}>{props.post.selectedPostData.description}</Text>
                                </View>
                                {props.post.selectedPostData?.merchandise.length > 0 &&
                                    < View style={styles.merchandiseContainerModal}>
                                        <Text style={[styles.text18500, { color: constants.Colors.white }]}>Merchandise</Text>
                                        <Components.CountCard
                                            count={props.post.selectedPostData?.merchandise.length}
                                        />
                                    </View>
                                }

                                <View style={{ width: "100%" }}>
                                    {props.post.selectedPostData?.merchandise.length > 0 ?
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
                                        /> : <View style={{ height: constants.vh(300) }} />}
                                </View>
                            </LinearGradient>
                        </View>
                    </ScrollView>
                </Modal >
            }


            {/* card Modal */}

            <Modal
                visible={state.paymentCardModal && props.home.cardModal}
                animationType="slide"
                transparent={true}
            >
                <View style={[styles.carPaymentModal, {
                }]}>
                    <View style={{

                        borderRadius: 15,
                        position: "absolute",
                        width: "100%",
                        height: constants.vh(610),
                        backgroundColor: 'black',
                        marginTop: constants.vh(200),
                    }}>
                        <View style={[styles.headerCrossContainerSubscription, {
                            backgroundColor: "rgba(255,255,255,0.51)",
                            alignSelf: "flex-end",
                        }]}>

                            <AntDesign
                                name="close"
                                color={constants.Colors.white}
                                size={18}
                                onPress={() => {
                                    setState({
                                        ...state,
                                        paymentCardModal: false
                                    })
                                }}
                            />

                        </View>
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
                </View>
                <Components.ProgressView
                    isProgress={props.home.isLoading}
                    title={constants.AppConstant.Bando}
                />
            </Modal>



            {/* payment success modal */}
            {
                props.home.buyMerch != null ? <Modal
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
                </Modal> : null
            }

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
    let { auth, post, profile, home } = state;
    return {
        auth, post, profile, home
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoList);