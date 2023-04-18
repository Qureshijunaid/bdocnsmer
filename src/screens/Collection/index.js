import React, { useEffect, useState, useRef, createRef, useCallback } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StatusBar,
    FlatList,
    Dimensions,
    Share,
    Modal,
    TouchableOpacity,
    Image,
    Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import TrackPlayer, { useTrackPlayerProgress } from "react-native-track-player";
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';

import constants from '../../constants';
import Components from '../../components';
import * as NavigationService from '../../navigation/NavigationService';
import { styles } from './styles';
import {
    getRecommendedFeed, getTrendingFeed,
    getMyFeed, getNotification, viewNotification,
    clearNotificationDataWhenToggle, reportPost, handleIsReported,
    handlePaymentLoader
} from '../../actions/home';
import {
    setArtistID, getArtistDetail, getArtistDetailHomePage,
    getArtistDetailCollectionPage
} from '../../actions/profile';
import {
    getCommentList,
    CommentOnPost,
    getReplyList,
    ReplyOnComment,
    deleteParticularComment,
    likeOnPost,
    unlikeOnPost,
    sharePost,
    trackPost,
    setSelectedPost,
    clearReplyList,
    clearCommentList
} from '../../actions/post';
import VideoPlayer from '../../components/VideoPostHome/react-native-video-controls/VideoPlayer';
import { AudioPost } from '../../components/AudioPost';
import { ImagePost } from "../../components/ImagePost";
import { reSetAudioPlayingState } from '../../actions/audioMinimize';
import { useDebounce } from '../../utils/multipleClick'
import { downloadFile } from '../../utils/DownloadVideo';
import { getCollectionList, getCollectionDetails } from "../../actions/collection";
import { vh } from '../../constants/Dimension';

const HEIGHT = Dimensions.get("window").height

const Collection = (props) => {
    const { debounce } = useDebounce();
    const cureentDateTime = new Date().toISOString()
    var actionSheetRef = createRef();
    const videoMute = React.useRef(false)
    const [selectVideoTrack, setSelectedVideTrack] = useState({
        type: "resolution",
        value: 360
    })
    const [multipleClickLike, setMultipleClickLike] = useState(false)
    const [state, setState] = useState({
        pageNumber: 1,
        pageNumberNotificationRead: 1,
        pageNumberNotificationUnRead: 1,
        isRefreshing: false,
        showStats: true,
        feed: false,
        recommended: false,
        trending: props.route.params != undefined ? props.route.params.payload : true,
        myFeedPageNumber: 1,
        recommendedPageNumber: 1,
        trendingPageNumber: 1,
        showNotification: false,
        selectedCommentArtistImage: null,
        selectedCommentArtistName: "",
        notificationRead: false,
        reportAlert: false,
        reportPostCancelAlert: false,
        confirmReportPostAlert: false,
        multipleClickDisabled: false,
        multipleClickShareDisabled: false,
        isVideoMute: false,
        audioMute: false,
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
    });
    const [likeData, setLikeData] = useState({})
    const [videoUri, setVideoUri] = useState("")
    const [videoIndex, setVideoIndex] = useState(0);
    const { position, duration } = useTrackPlayerProgress(1000, null)
    let paramsList = useRef();
    const videoPlayerRef = useRef(false);
    const videoUrl = useRef("");
    const videoUrlIndex = useRef(0);

    useEffect(() => {

        audioSetup();
        props.navigation.addListener('focus', focusHandler)
        const unsubscribe = props.navigation.addListener('blur', () => {
            TrackPlayer.reset()
            TrackPlayer.destroy()
            videoPlayerRef.current = true;
            videoUrlIndex.current = 0;
            videoUrl.current = "";
            setState({
                ...state,
                reportPostCancelAlert: false,
                reportAlert: false,
                showComment: false,
                showNotification: false,
            })
        });
        return () => {
            unsubscribe;
            props.navigation.removeListener('focus', focusHandler)
        };
    }, []);

    const focusHandler = () => {
        state.multipleClickDisabled = false
        state.multipleClickShareDisabled = false
        setState({
            ...state
        })

        if (props.route.params != undefined) {
            setState({
                ...state,
                trending: true,
                recommended: false,
                feed: false,

            });
        }
        handleVideoMuteUnmute(videoMute.current)

    }

    async function audioSetup() {
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

    const handleOnReachedMyFeed = async () => {
        if (props.home.myFeedTotalCount > props.home.myFeed.length) {
            state.myFeedPageNumber = state.myFeedPageNumber + 1
            setState({
                ...state
            })
            let payload = {
                "pageNumber": state.myFeedPageNumber
            }
            await props.dispatch(getMyFeed(payload));
        }
    }

    const handleGetMyFeed = async () => {
        setState({
            ...state,
            myFeedPageNumber: 1
        })
        TrackPlayer.reset();
        props.dispatch(reSetAudioPlayingState())
        let payload = {
            "pageNumber": 1
        }
        await props.dispatch(getMyFeed(payload));
    }

    const showArtistDetail = (data) => {
        state.multipleClickDisabled = true
        setState({
            ...state
        })
        if (state.multipleClickDisabled) {
            props.dispatch(setArtistID(data))

            props.dispatch(getArtistDetailHomePage(data, true, null, true))
        }

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
                        state.showComment = false;
                        // props.dispatch(clearReplyList());
                        props.dispatch(clearCommentList());
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

    const handleShowComment = async (item) => {
        console.log("item", item);
        const payload = {
            post_id: item._id
        }
        await props.dispatch(getCommentList(payload))
        let firstName = item.artistDetails ? (item.artistDetails[0].firstName ? item.artistDetails[0].firstName : '') : '';
        let lastName = item.artistDetails ? (item.artistDetails[0].lastName ? item.artistDetails[0].lastName : '') : '';
        let artistName = item.artistDetails ? (item.artistDetails[0].artistName ? item.artistDetails[0].artistName : "") : '';
        let profileImage = item.artistDetails[0].profileImage ? item.artistDetails[0].profileImage : constants.AppConstant.bandoLogo;
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

    }

    const handleShowCommentMinimizeAudio = async (item) => {
        console.log("item", item);
        const payload = {
            post_id: item._id
        }
        await props.dispatch(getCommentList(payload))
        let artistDetail = props.profile.artistDetail[0].artistDeatils
        let firstName = artistDetail ? (artistDetail.firstName ? artistDetail.firstName : '') : '';
        let lastName = artistDetail ? (artistDetail.lastName ? artistDetail.lastName : '') : '';
        let artistName = artistDetail ? (artistDetail.artistName ? artistDetail.artistName : "") : '';
        let profileImage = artistDetail.profileImage ? artistDetail.profileImage : constants.AppConstant.bandoLogo;
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

    const handleOnShare = async (item) => {
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

    const handleLikeUnlikePost = (item) => {
        if (!multipleClickLike) {
            setMultipleClickLike(true)
            if (!item.isLiked) {
                const payload = {
                    "post_id": item._id,
                    "status": "like",
                    "type": "collection"
                }
                props.dispatch(likeOnPost(payload))
            } else {
                const index = item.likes.findIndex(data => data.user_id === props.auth.userRegistered._id);
                const payload = {
                    "likeId": item.likes[index]._id,
                    "postId": item._id,
                    "type": "collection"
                }
                props.dispatch(unlikeOnPost(payload))
            }
            setTimeout(() => {
                setMultipleClickLike(false)
            }, 1500);
        }
    }

    const handleShowPostDetails = (item, artistId) => {
        TrackPlayer.reset();
        props.dispatch(reSetAudioPlayingState())
        props.dispatch(setArtistID(artistId))
        props.dispatch(getArtistDetailCollectionPage(artistId, () => {
            handleNavigateToArtistDetailToShowPost(item)
        }))
        //props.dispatch(getArtistDetailHomePage(artistId, false, item, true))
        state.multipleClickDisabled = true
        setState({
            ...state
        })
        if (state.multipleClickDisabled) {
            const payloadForSetSeletcedPost = {
                "post_id": item._id,
                "post_data": item
            }
            props.dispatch(setSelectedPost(payloadForSetSeletcedPost))
        }
    }

    const handleNavigateToArtistDetailToShowPost = (selectedPost) => {
        if (selectedPost.media_type === "video") {
            downloadFile(selectedPost.media_url).then(res => {
                if (res) {
                    let data = {
                        ...selectedPost,
                        media_url: res,
                        chunk_url: res
                    }
                    props.route.params.onGoBack(
                        {
                            "postData": data
                        }
                    );
                    props.navigation.goBack();
                    // props.navigation.navigate(constants.ScreensName.ArtistDetails.name, {
                    //     "postData": data,
                    //     "fromHome": true
                    // })
                } else {
                    props.route.params.onGoBack(
                        {
                            "postData": selectedPost
                        }
                    );
                    props.navigation.goBack();
                    // props.navigation.navigate(constants.ScreensName.ArtistDetails.name, {
                    //     "postData": selectedPost,
                    //     "fromHome": true
                    // })
                }
            })
        } else {
            props.route.params.onGoBack(
                {
                    "postData": selectedPost
                }
            );
            props.navigation.goBack();
            // props.navigation.navigate(constants.ScreensName.ArtistDetails.name, {
            //     "postData": selectedPost,
            //     "fromHome": true
            // })
        }
    }

    const renderMyFeed = ({ item, index }) => {
        const createdDate = moment(new Date(item.createdAt))
        const d = moment(new Date())
        var timeFormat = "days"
        var timeDiff = d.diff(createdDate, 'years')
        if (timeDiff < 2) {
            timeFormat = "year"
        } else {
            timeFormat = "years"
        }
        if (timeDiff < 1) {
            timeDiff = Math.round(moment.duration(d.diff(createdDate)).asMonths());
            if (timeDiff < 2) {
                timeFormat = "month"
            } else {
                timeFormat = "months"
            }
        }
        if (timeDiff < 1) {
            timeDiff = Math.round(moment.duration(d.diff(createdDate)).asWeeks());
            if (timeDiff < 2) {
                timeFormat = "week"
            } else {
                timeFormat = "weeks"
            }
        }
        // var timeDiff = d.diff(createdDate, 'days')
        if (timeDiff < 1) {
            timeDiff = Math.round(moment.duration(d.diff(createdDate)).asDays());
            if (timeDiff < 2) {
                timeFormat = "day"
            } else {
                timeFormat = "days"
            }
        }
        if (timeDiff < 1) {
            timeDiff = Math.round(moment.duration(d.diff(createdDate)).asHours());
            if (timeDiff < 2) {
                timeFormat = "hour"
            } else {
                timeFormat = "hours"
            }

        }
        if (timeDiff < 1) {
            timeDiff = Math.round(moment.duration(d.diff(createdDate)).asMinutes())
            if (timeDiff < 2) {
                timeFormat = "now"
            } else {
                timeFormat = "minutes"
            }
            // timeFormat = "minutes"
        }
        let firstName = item.artistDetails ? (item.artistDetails[0].firstName ? item.artistDetails[0].firstName : '') : '';
        let lastName = item.artistDetails ? (item.artistDetails[0].lastName ? item.artistDetails[0].lastName : '') : '';
        let artistName = item.artistDetails ? (item.artistDetails[0].artistName ? item.artistDetails[0].artistName : "") : '';
        let profileImage = item.artistDetails[0].profileImage ? item.artistDetails[0].profileImage : constants.AppConstant.bandoLogo;
        if (item.media_type === "audio") {
            //if (false) {
            return (
                <View style={styles.postDivider}>
                    <AudioPost
                        onPressComment={() => { handleShowComment(item) }}
                        onThreeDotPress={() => handleThreeDotPress(item)}
                        onPressLike={() => handleLikeUnlikePost(item)}
                        backgroundImage={item.cover_image ? item.cover_image : constants.AppConstant.bandoLogo}
                        profileImage={{ uri: profileImage, priority: FastImage.priority.high }}
                        firstName={artistName ? artistName : firstName}
                        lastName={artistName ? '' : lastName}
                        likeCount={item?.likes.length}
                        time={timeFormat !== "now" ? `${timeDiff} ${timeFormat} ago` : "Now"}
                        commentCount={item.parentCommentCount}
                        shareCount={item.shareCount}
                        onPressShare={() => debounce(() => handleOnShare(item))}
                        // onPressShare={() => handleOnShare(item)}
                        multipleClickShareDisabled={state.multipleClickShareDisabled}
                        isLiked={item.isLiked}
                        title={item.title}
                        musicTitle={item.title}
                        playedTime={position}
                        totalTime={duration}
                        album={item.album}
                        description={item.description}
                        onPressArtist={() => { showArtistDetail(item.artistDetails[0]._id) }}
                        onPressCard={() => handleShowPostDetails(item, item.artistDetails[0]._id)}
                        // muted={state.audioMute}
                        muted={videoMute.current}
                        handleMuteUnmute={() => {
                            getAudioVolume()
                        }}
                        dontShowArtistName={true}
                    />
                </View>
            )
        }

        if (item.media_type === "image") {
            return (
                <View style={[{
                    flex: 1
                }, styles.postDivider]}>
                    <ImagePost
                        onPressComment={() => { handleShowComment(item) }}
                        onThreeDotPress={() => { handleThreeDotPress(item) }}
                        onPressLike={() => handleLikeUnlikePost(item)}
                        backgroundImage={item.media_url}
                        profileImage={{ uri: profileImage, priority: FastImage.priority.high }}
                        firstName={artistName ? artistName : firstName}
                        lastName={artistName ? '' : lastName}
                        likeCount={item?.likes.length}
                        // time={`${timeDiff} ${timeFormat} ago`}
                        time={timeFormat !== "now" ? `${timeDiff} ${timeFormat} ago` : "Now"}
                        commentCount={item.parentCommentCount}
                        shareCount={item.shareCount}
                        onPressShare={() => debounce(() => handleOnShare(item))}
                        // onPressShare={() => handleOnShare(item)}
                        multipleClickShareDisabled={state.multipleClickShareDisabled}
                        isLiked={item.isLiked}
                        title={item.title}
                        description={item.description}
                        onPressArtist={() => { showArtistDetail(item.artistDetails[0]._id) }}
                        onPressCard={() => handleShowPostDetails(item, item.artistDetails[0]._id)}
                        dontShowArtistName={true}
                    />
                </View>
            )
        }

        if (item.media_type === "video") {
            if (videoUrlIndex.current === index) {
                return (
                    <VideoPlayer
                        onError={(error) => {
                            console.log("error", error);
                        }}
                        onPressComment={() => { handleShowComment(item) }}
                        onThreeDotPress={() => handleThreeDotPress(item)}
                        onPressLike={() => handleLikeUnlikePost(item)}
                        source={
                            videoUrl.current.includes(".m3u8") ?
                                {
                                    uri: videoUrlIndex.current === index ? videoUrl.current : "",
                                    type: "m3u8",
                                }
                                :
                                {
                                    uri: videoUrlIndex.current === index ? videoUrl.current : "",
                                }
                        }
                        seekColor={"red"}
                        showOnStart={false}
                        controlAnimationTiming={0}
                        profileImage={{ uri: profileImage, priority: FastImage.priority.high }}
                        firstName={artistName ? artistName : firstName}
                        lastName={artistName ? '' : lastName}
                        likeCount={item?.likes.length}
                        commentCount={item.parentCommentCount}
                        shareCount={item.shareCount}
                        // onPressShare={() => handleOnShare(item)}
                        onPressShare={() => debounce(() => handleOnShare(item))}
                        multipleClickShareDisabled={state.multipleClickShareDisabled}
                        isLiked={item.isLiked}
                        musicTitle={item.title}
                        playedTime={position}
                        totalTime={duration}
                        description={item.description}
                        // dayAgo={`${timeDiff} ${timeFormat} ago`}
                        dayAgo={timeFormat !== "now" ? `${timeDiff} ${timeFormat} ago` : "Now"}
                        musicHeader={item.title}
                        onPressArtist={() => { showArtistDetail(item.artistDetails[0]._id) }}
                        onPressCard={() => handleShowPostDetails(item, item.artistDetails[0]._id)}
                        //paused={state.shouldVideoPaused}
                        paused={videoPlayerRef.current}
                        style={[{
                            width: "100%",
                            height: constants.vh(361),
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: constants.Colors.color_333333,
                            backgroundColor: constants.Colors.color_333333
                        }, styles.postDivider]}
                        poster={item?.posterFrame ? item?.posterFrame : constants.AppConstant.bandoLogo}
                        posterResizeMode="cover"
                        resizeMode="cover"
                        muted={videoMute.current}
                        //muted={state.audioMute}
                        handleVolumeMuteUnmute={(result) => {
                            handleVideoMuteUnmute(result)
                        }}
                        dontShowArtistName={true}
                    />
                )
            } else {
                return (
                    <View style={[{
                        flex: 1
                    }, styles.postDivider]}>
                        <ImagePost
                            onPressComment={() => { handleShowComment(item) }}
                            onThreeDotPress={() => { handleThreeDotPress(item) }}
                            onPressLike={() => handleLikeUnlikePost(item)}
                            backgroundImage={item?.posterFrame ? item?.posterFrame : constants.AppConstant.bandoLogo}
                            profileImage={{ uri: profileImage, priority: FastImage.priority.high }}
                            firstName={artistName ? artistName : firstName}
                            lastName={artistName ? '' : lastName}
                            likeCount={item?.likes.length}
                            // time={`${timeDiff} ${timeFormat} ago`}
                            time={timeFormat !== "now" ? `${timeDiff} ${timeFormat} ago` : "Now"}
                            commentCount={item.parentCommentCount}
                            shareCount={item.shareCount}
                            onPressShare={() => handleOnShare(item)}
                            multipleClickShareDisabled={state.multipleClickShareDisabled}
                            isLiked={item.isLiked}
                            title={item.title}
                            description={item.description}
                            isVideo
                            musicTitle={item.title}
                            muted={videoMute.current}
                            onPressArtist={() => { showArtistDetail(item.artistDetails[0]._id) }}
                            onPressCard={() => handleShowPostDetails(item, item.artistDetails[0]._id)}
                            dontShowArtistName={true}
                        />
                    </View>
                )
            }

        }
    }

    const getAudioVolume = async () => {
        let vol = await TrackPlayer.getVolume()
        vol === 0 ? handleVideoMuteUnmute(false) : handleVideoMuteUnmute(true)
    }

    const handleVideoMuteUnmute = (value) => {
        console.log("value", value);
        videoMute.current = value
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
    }

    const onViewRef = React.useRef((info) => {
        TrackPlayer.reset();

        videoPlayerRef.current = true;
        videoUrl.current = "";
        videoUrlIndex.current = 0;
        if (info.changed[0].item.media_type === "audio") {
            let audioObj = {
                "id": "0",
                "url": info.changed[0].item.media_url,
                "artist": info.changed[0].item.artistDetails[0].artistName ?
                    info.changed[0].item.artistDetails[0].firstName :
                    info.changed[0].item.artistDetails[0].lastName,
                "title": info.changed[0].item.title
            };
            TrackPlayer.add(audioObj);
            TrackPlayer.getDuration().then(totalDuration => {
                console.log("totalDuration", totalDuration);
            })

            TrackPlayer.play();
            let payload = {
                "_id": info.changed[0].item._id,
                "type": 1
            }
            props.dispatch(trackPost(payload))
        }

        if (info.changed[0].item.media_type === "video") {

            downloadFile(info.changed[0].item.media_url).then(res => {
                if (res) {
                    videoUrl.current = res
                    videoUrlIndex.current = info.changed[0].index;
                    videoPlayerRef.current = false;
                    let data = {
                        "_id": info.changed[0].item._id,
                        "type": 2
                    }
                    props.dispatch(trackPost(data))
                } else {
                    videoUrl.current = info.changed[0].item.chunk_url ?
                        info.changed[0].item.chunk_url :
                        info.changed[0].item.media_url;
                    videoUrlIndex.current = info.changed[0].index;
                    videoPlayerRef.current = false;
                    let data = {
                        "_id": info.changed[0].item._id,
                        "type": 2
                    }
                    props.dispatch(trackPost(data))
                }
            })
        }
    })

    const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

    const renderEmptyFeed = ({ }) => {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: HEIGHT * 0.25,
            }}>
                <Components.NoPostFound
                    title="There is no feed to show."
                />
            </View>
        )
    }

    const handlePressNotification = (payload, notificationID) => {
        props.dispatch(setArtistID(payload.artistId))

        setState({
            ...state,
            showNotification: false,
            notificationRead: false,
        })

        let data = {
            "pageNumber": 1,
            "isRead": false,
        }
        props.dispatch(getNotification(data));
        if (payload.notificationType === 1) {
            props.dispatch(viewNotification(notificationID))
            setState({
                ...state,
                recommended: false,
                trending: true,
                feed: false,
                showNotification: false
            })
            let payload = {
                "pageNumber":
                    state.notificationRead ? state.pageNumberNotificationRead : state.pageNumberNotificationUnRead,
                "isRead": false,
            }
            props.dispatch(getNotification(payload));
        }

        if (payload.notificationType === 2) {
            props.dispatch(viewNotification(notificationID))
            let updatedPostData = {
                ...payload,
                likes: JSON.parse(payload.likes),
                // genres: JSON.parse(payload.genres),
                comments: JSON.parse(payload.comments),
                merchandise: JSON.parse(payload.merchandise)
            }
            handleShowPostDetails(updatedPostData, updatedPostData.artistId)
            // NavigationService.navigate(constants.ScreensName.PostAudio.name, { notificationData: payload })
            return 1
        }

        if (payload.notificationType === 3) {
            props.dispatch(viewNotification(notificationID))
            // NavigationService.navigate(constants.ScreensName.PostVideo.name, { notificationData: payload })
            let updatedPostData = {
                ...payload,
                likes: JSON.parse(payload.likes),
                // genres: JSON.parse(payload.genres),
                comments: JSON.parse(payload.comments),
                merchandise: JSON.parse(payload.merchandise)
            }
            handleShowPostDetails(updatedPostData, updatedPostData.artistId)
            return 1
        }
        if (payload.notificationType === 4) {
            props.dispatch(viewNotification(notificationID))
            // NavigationService.navigate(constants.ScreensName.PostImage.name, { notificationData: payload })
            let updatedPostData = {
                ...payload,
                likes: JSON.parse(payload.likes),
                // genres: JSON.parse(payload.genres),
                comments: JSON.parse(payload.comments),
                merchandise: JSON.parse(payload.merchandise)
            }
            handleShowPostDetails(updatedPostData, updatedPostData.artistId)
            return 1
        }
        if (payload.notificationType === 5) {
            console.log("payload", payload);
            const parentId = payload.parent_id
            props.dispatch(viewNotification(notificationID, parentId));
            //props.dispatch(viewNotification(notificationID))
            NavigationService.navigate(constants.ScreensName.ReplyNotification.name, { notificationData: payload })
            return 1
        }
        if (payload.notificationType === 6) {
            props.dispatch(viewNotification(notificationID))
            NavigationService.navigate(constants.ScreensName.MerchNotification.name, { notificationData: payload })
            return 1
        }
        if (payload.notificationType === 13) {
            props.dispatch(viewNotification(notificationID))

            props.dispatch(getArtistDetail("homeArtistDetail"))
            // NavigationService.navigate(constants.ScreensName.MerchNotification.name, { notificationData: payload })
            return 1
        }
    }

    const renderNotification = ({ item, index }) => {
        var a = moment(cureentDateTime);
        var b = moment(item.notification.createdAt);
        var finalDifference;
        var differenceInNotificationTimeMinute = a.diff(b, 'minutes')
        var differenceInNotificationTimeHour = a.diff(b, 'hours')
        var differenceInNotificationTimeDay = a.diff(b, 'days')

        if (differenceInNotificationTimeMinute < 59) {
            finalDifference = `${differenceInNotificationTimeMinute}m`
        }
        else if (differenceInNotificationTimeHour < 24 && differenceInNotificationTimeMinute >= 59) {
            finalDifference = `${differenceInNotificationTimeHour}h`
        }
        else if (differenceInNotificationTimeHour >= 24) {
            finalDifference = `${differenceInNotificationTimeDay}d`
        }

        return (
            <View style={{
                marginVertical: 10
            }}>
                <Components.NotificationCard
                    image={
                        item.data.artistProfileImage != null ?
                            { uri: item.data.artistProfileImage, priority: FastImage.priority.high } :
                            { uri: constants.AppConstant.bandoLogo, priority: FastImage.priority.high }
                    }
                    title={
                        item.data.notificationType === 1 ? constants.ConstStrings.welcomeMessage :
                            null
                    }
                    subtitle={item.notification.name}
                    date={finalDifference}
                    onPress={
                        () => handlePressNotification(item.data, item.data._id)
                    }

                />
            </View>
        )
    }

    const handleMerchandiseSell = () => {
        props.dispatch(clearNotificationDataWhenToggle())

        state.notificationRead = !state.notificationRead
        setState({
            ...state,

        })
        if (state.notificationRead) {
            let payload = {
                "pageNumber": 1,
                "isRead": true,
            }
            props.dispatch(getNotification(payload))

        }
        else {
            let payload = {
                "pageNumber": 1,
                "isRead": false,
            }
            props.dispatch(getNotification(payload))
        }
    }

    const handleOnReachedNotification = () => {
        if (props.home.notificationPaginationCount > props.home.apiNotificationData.length) {
            if (state.notificationRead) {
                state.pageNumberNotificationRead = state.pageNumberNotificationRead + 1
                setState({
                    ...state
                })
            } else {
                state.pageNumberNotificationUnRead = state.pageNumberNotificationUnRead + 1
                setState({
                    ...state
                })
            }



            let payload = {
                "pageNumber":
                    state.notificationRead ? state.pageNumberNotificationRead : state.pageNumberNotificationUnRead,
                "isRead"
                    :
                    state.notificationRead ? true : false,
            }
            props.dispatch(getNotification(payload))
        }
    }

    const handleCrossNotification = () => {
        setState({
            ...state,
            showNotification: false,
            notificationRead: false,
        })
        let payload = {
            "pageNumber": 1,
            "isRead": false,
        }
        props.dispatch(getNotification(payload));
    }

    const handleThreeDotPress = async (item) => {
        videoPlayerRef.current = true
        setState({
            ...state,
            reportPostCancelAlert: true,
            post_id: item._id
        })
        TrackPlayer.pause()

    }

    const handleCancel = async () => {
        TrackPlayer.play()
        videoPlayerRef.current = false
        setState({
            ...state,
            reportPostCancelAlert: false,
            reportAlert: false,
        })
    }

    const handleReport = async () => {
        setState({
            ...state,
            reportPostCancelAlert: false,
            reportAlert: true
        })
    }

    const handleReportPost = async () => {
        const payload = {
            "post_id": state.post_id,
            "collection": true
        }
        await props.dispatch(reportPost(payload))
        setTimeout(() => {
            setState({
                ...state,
                confirmReportPostAlert: true,
                reportAlert: false,
                reportPostCancelAlert: false,
            })
        }, 500)


    }

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor={constants.Colors.color_232323} />
            <SafeAreaView style={styles.container}>
                <View style={styles.dataContainer}>
                    <View style={{ paddingHorizontal: 10 }}>
                        <Components.CollectionHeader
                            onPressBack={() => props.navigation.goBack()}
                        />
                    </View>

                    <View style={{ marginVertical: vh(20) }}>
                        <Text numberOfLines={1} style={styles.text35700}>{props.collection.collectionDetail.title}</Text>
                    </View>

                    {!!props.collection.postList &&
                        // state.feed &&
                        <View style={{ flex: 1 }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={props.collection.postList}
                                extraData={props.collection.postList}
                                renderItem={renderMyFeed}
                                ListEmptyComponent={renderEmptyFeed}
                                onEndReached={handleOnReachedMyFeed}
                                onEndReachedThreshold={0.5}
                                ref={paramsList}
                                refreshing={state.isRefreshing}
                                onRefresh={handleGetMyFeed}
                                initialScrollIndex={0}
                                onViewableItemsChanged={onViewRef.current}
                                viewabilityConfig={viewConfigRef.current}
                                keyExtractor={(item, index) => index.toString()}
                                disableVirtualization={true}
                            />

                        </View>
                    }
                </View>

                {/* modal for report post */}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={state.reportPostCancelAlert}
                >

                    <View
                        style={[styles.modalMainReportCancel, , { width: '100%' }]}
                    >
                        <View style={[styles.modalSecondry, { width: '100%' }]}>
                            <View style={{ width: '100%' }}>
                                <Components.BottomSheet
                                    title="Report Post"
                                    backgroundColor={constants.Colors.color_232323}
                                    borderTopLeftRadius={10}
                                    borderTopRightRadius={10}
                                    borderBottomWidth={1}
                                    borderBottomColor={constants.Colors.color_3A3A3A}
                                    textColor={"#fff"}
                                    onPress={() => handleReport()}
                                />
                            </View>
                            <Components.BottomSheet
                                title="Cancel"
                                backgroundColor={constants.Colors.color_232323}
                                borderBottomRightRadius={10}
                                borderBottomLefttRadius={10}
                                textColor={"#FF5757"}
                                onPress={() => handleCancel()}
                            />
                        </View>
                    </View>
                </Modal>


                {/* ALERT FOR REPORT POST */}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={state.reportAlert}
                >
                    <View
                        style={[styles.modalMain]}
                    >
                        <View style={styles.modalSecondry}>
                            <Text style={styles.text23white}>Report Post?</Text>
                            <Text
                                style={styles.text16C4C4C4}
                            >You sure you want to</Text>
                            <Text
                                style={styles.text16C4C4C4}
                            >report this post?</Text>

                        </View>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => handleReportPost()}
                                style={styles.modalButton}
                            >
                                <Text
                                    style={[styles.text16white, {
                                        color: "#FF4F4F",
                                    }]}
                                >Report</Text>
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
                                onPress={() => handleCancel()}
                                style={styles.modalButton}
                            >
                                <Text
                                    style={styles.text16white}
                                >Cancel</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Modal>



                <Components.ProgressView
                    isProgress={props.profile.isLoadingArtistDetail}
                    title={constants.AppConstant.Bando}
                />

                <Components.AudioMinimize
                    showActionButton
                    onPressShare={() => { handleOnShare(props.post?.selectedPostData) }}
                    onPressComment={() => { handleShowCommentMinimizeAudio(props.post?.selectedPostData) }}
                />

                {/* ALERT OF NOTIFICATION */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={state.showNotification}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                            handleCrossNotification()
                        }}
                        style={styles.modalContainer}>
                        <TouchableOpacity
                            activeOpacity={1} style={styles.modalDataContainer}>
                            <View style={styles.modalHeaderContainer}>
                                <View
                                    style={styles.modalMerchandisingContainer}
                                >
                                    <Text style={styles.text18500}>Notifications</Text>
                                </View>


                                <View style={styles.mainContainer}>
                                    <Text style={styles.text16normal}>
                                        {state.notificationRead ? "Read" : "Unread"}</Text>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => { handleMerchandiseSell() }}
                                    >
                                        <Image
                                            style={{
                                                width: constants.vw(45),
                                                height: constants.vh(35),
                                                resizeMode: "contain"
                                            }}
                                            source={state.notificationRead ? constants.Images.ToggleOn : constants.Images.ToggleOff}
                                        />
                                    </TouchableOpacity>
                                </View>


                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => {
                                        handleCrossNotification()
                                    }}
                                    style={styles.modalCrossContainer}
                                >
                                    <Entypo
                                        name="cross"
                                        size={constants.vw(25)}
                                        color={constants.Colors.white}
                                    />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                activeOpacity={1}
                                style={{ flex: 1, marginTop: 20 }}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={props.home?.apiNotificationData}
                                    renderItem={renderNotification}
                                    onEndReached={handleOnReachedNotification}
                                    onEndReachedThreshold={0.5}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Modal>

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
                            props.dispatch(clearReplyList())
                            props.dispatch(clearCommentList())
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
                            style={{ flex: 1, width: "100%" }}
                        >

                            <TouchableOpacity
                                onPress={() => {
                                    // props.dispatch(clearReplyList())
                                    // props.dispatch(clearCommentList())
                                    Keyboard.dismiss()
                                }}
                                activeOpacity={1}
                                style={[styles.modalCommentSecondry, {
                                    marginTop: constants.vh(193)
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
                                                }}>
                                                {state.showReply ? state.selectedPostTitle : (state.isCommenting ? "Add Comment" : "Comments")}
                                            </Text>

                                        </View>

                                    </View>

                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.crossIconContainer}>
                                        <Entypo
                                            onPress={() => {
                                                props.dispatch(getCollectionList((res) => {
                                                    const selectedIndex = props.collection.selectedIndex;
                                                    props.dispatch(getCollectionDetails(res[selectedIndex], selectedIndex, () => { }))
                                                }))
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
                                                    // props.dispatch(clearReplyList());
                                                    // props.dispatch(clearCommentList());
                                                    showArtistDetail(state.selectedCommentArtistId)
                                                }}
                                            >
                                                <Text style={[styles.text25bold]}>{state.selectedCommentArtistName}</Text>

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


            </SafeAreaView>
        </>
    )
}

function mapStateToProps(state) {
    const { post, auth, profile, home, collection } = state
    return {
        post,
        auth,
        profile,
        home,
        collection
    }
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Collection)