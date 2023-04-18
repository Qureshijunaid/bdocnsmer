import React, { useState, useEffect } from 'react';
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
    Share,
    Animated,
    Dimensions,
    Linking,
    Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import ReadMore from '../../../components/ReadMore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Foundation from 'react-native-vector-icons/Foundation';
import stripe from 'tipsi-stripe';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

import Slider from '@react-native-community/slider';
import TrackPlayer, {
    usePlaybackState,
    useTrackPlayerProgress, useTrackPlayerEvents
} from "react-native-track-player";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import moment from 'moment';

import VideoPlayer from '../../../components/AddVideoPost/react-native-video-controls/VideoPlayer';
import {
    getSubcribedArtistList,
} from '../../../actions/chat';
import { subcribeArtist, buyMerch, handlePaymentLoader } from '../../../actions/home';
import { setAudioPlayingState, reSetAudioPlayingState } from '../../../actions/audioMinimize';
import { cleanNavigationForSubcribedChat } from '../../../actions/chat';
import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import { AudioSlider } from '../../../components/AudioListSlider';
import * as NavigationService from '../../../navigation/NavigationService';
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
import { downloadFile } from '../../../utils/DownloadVideo';
import { useDebounce } from '../../../utils/multipleClick';
import { vh } from '../../../constants/Dimension';
import { getCollectionList, getCollectionDetails } from "../../../actions/collection";

const todayDate = new Date();
const WIDTH = Dimensions.get("window").width;
const ArtistDetails = (props) => {
    const { debounce } = useDebounce();
    const { position, duration } = useTrackPlayerProgress(1000, null);
    const playbackState = usePlaybackState();
    const videoMute = React.useRef(false)
    // const [playstate, setPlayState] = useState(playbackState);
    const slidingCompleted = async value => {

        await TrackPlayer.seekTo(value * duration);
    };

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

    const [showImageModalCollection, setShowImageModalCollection] = useState(false)
    const [showAudioModalCollection, setShowAudioModalCollection] = useState(false)
    const [showVideoModalCollection, setShowVideoModalCollection] = useState(false)
    const [imageCollectionData, setImageCollectionData] = useState(null)
    const [audioCollectionData, setAudioCollectionData] = useState(null)
    const [videoCollectionData, setVideoCollectionData] = useState(null)

    const [state, setState] = React.useState({
        subscriptionList: [],
        showMusicModal: props.route.params?.postData?.media_type === "audio" ? true : false,
        showImageModal: props.route.params?.postData?.media_type === "image" ? true : false,
        showVideoModal: props.route.params?.postData?.media_type === "video" ? true : false,
        isSelectedAudioData: props.route.params?.postData ? props.route.params.postData : null,
        selectedItem: props.route.params?.postData ? props.route.params.postData : null,
        isSelectedVideoData: props.route.params?.postData ? props.route.params.postData : null,
        selectedAudio: props.route.params?.postData ? props.route.params.postData : "",
        priceForSubcribed: null,
        durationForSubcribed: null,
        isPaymentPending: false,
        array1: [],
        array2: [],
        array3: [],
        array4: [],
        combinedArray: [],
        isSubscribe: props.profile.artistDetail != 0 &&
            props.profile.artistDetail[5].isSubscribed,
        paymentCardModal: false,
        thankModalState: true,
        buyMerchDetail: null,
        selectMerchVariant: 0,
        // isSubscribe: true,
        showSubscription: false,
        showSubscribed: false,
        isSubscriptionSelected: false,
        image: '',
        activeButton: false,
        showActionSheet: false,
        handleUploadLoader: false,
        audioDuration: null,
        statePositon: null,
        stateDuration: null,
        middleButtonText: "Play",
        isForward: false,
        isBackward: false,
        changeCover: false,
        handleCameraAndGalleryValue: false,
        isAudioLiked: false,
        isSelectedImageData: null,
        isBuyMerch: false,
        multipleClickShareDisabled: false,
        audioMute: false,
        multipleClickShareDisabledProfile: false,
        subscriptionWarning: false,
        selectedMerch: false,
        selectedMerch: null,
        onItemSelect: null,
        selectedQuantityPrice: null,
        selectSize: 0,
        facebook: props.profile.artistDetail[0].artistDeatils.socialLinks[0]?.facebook,
        instagram: props.profile.artistDetail[0].artistDeatils.socialLinks[0]?.instagram,
        soundCloud: props.profile.artistDetail[0].artistDeatils.socialLinks[0]?.soundCloud,
        spoitfy: props.profile.artistDetail[0].artistDeatils.socialLinks[0]?.spotify,
        website: props.profile.artistDetail[0].artistDeatils.socialLinks[0]?.website,
        other: props.profile.artistDetail[0].artistDeatils.socialLinks[0]?.other,
        twitter: props.profile.artistDetail[0].artistDeatils.socialLinks[0]?.twitter,
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
        imageHeight: constants.vh(361),
        showFullProfileImage: false,
        profileImageUrl: "",
    })

    useEffect(() => {
        props.dispatch(getCollectionList(() => { }))
        setup()
        setState({
            ...state,
            array1: [],
            array2: [],
            array3: [],
            array4: [],
            subscriptionList: [
                { id: 0, price: JSON.parse(props.profile.artistDetail[0].artistDeatils.priceBands).oneMonth.toFixed(2), type: "1 month", duration: 1, isSelected: false },
                { id: 1, price: JSON.parse(props.profile.artistDetail[0].artistDeatils.priceBands).threeMonth.toFixed(2), type: "3 months", duration: 3, isSelected: false },
                { id: 2, price: JSON.parse(props.profile.artistDetail[0].artistDeatils.priceBands).halfYearly.toFixed(2), type: "6 months", duration: 6, isSelected: false },
            ],
        })
        props.profile.artistDetail[3].audioDetails.map((item, index) => {
            if (index < 4) {
                state.array1 = [...state.array1, item]
                setState({
                    ...state
                })
            }
            if (index > 3 && index < 8) {
                state.array2 = [...state.array2, item]
                setState({
                    ...state
                })
            }
            if (index > 7 && index < 12) {
                state.array3 = [...state.array3, item]
                setState({
                    ...state
                })
            }
            if (index > 11 && index < 16) {
                state.array4 = [...state.array4, item]
                setState({
                    ...state
                })
            }
        })
        if (state.array1.length > 0) {
            state.combinedArray.push(state.array1)
            setState({
                ...state
            })
        }
        if (state.array2.length > 0) {
            state.combinedArray.push(state.array2)
            setState({
                ...state
            })
        }
        if (state.array3.length > 0) {
            state.combinedArray.push(state.array3)
            setState({
                ...state
            })
        }
        if (state.array4.length > 0) {
            state.combinedArray.push(state.array4)
            setState({
                ...state
            })
        }
        props.dispatch(getPaymentCardsList())
        const handleFocus = props.navigation.addListener('focus', () => {
            setState({
                ...state,
                shouldVideoPaused: false
            })
            //getAudioVolume()
        })
        const unsubscribe = props.navigation.addListener('blur', () => {
            setShowImageModalCollection(false)
            setShowAudioModalCollection(false)
            setShowVideoModalCollection(false)
            setState({
                ...state,
                // showMerchDetails: false,
                showSubscription: false,
                showMusicModal: false,
                showImageModal: false,
                subscriptionWarning: false,
                showVideoModal: false,
                showComment: false,
                isDeletingComment: false,
                shouldVideoPaused: true
            })
        });
        return () => {
            handleFocus;
            unsubscribe;
        };
    }, [])

    const handleTextReady = () => {
        // ...
    }

    const handleShowMerchDetails = (value) => {
        setState({
            ...state,
            showMerchDetails: value
        })
    }

    const handleImageSelectionInModal = (data) => {
        state.onItemSelect = data
        setState({
            ...state,
        })

    }

    const renderMerchandiseImages = ({ item, index }) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    marginEnd: constants.vw(20)
                }}
                onPress={() => handleImageSelectionInModal(item)}
            >
                <FastImage
                    style={{
                        width: constants.vw(67),
                        height: constants.vw(67),
                        borderRadius: 10,
                        backgroundColor: "rgba(60,60,67,0.29)"
                    }}
                    source={{
                        uri: item,
                        priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </TouchableOpacity>
        )
    }

    const renderSizeArray = ({ item, index }) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.sizeContainer, {
                    borderColor: (index === state.selectSize ? constants.Colors.white : constants.Colors.color_2F2F2F),
                    backgroundColor: (item.inStock === "0" ? constants.Colors.soldOut : "transparent")
                }]}
                onPress={() => {
                    setState({
                        ...state,
                        selectSize: index,
                        selectedQuantityPrice: item.price,
                        selectedMerchQuantity: item.quantity,
                    })
                }}
            >
                <Text style={styles.text16normal}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    const handleMerchBuy = (selectedMerch, selectedSize) => {
        setShowImageModalCollection(false)
        setShowAudioModalCollection(false)
        setShowVideoModalCollection(false)
        setState({
            ...state,
            showMerchDetails: false,
            showImageModal: false,
            showVideoModal: false,
            showMusicModal: false
        })
        NavigationService.navigate(constants.ScreensName.Cards.name, {
            merch: selectedMerch,
            selectedSize: selectedSize
        })
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

    const buyNowContent = () => {
        return (
            <View style={{
                marginTop:
                    state.selectedMerch?.merch_details[0].merchType !== "Unique Product" ?


                        constants.vh(30) : constants.vh(30)
            }}>
                <Components.PrimaryButton
                    backgroundColor={constants.Colors.color_17B933}
                    title={constants.ConstStrings.buyNow}
                    onPress={() => handleMerchBuy(state.selectedMerch, state.selectSize)}
                />
            </View>
        )
    }

    const soldOut = () => {
        return (
            <View style={{
                marginTop:
                    state.selectedMerch?.merch_details[0].merchType !== "Unique Product" ?


                        constants.vh(30) : constants.vh(30)
            }}>
                <Components.PrimaryButton
                    backgroundColor={constants.Colors.color_FF005C}
                    title={constants.ConstStrings.soldOut}
                />
            </View>
        )
    }

    const renderMerchandise = ({ item, index }) => {
        return (
            <View style={{ marginHorizontal: constants.vw(10) }}>
                <Components.MerchandiseArtistDetailCard
                    title={item.merch_details.length > 0 && item.merch_details[0].merchName}
                    image={item.images[0]
                    }
                    price={
                        item.price_details[0].variations.length > 0 ? item.price_details[0].variations[0].price.toFixed(2)
                            : item.price_details[0].price.toFixed(2)}
                    isSubscribe={props.profile.artistDetail[5].isSubscribed}
                    onPress={() => {
                        props.profile.artistDetail[5].isSubscribed &&
                            setState({
                                ...state,
                                showMerchDetails: true,
                                selectedMerch: item,
                                onItemSelect: item.images[0],
                                selectedQuantityPrice: item.merch_details[0].merchType !== "Bulk Product" ? item.price_details[0].price : item.price_details[0].variations[0].price
                            })
                    }}
                />
            </View>
        )
    }

    const renderVideo = ({ item, index }) => {

        if (index <= 10) {
            return (
                <View style={{ marginHorizontal: constants.vw(10) }}>
                    <Components.VideoCardArtistDetails
                        title={item.title}
                        image={item?.posterFrame ? item?.posterFrame : constants.AppConstant.bandoLogo}
                        duration={item.media_duration}
                        isSubscribe={props.profile.artistDetail[5].isSubscribed}
                        onPress={() => handleVideoPress(item)}
                    />
                </View>
            )
        }
    }

    const renderPhoto = ({ item, index }) => {
        if (index <= 10) {
            return (
                <View style={{ marginHorizontal: constants.vw(15) }}>
                    <Components.PhotoCardArtistDetails
                        title={item.title}
                        image={item.media_url}
                        //duration={item.time}
                        duration={moment(item.createdAt).format("DD-MM-YYYY")}
                        blurRadius={
                            !props.profile.artistDetail[5].isSubscribed && 10
                        }
                        isSubscribe={props.profile.artistDetail[5].isSubscribed}
                        onPress={() => handleImagePress(item)}
                    />
                </View>
            )
        }
    }

    const renderCollection = ({ item, index }) => {
        return (
            <View style={{ marginHorizontal: constants.vw(15) }}>
                <Components.CollectionArtistDetails
                    title={item.title}
                    image={item?.media_url ? item?.media_url : null}
                    onPress={() => {
                        props.profile?.artistDetail[5]?.isSubscribed ?
                            props.dispatch(getCollectionDetails(item, index, () => {
                                props.navigation.navigate(constants.ScreensName.Collection.name, {
                                    onGoBack: (data) => handleGoBack(data),
                                });
                            }))
                            : null
                    }}
                    postCount={item?.posts ? item.posts.length : 0}
                    isSubscribe={props.profile.artistDetail[5].isSubscribed}
                />
            </View>
        )
    }

    const handleGoBack = (data) => {
        setImageCollectionData(data.postData)
        setAudioCollectionData(data.postData)
        setVideoCollectionData(data.postData)
        setState({
            ...state,
            showMusicModal: data.postData.media_type === "audio" ? true : false,
            showImageModal: data.postData.media_type === "image" ? true : false,
            showVideoModal: data.postData.media_type === "video" ? true : false,
            isSelectedAudioData: data.postData ? data.postData : null,
            selectedItem: data.postData ? data.postData : null,
            isSelectedVideoData: data.postData ? data.postData : null,
            selectedAudio: data.postData ? data.postData : "",
            isSubscribe: true
        })
        if (data.postData.media_type === "image") {
            setShowImageModalCollection(true)
        } else if (data.postData.media_type === "audio") {
            setShowAudioModalCollection(true)
        } else if (data.postData.media_type === "video") {
            setShowVideoModalCollection(true)
        }
    }

    const renderSubscriptionList = ({ item, index }) => {

        return (
            <Components.PaymentSubscriptionCard
                title={`£ ${item.price}`}
                subTitle={item.type}
                isSelected={item.isSelected}
                onPress={() => {
                    if (index === item.id) {
                        state.subscriptionList.map(data => {
                            if (index === data.id) {
                                state.subscriptionList[data.id].isSelected = true
                                state.isSubscriptionSelected = true
                                state.priceForSubcribed = item.price
                                state.durationForSubcribed = item.duration
                                //state.selectedSubscription = state.subscriptionList[data.id].type
                                setState({
                                    ...state,

                                })
                            } else {
                                state.isSubscriptionSelected = true
                                state.subscriptionList[data.id].isSelected = false
                                setState({
                                    ...state,
                                })
                            }
                        })
                    }
                }}
            />
        )
    }

    const handleSubscriptionModal = (value) => {
        state.showSubscription = value
        setState({
            ...state
        })
    }

    const handleSubscribedModal = (value) => {
        state.showSubscribed = value
        setState({
            ...state
        })
    }

    const handlePayment = () => {
        handleSubscriptionModal(false)
        setState({
            ...state,
        })
        NavigationService.navigate(constants.ScreensName.CardSubscription.name, {
            price: state.priceForSubcribed,
            duration: state.durationForSubcribed
        })
    }

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
                artist: props.profile.artistDetail != null ?
                    props.profile.artistDetail[0].artistDeatils.artistName ? props.profile.artistDetail[0].artistDeatils.artistName : (props.profile.artistDetail[0].artistDeatils.firstName + " " + props.profile.artistDetail[0].artistDeatils.lastName) : ""
                ,
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

    const handleOnShowAudio = async (data) => {
        await TrackPlayer.reset();
        await TrackPlayer.add({
            id: "local-track",
            url: data.media_url,
            title: data.title,
            artist: props.profile.artistDetail != null ?
                props.profile.artistDetail[0].artistDeatils.artistName ? props.profile.artistDetail[0].artistDeatils.artistName : (props.profile.artistDetail[0].artistDeatils.firstName + " " + props.profile.artistDetail[0].artistDeatils.lastName) : ""
            ,
            artwork: state.image,
        });
        TrackPlayer.setVolume(1)
        setState({
            ...state,
            isForward: false,
            isBackward: false
        })
    }

    const handleOpenMusicModal = async (item) => {
        const payload = {
            "post_id": item._id,
            "post_data": item
        }
        props.dispatch(setSelectedPost(payload))
        // TrackPlayer.destroy()
        try {
            // await TrackPlayer.reset();
            await TrackPlayer.add({
                id: "local-track",
                url: item.media_url,
                title: item.title,
                artist: props.profile.artistDetail != null ?
                    props.profile.artistDetail[0].artistDeatils.artistName ? props.profile.artistDetail[0].artistDeatils.artistName : (props.profile.artistDetail[0].artistDeatils.firstName + " " + props.profile.artistDetail[0].artistDeatils.lastName) : ""
                ,
                artwork: item.cover_image
            });
            TrackPlayer.setVolume(1)
            let result = await TrackPlayer.getDuration()
            setState({
                ...state,
                showMusicModal: true,
                selectedAudio: item
            })

            return result;
        }
        catch (err) {
            if (DocumentPicker.isCancel(err)) {
            } else {
                throw err;
            }
        }
    }

    const handleAudioPress = async (audio) => {
        state.isSelectedAudioData = audio
        let payload = {
            "_id": audio._id,
            "type": 1
        }
        await props.dispatch(trackPost(payload))
        setState({
            ...state,

        })
        handleOpenMusicModal(audio)

    }

    const handleImagePress = (image) => {

        const payload = {
            "post_id": image._id,
            "post_data": image
        }
        props.dispatch(setSelectedPost(payload))
        setState({
            ...state,
            showImageModal: true,
            selectedItem: image
        })
    }

    const handleCrossAudioModal = async () => {
        setShowAudioModalCollection(false)
        state.showMusicModal = false
        if (props.route.params?.fromHome) {
            props.navigation.goBack()
        }
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

    const handleVideoPress = async (video) => {
        downloadFile(video.media_url).then(res => {
            if (res) {
                let videos = {
                    ...video,
                    media_url: res,
                    chunk_url: res
                }
                const payload = {
                    "post_id": video._id,
                    "post_data": videos
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
                const payload = {
                    "post_id": video._id,
                    "post_data": video
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
        setShowVideoModalCollection(false)
        setState({ ...state, showVideoModal: false })
        if (props.route.params?.fromHome) {
            props.navigation.goBack()
        }
    }

    const makePayment = (tokenId, cardId) => {
        if (state.isBuyMerch) {

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
            props.dispatch(buyMerch(payload));

        } else {
            let payload = {
                id: tokenId,
                price: state.priceForSubcribed,
                duration: state.durationForSubcribed,
                cardId: cardId
            }
            props.dispatch(subcribeArtist(payload))
        }

    }

    const handleOnShare = async (item) => {
        state.multipleClickShareDisabledProfile = true
        setState({
            ...state,
        })
        const payload = {
            "artist_id": item
        }


        if (state.multipleClickShareDisabledProfile) {
            props.dispatch(
                shareProfileDetail(
                    payload,
                    (response) => {
                        if (response != null) {
                            sharePorfileModal(response)

                        }


                    },
                    (error) => {
                        if (state.multipleClickShareDisabledProfile) {
                            state.multipleClickShareDisabledProfile = false
                            setState({
                                ...state
                            })
                        }

                    }
                )
            )
        }

    }

    const sharePorfileModal = async (data) => {
        try {
            const result = await Share.share({
                message:
                    `Hey, Look at this artist. ${data}`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    if (state.multipleClickShareDisabledProfile) {
                        state.multipleClickShareDisabledProfile = false
                        setState({
                            ...state
                        })

                    }
                } else {
                    if (state.multipleClickShareDisabledProfile) {
                        state.multipleClickShareDisabledProfile = false
                        setState({
                            ...state
                        })

                    }
                }
            } else if (result.action === Share.dismissedAction) {
                if (state.multipleClickShareDisabledProfile) {

                    state.multipleClickShareDisabledProfile = false
                    setState({
                        ...state
                    })

                }

            }
        } catch (error) {
            if (state.multipleClickShareDisabledProfile) {
                state.multipleClickShareDisabledProfile = false
                setState({
                    ...state
                })

            }

        }
    }
    const HEADER_MAX_HEIGHT = Platform.OS === "ios" ? constants.vh(360) : constants.vh(320);
    const HEADER_MIN_HEIGHT = Platform.OS === "ios" ? constants.vh(260) : constants.vh(220);
    const MAX_PROFILE_PIC_MARGINTOP = constants.vh(155);
    const MIN_PROFILE_PIC_MARGINTOP = constants.vh(65);
    const [scrollY, setScrolly] = useState(new Animated.Value(0))

    const headerHeight = scrollY.interpolate({
        inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: "clamp",
    })

    const profilePicMarginTop = scrollY.interpolate({
        inputRange: [0, MAX_PROFILE_PIC_MARGINTOP - MIN_PROFILE_PIC_MARGINTOP],
        outputRange: [MAX_PROFILE_PIC_MARGINTOP, MIN_PROFILE_PIC_MARGINTOP],
        extrapolate: "clamp",
    })

    const handleLikeUnlikePost = () => {
        if (!props.home.multipleClickDisabled) {
            props.dispatch(handlePaymentLoader(true))
            if (props.post.selectedPostData.isLiked === false) {
                const payload = {
                    "post_id": props.post.selectedPostData._id,
                    "status": "like",
                    "type": "artistDetails"
                }
                props.dispatch(likeOnPost(payload))
            } else {
                const index = props.post.selectedPostData.likes.findIndex(data => data.user_id === props.auth.userRegistered._id);
                const payload = {
                    "likeId": props.post.selectedPostData.likes[index]._id,
                    "postId": props.post.selectedPostData._id,
                    "type": "artistDetails"
                }
                props.dispatch(unlikeOnPost(payload))
            }
        }
    }

    const handleBack = () => {
        if (props.chat.navigationStatusFromChat) {

            let payload = {
                "pageNumber": 1
            }
            props.dispatch(getSubcribedArtistList(payload))

            NavigationService.navigate(constants.ScreensName.Chatting.name, props.chat.firebaseParamData)
        } else {
            props.navigation.goBack()
        }
        props.dispatch(cleanNavigationForSubcribedChat())
    }

    const handleShowSubscriptionWarning = (value) => {
        setState({
            ...state,
            subscriptionWarning: value
        })
    }

    const _renderTruncatedFooter = (handlePress) => {
        return (
            <Text style={styles.readMoreText} onPress={handlePress}>
                Read more
            </Text>
        );
    }

    const _renderRevealedFooter = (handlePress) => {
        return (
            <Text style={styles.readMoreText} onPress={handlePress}>
                Show less
            </Text>
        );
    }

    const openClickedUrl = async (url) => {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            await Linking.openURL(url);
        } else {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: `Sorry, we're not able to open this URL: ${url}`,
                type: "error",
                position: "top"
            });
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
        state.showImageModal = false
        state.showMusicModal = false
        state.showVideoModal = false
        setShowImageModalCollection(false)
        setShowAudioModalCollection(false)
        setShowVideoModalCollection(false)
        const payload = {
            post_id: item._id
        }
        await props.dispatch(getCommentList(payload))
        let artistDetail = props.profile.artistDetail[0].artistDeatils
        let firstName = artistDetail ? (artistDetail.firstName ? artistDetail.firstName : '') : '';
        let lastName = artistDetail ? (artistDetail.lastName ? artistDetail.lastName : '') : '';
        let artistName = artistDetail ? (artistDetail.artistName ? artistDetail.artistName : "") : '';
        let profileImage = artistDetail.profileImage ? artistDetail.profileImage : constants.AppConstant.bandoLogo;

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

    const renderListEmptyComponent = (title) => {
        return (
            <View style={{
                alignSelf: "center",
                width: constants.vw(300),
                marginStart:
                    title === "audio" ? constants.vw(0) :
                        constants.vw(38),
            }}>
                <Components.NoPostFound
                    title={`There are no ${title} to show.`}
                    subtitle="Please add some."
                />
            </View>

        )
    }

    return (
        <>
            <StatusBar barStyle="light-content" />
            <View style={styles.container}>
                <Animated.View
                    style={{
                        height: headerHeight
                    }}
                >
                    <Components.ArtistDetailProfile
                        artistName={props.profile.artistDetail != null ?
                            props.profile.artistDetail[0].artistDeatils.artistName ? props.profile.artistDetail[0].artistDeatils.artistName : (props.profile.artistDetail[0].artistDeatils.firstName + " " + props.profile.artistDetail[0].artistDeatils.lastName) : ""
                        }
                        title="Artist"

                        coverImage={
                            props.profile.artistDetail[0].artistDeatils.coverImage != null ?
                                props.profile.artistDetail[0].artistDeatils.coverImage : null
                            //constants.AppConstant.bandoLogo
                        }

                        profileImage={
                            props.profile.artistDetail != null ?
                                (props.profile.artistDetail[0].artistDeatils.profileImage ? props.profile.artistDetail[0].artistDeatils.profileImage : constants.AppConstant.bandoLogo) :
                                constants.AppConstant.bandoLogo
                        }
                        onPressBackIcon={() => handleBack()}
                        onPressShare={() => debounce(() => { handleOnShare(props.profile.artistDetail[0].artistDeatils._id) })}
                        // onPressShare={() => { handleOnShare(props.profile.artistDetail[0].artistDeatils._id) }}
                        multipleClickShareDisabledProfile={state.multipleClickShareDisabledProfile}
                        commentCount={20}
                        isLiked={true}
                        likeCount={10}
                        isSubscribe={props.profile.artistDetail[5].isSubscribed}
                        profilePicMarginTop={profilePicMarginTop}
                        resizeMode={props.profile?.artistDetail[0]?.artistDeatils?.coverImage ?
                            "cover"
                            : "cover"
                        }
                        onPressProfileImage={() => {
                            setState({
                                ...state,
                                showFullProfileImage: true,
                                profileImageUrl: props.profile.artistDetail != null ?
                                    (props.profile.artistDetail[0].artistDeatils.profileImage ? props.profile.artistDetail[0].artistDeatils.profileImage : constants.AppConstant.bandoLogo) :
                                    constants.AppConstant.bandoLogo
                            })
                        }}
                    />
                </Animated.View>
                <ScrollView
                    scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [{
                            nativeEvent: { contentOffset: { y: scrollY } }
                        }]
                    )}
                    style={[styles.dataContainer, { flex: 1 }]}>
                    <View style={styles.portionContainer}>
                        <Text style={styles.text20bold}>{
                            constants.ConstStrings.bio

                        }</Text>

                    </View>
                    <View style={styles.descriptionContainer}>
                        <ReadMore
                            numberOfLines={3}
                            renderTruncatedFooter={_renderTruncatedFooter}
                            renderRevealedFooter={_renderRevealedFooter}
                            onReady={handleTextReady}>
                            <Text style={styles.text16normal}>
                                {props.profile.artistDetail != null &&
                                    props.profile.artistDetail[0].artistDeatils.bio}
                                {/* {
                                    state.facebook &&
                                    <Text> </Text>
                                }

                                {
                                    state.facebook &&
                                    <Text
                                        onPress={() => {
                                            openClickedUrl(state.facebook)
                                        }}
                                        style={styles.profileLinkText}>Facebook</Text>
                                }
                                {
                                    state.instagram &&
                                    <Text> </Text>
                                }
                                {
                                    state.instagram &&
                                    <Text
                                        onPress={() => {
                                            openClickedUrl(state.instagram)
                                        }}
                                        style={styles.profileLinkText}>Instagram</Text>
                                }
                                {
                                    state.twitter &&
                                    <Text> </Text>
                                }
                                {
                                    state.twitter &&
                                    <Text
                                        onPress={() => {
                                            openClickedUrl(state.twitter)
                                        }}
                                        style={styles.profileLinkText}>Twitter</Text>
                                }
                                {
                                    state.soundCloud &&
                                    <Text> </Text>
                                }
                                {
                                    state.soundCloud &&
                                    <Text
                                        onPress={() => {
                                            openClickedUrl(state.soundCloud)
                                        }}
                                        style={styles.profileLinkText}>SoundCloud</Text>
                                }
                                {
                                    state.spotify &&
                                    <Text> </Text>
                                }
                                {
                                    state.spotify &&
                                    <Text
                                        onPress={() => {
                                            openClickedUrl(state.spotify)
                                        }}
                                        style={styles.profileLinkText}>Spotify</Text>
                                }
                                {
                                    state.website &&
                                    <Text> </Text>
                                }
                                {
                                    state.website &&
                                    <Text
                                        onPress={() => {
                                            openClickedUrl(state.website)
                                        }}
                                        style={styles.profileLinkText}>Website</Text>

                                }
                                {
                                    state.other &&
                                    <Text> </Text>
                                }
                                {
                                    state.other &&
                                    <Text
                                        onPress={() => {
                                            openClickedUrl(state.other)
                                        }}
                                        style={styles.profileLinkText}>Other</Text>
                                } */}
                            </Text>
                        </ReadMore>
                    </View>

                    {/* MERCHANDISE HERE */}
                    <View style={styles.merchandiseContainer}>
                        <View style={styles.portionContainer}>
                            <View style={styles.titleAndCountContainer}>
                                <Text style={styles.text18500}>{
                                    props.profile.artistDetail[1].merchCount > 1 ?
                                        constants.ConstStrings.merchandise :
                                        constants.ConstStrings.merchandise}</Text>
                                <View style={styles.countContainer}>
                                    <Components.PrimaryButton
                                        title={props.profile.artistDetail != null ?
                                            props.profile.artistDetail[1].merchCount : 0
                                        }
                                        paddingVertical={1}
                                        borderRadius={20}
                                    />
                                </View>
                            </View>
                            {props.profile.artistDetail[5].isSubscribed &&
                                (props.profile.artistDetail[1].merchDetails.length > 0 ? <TouchableOpacity
                                    hitSlop={styles.hitSlop}
                                    activeOpacity={1}
                                    onPress={() => NavigationService.navigate(constants.ScreensName.Merch.name, null)}
                                >
                                    <Text style={[styles.text14500, { textDecorationLine: "underline" }]}>{constants.ConstStrings.viewAll}</Text>
                                </TouchableOpacity> : <></>)
                            }

                        </View>
                    </View>
                    {props.profile.artistDetail != null && props.profile.artistDetail[1].merchDetails.length > 0 ?
                        <View style={styles.merchandiseContainer}>
                            <FlatList
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={
                                    props.profile.artistDetail[1].merchDetails}
                                renderItem={renderMerchandise}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        :
                        <View style={styles.emptyMediaContainer}>
                            <Components.NoPostFound
                                title={`There are no merchandise to show.`}
                                iconSize={90}
                            // subtitle="Please add some."
                            />
                        </View>
                    }


                    {/* AUDIO HERE */}
                    <View style={styles.merchandiseContainer}>
                        <View style={styles.portionContainer}>
                            <View style={styles.titleAndCountContainer}>
                                <Text style={styles.text18500}>{
                                    props.profile.artistDetail[3].audioCount > 1 ?
                                        constants.ConstStrings.audios
                                        :

                                        constants.ConstStrings.audio}</Text>
                                <View style={styles.countContainer}>
                                    <Components.PrimaryButton
                                        title={props.profile.artistDetail != null ?
                                            props.profile.artistDetail[3].audioCount : 0}
                                        paddingVertical={1}
                                        borderRadius={20}
                                    />
                                </View>
                            </View>
                            {props.profile.artistDetail[5].isSubscribed &&
                                (props.profile.artistDetail[3].audioDetails.length > 0 ? <View>
                                    <TouchableOpacity
                                        hitSlop={styles.hitSlop}
                                        activeOpacity={1}
                                        onPress={() => NavigationService.navigate(constants.ScreensName.AudioList.name, null)}
                                    >
                                        <Text style={[styles.text14500, { textDecorationLine: "underline" }]}> {constants.ConstStrings.viewAll}</Text>
                                    </TouchableOpacity>
                                </View> : <></>)

                            }

                        </View>
                    </View>
                    {props.profile.artistDetail != null && props.profile.artistDetail[3].audioDetails.length > 0 ?
                        <View style={styles.merchandiseContainer}>
                            <AudioSlider
                                images={state.combinedArray}
                                containerStyle={{
                                }}
                                showButton={false}
                                onPressAudio={
                                    props.profile.artistDetail[5].isSubscribed ?

                                        (result) => { handleAudioPress(result) } : () => console.log("no audio here")}
                                isSubscribe={props.profile.artistDetail[5].isSubscribed}
                            />
                        </View> :
                        <View style={styles.emptyMediaContainer}>
                            <Components.NoPostFound
                                title={`There are no audio to show.`}
                                iconSize={90}
                            //subtitle="Please add some."
                            />
                        </View>

                    }


                    {/* VIDEO HERE */}
                    <View style={styles.merchandiseContainer}>
                        <View style={styles.portionContainer}>
                            <View style={styles.titleAndCountContainer}>
                                <Text style={styles.text18500}>{
                                    props.profile.artistDetail[4].videoCount > 1 ?
                                        constants.ConstStrings.videos
                                        :
                                        constants.ConstStrings.video}</Text>
                                <View style={styles.countContainer}>
                                    <Components.PrimaryButton
                                        title={props.profile.artistDetail != null ?
                                            props.profile.artistDetail[4].videoCount : 0}
                                        paddingVertical={1}
                                        borderRadius={20}
                                    />
                                </View>
                            </View>
                            {props.profile.artistDetail[5].isSubscribed &&
                                (props.profile.artistDetail[4].videoDetails.length > 0 ? <View>
                                    <TouchableOpacity
                                        hitSlop={styles.hitSlop}
                                        activeOpacity={1}
                                        onPress={() => NavigationService.navigate(constants.ScreensName.VideoList.name, null)}
                                    >
                                        <Text style={[styles.text14500, { textDecorationLine: "underline" }]}>{constants.ConstStrings.viewAll}</Text>
                                    </TouchableOpacity>
                                </View> : <></>)

                            }

                        </View>
                    </View>
                    {props.profile.artistDetail != null && props.profile.artistDetail[4].videoDetails.length > 0 ?
                        <View style={styles.merchandiseContainer}>
                            <FlatList
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={
                                    props.profile.artistDetail[4].videoDetails}
                                renderItem={renderVideo}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        :
                        <View style={styles.emptyMediaContainer}>
                            <Components.NoPostFound
                                title={`There are no video to show.`}
                                iconSize={90}
                            //subtitle="Please add some."
                            />
                        </View>
                    }
                    {/* PHOTOS HERE */}
                    <View style={styles.merchandiseContainer}>
                        <View style={styles.portionContainer}>
                            <View style={styles.titleAndCountContainer}>
                                <Text style={styles.text18500AudioModal}>{
                                    props.profile.artistDetail[2].imageCount > 1 ? constants.ConstStrings.photos :
                                        constants.ConstStrings.photo}</Text>
                                <View style={styles.countContainer}>
                                    <Components.PrimaryButton
                                        title={props.profile.artistDetail != null ?
                                            props.profile.artistDetail[2].imageCount : 0}
                                        paddingVertical={1}
                                        borderRadius={20}
                                    />
                                </View>
                            </View>
                            {props.profile.artistDetail[5].isSubscribed &&
                                (props.profile.artistDetail[2].imageDetails.length > 0 ? <View>
                                    <TouchableOpacity
                                        hitSlop={styles.hitSlop}
                                        activeOpacity={1}
                                        onPress={() => NavigationService.navigate(constants.ScreensName.ImageList.name, null)}
                                    >
                                        <Text style={[styles.text14500, { textDecorationLine: "underline" }]}>{constants.ConstStrings.viewAll}</Text>
                                    </TouchableOpacity>

                                </View> : <></>)}

                        </View>
                    </View>
                    {props.profile.artistDetail != null && props.profile.artistDetail[2].imageDetails.length > 0 ?
                        <View style={styles.merchandiseContainer}>
                            <FlatList
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={props.profile.artistDetail != null &&
                                    props.profile.artistDetail[2].imageDetails}
                                renderItem={renderPhoto}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        :
                        <View style={styles.emptyMediaContainer}>
                            <Components.NoPostFound
                                title={`There are no image to show.`}
                                iconSize={90}
                            // subtitle="Please add some."
                            />
                        </View>
                    }

                    {/* COLLECTION HERE */}
                    <View style={{ marginTop: vh(22), paddingHorizontal: 20 }}>
                        <Text style={styles.text18500}>Collections</Text>
                    </View>
                    {
                        props.collection.collections.length > 0 ?
                            <View style={styles.merchandiseContainer}>
                                <FlatList
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    data={props.collection.collections}
                                    renderItem={renderCollection}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                            :
                            <View style={[styles.emptyMediaContainer]}>
                                <Components.NoPostFound
                                    title={`There are no collection to show.`}
                                    iconSize={90}
                                // subtitle="Please add some."
                                />
                            </View>
                    }
                    <View style={{ height: vh(50) }}>
                        <Text></Text>
                    </View>

                </ScrollView>

                <Components.AudioMinimize
                    showActionButton
                    onPressShare={() => debounce(() => handleOnSharePost(props.post?.selectedPostData))}
                    onPressComment={() => { handleShowComment(props.post?.selectedPostData, "audio") }}
                />
                {/* <Components.ProgressView
                    isProgress={props.profile.isLoading}
                    title={constants.AppConstant.Bando}
                /> */}

            </View>


            {/* Merch Modal */}

            {
                state.selectedMerch ?
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={state.showMerchDetails}

                    >

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                            }}>
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
                                <Image
                                    source={constants.Images.HomeIndicator}
                                    style={{ alignSelf: "center" }}
                                />
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => { handleShowMerchDetails(false) }}
                                    style={[styles.modalCrossContainer, { alignSelf: "flex-end" }]}
                                >
                                    <Entypo
                                        name="cross"
                                        size={constants.vw(25)}
                                        color={constants.Colors.white}
                                    />
                                </TouchableOpacity>
                                <View
                                    style={[styles.modalMerchandisingContainer, { justifyContent: "space-between", }]}
                                >
                                    <Text style={{ ...styles.text35700 }}>{state.selectedMerch?.merch_details[0].merchName}</Text>
                                </View>

                                <TouchableOpacity
                                    activeOpacity={1} style={{ marginTop: constants.vh(10) }}>

                                    <FastImage
                                        style={{
                                            width: constants.vw(340),
                                            height: constants.vh(340),
                                            borderRadius: 10,
                                            alignSelf: "center"
                                        }}
                                        source={{
                                            uri: state.onItemSelect,
                                            // headers: { Authorization: 'someAuthToken' },
                                            priority: FastImage.priority.high,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />

                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={{ flex: 1, marginTop: 20 }}>
                                    <FlatList
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        data={state.selectedMerch?.images}
                                        renderItem={renderMerchandiseImages}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={{ flex: 1, marginTop: 20 }}>
                                    <Text style={styles.text23800}>£{state.selectedQuantityPrice.toFixed(2)}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={{ flex: 1, marginTop: constants.vh(20) }}>
                                    <Text style={styles.text16600}>{state.selectedMerch?.merch_details[0].description}</Text>
                                </TouchableOpacity>

                                {
                                    state.selectedMerch?.merch_details[0].merchType !== "Unique Product" &&
                                    <View>
                                        <Text style={[styles.text23800, { marginTop: constants.vh(18) }]}>{constants.ConstStrings.varitations}</Text>
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            style={{ flex: 1, marginTop: 20 }}>
                                            <FlatList
                                                horizontal={true}
                                                showsHorizontalScrollIndicator={false}
                                                data={state.selectedMerch?.price_details[0].variations}
                                                renderItem={renderSizeArray}
                                                keyExtractor={(item, index) => index.toString()}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                }


                                {state.selectedMerch?.price_details[0].variations.length > 0 ?
                                    state.selectedMerch?.price_details[0].variations[state.selectSize].inStock === "1" ?
                                        buyNowContent() : soldOut()
                                    : state.selectedMerch?.price_details[0].inStock === "1" ? buyNowContent() : soldOut()
                                }
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={{
                                        marginBottom: constants.vh(50)
                                    }}
                                >
                                </TouchableOpacity>
                            </LinearGradient>
                        </ScrollView>
                    </Modal>
                    :
                    null
            }

            {/* subcriptionModal */}

            <Modal
                visible={state.showSubscription}
                transparent={true}
                animationType="slide"
            >

                <View style={styles.subscriptionModalContainer}>
                    {props.profile.artistDetail[0].artistDeatils.coverImage != null ?

                        <FastImage
                            style={{
                                width: "100%",
                                borderRadius: 15,
                                height: '100%',

                            }}
                            source={{
                                uri: props.profile.artistDetail[0].artistDeatils.coverImage,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                        :
                        <Image
                            style={styles.backGroundImageSubscription}
                            source={
                                constants.Images.welcome1
                            }
                            resizeMode="cover"
                        />
                    }



                    <View style={styles.dataContainerSubscription}>
                        <Image
                            source={constants.Images.HomeIndicator}
                            style={{
                                alignSelf: "center"
                            }}
                        />
                        <View style={styles.headerContainerSubscription}>
                            <Text style={styles.text18500}>{constants.ConstStrings.Subscribe}</Text>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => { handleSubscriptionModal(false) }}
                                hitSlop={styles.hitSlop}
                                style={styles.headerCrossContainerSubscriptionSubrcibe}>
                                <AntDesign
                                    name="close"
                                    color={constants.Colors.white}
                                    size={18}
                                />
                            </TouchableOpacity>

                        </View>
                        <View style={{ marginTop: constants.vh(42) }}>
                            <Text style={styles.text35bold}>{constants.ConstStrings.artistContent}</Text>
                            <Text style={styles.text35bold}>{constants.ConstStrings.noRestriction}</Text>
                        </View>

                        <View style={{
                            marginTop: constants.vh(10),
                            //  backgroundColor: "rgba(0,0,0,0.3)"
                        }}>
                            <View style={styles.helperTextContainer}>
                                <Feather
                                    name="check"
                                    color={constants.Colors.white}
                                    size={15}
                                />
                                <View style={{ marginStart: constants.vw(13) }}>
                                    <Text style={styles.text15500}>{constants.ConstStrings.withoutLimit}</Text>
                                </View>
                            </View>


                            <View style={styles.helperTextContainer}>
                                <Feather
                                    name="check"
                                    color={constants.Colors.white}
                                    size={15}
                                />
                                <View style={{ marginStart: constants.vw(13) }}>
                                    <Text style={styles.text15500}>{constants.ConstStrings.talkArtist}</Text>
                                </View>
                            </View>


                            <View style={styles.helperTextContainer}>
                                <Feather
                                    name="check"
                                    color={constants.Colors.white}
                                    size={15}
                                />
                                <View style={{ marginStart: constants.vw(13) }}>
                                    <Text style={styles.text15500}>{constants.ConstStrings.buyArtist}</Text>
                                </View>
                            </View>

                        </View>

                        <View style={{
                            marginTop: constants.vh(64),
                            flex: 1
                        }}>
                            <FlatList
                                data={state.subscriptionList}
                                renderItem={renderSubscriptionList}
                                keyExtractor={(item, index) => { index.toString() }}
                            />

                        </View>
                        <View style={{ marginTop: constants.vh(49) }}>
                            <Components.PrimaryButton
                                title="Get started"
                                textColor={state.isSubscriptionSelected ? "#fff" : "#774853"}
                                backgroundColor={state.isSubscriptionSelected ? constants.Colors.color_FF3062 : "#642131"}
                                onPress={state.isSubscriptionSelected ? handlePayment : null}
                            />
                        </View>

                    </View>
                </View>

                {/* </ScrollView> */}
            </Modal>


            {/* AUDIO MODAL */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={state.showMusicModal && state.isSubscribe}
                marginHorizontal={0}
                marginBottom={0}
                propagateSwipe={true}
                onShow={() => {
                    handleOnShowAudio(state.isSelectedAudioData)
                }}
            >
                <ScrollView style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    flex: 1,
                }}>
                    <View

                    >
                        <LinearGradient
                            colors={[constants.Colors.color_333333, constants.Colors.color_232323,]}
                            style={{
                                // flex: 1,
                                marginTop: constants.vh(90),
                                marginBottom: constants.vh(-10),
                                height: "100%",
                                borderRadius: 10,
                                paddingHorizontal: constants.vw(20),
                                paddingTop: constants.vh(15),
                                paddingBottom: constants.vh(100),
                                // alignItems: "center"
                            }}>
                            <FastImage
                                source={constants.Images.HomeIndicator}
                                style={{ alignSelf: "center" }}
                            />
                            <View
                                style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",

                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        alignItems: "center"
                                    }}
                                >
                                    <FastImage

                                        source={{
                                            uri: props.profile.artistDetail != null ?
                                                (props.profile.artistDetail[0].artistDeatils.profileImage ? props.profile.artistDetail[0].artistDeatils.profileImage : constants.AppConstant.bandoLogo) :
                                                constants.AppConstant.bandoLogo,
                                            priority: FastImage.priority.high
                                        }}

                                        style={{
                                            width: constants.vw(33),
                                            height: constants.vw(33),
                                            borderRadius: constants.vw(33 / 2)
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                        onLoadStart={() => { }}
                                        onProgress={(e) => { }}
                                        onLoad={(e) => { }}
                                    />
                                    {/* <View style={{ marginStart: constants.vw(11) }}> */}
                                    <Text style={{
                                        marginStart: constants.vw(11),
                                        fontSize: 20,
                                        fontWeight: "800",
                                        fontFamily: constants.Fonts.K2D_Regular,
                                        color: constants.Colors.white,
                                        width: '80%',
                                        // textTransform: 'capitalize'
                                    }}
                                        numberOfLines={2}
                                    >{props.profile.artistDetail != null ? (props.profile.artistDetail[0].artistDeatils.artistName ? props.profile.artistDetail[0].artistDeatils.artistName : props.profile.artistDetail[0].artistDeatils.firstName + " " + props.profile.artistDetail[0].artistDeatils.lastName) : ""
                                        }</Text>
                                    {/* </View> */}
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
                                        <FastImage style={styles.cover}
                                            source={{
                                                uri:
                                                    props.post?.selectedPostData?.cover_image === "" ? constants.AppConstant.bandoLogo :
                                                        props.post?.selectedPostData?.cover_image,
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

                                    <Text style={styles.audioTitle}>{state.isSelectedAudioData?.title}</Text>
                                    <Text style={styles.albumText}>{state.isSelectedAudioData?.album ? ("Album - " + state.isSelectedAudioData?.album) : ""}</Text>
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
                                    {state.isSelectedAudioData?.description}
                                </Text>
                            </View>
                            {
                                state.isSelectedAudioData?.merchandise.length > 0 &&
                                <View style={styles.merchandiseContainerModal}>
                                    <Text style={[styles.text18500, { color: constants.Colors.white }]}>Merchandise</Text>
                                    <Components.CountCard
                                        count={state.isSelectedAudioData?.merchandise.length}
                                    />
                                </View>
                            }

                            <View style={{ width: "100%" }}>
                                {state.isSelectedAudioData?.merchandise.length > 0 ?
                                    <Components.MerchandiseSlider
                                        images={state.isSelectedAudioData?.merchandise}
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
                                    /> : <View style={{ height: constants.vh(100) }} />}
                            </View>
                            <View style={{ height: constants.vh(50) }}><Text></Text></View>
                        </LinearGradient>

                    </View>
                </ScrollView>
            </Modal>

            {/* imageModal */}
            {
                state.showImageModal && state.isSubscribe ?
                    <>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            isVisible={state.showImageModal}
                            propagateSwipe={true}
                            marginHorizontal={0}
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
                                            <FastImage
                                                source={{
                                                    uri: props.profile.artistDetail != null ?
                                                        (props.profile.artistDetail[0].artistDeatils.profileImage ? props.profile.artistDetail[0].artistDeatils.profileImage : constants.AppConstant.bandoLogo) :
                                                        constants.AppConstant.bandoLogo,
                                                    priority: FastImage.priority.high
                                                }}
                                                style={styles.modalProfileImageContainer}
                                                resizeMode={FastImage.resizeMode.cover}
                                                onLoadStart={() => { }}
                                                onProgress={(e) => { }}
                                                onLoad={(e) => { }}
                                            />
                                            <Text style={[styles.text18500Images, { marginStart: constants.vw(11), width: '80%' }]} numberOfLines={2} >
                                                {
                                                    props.profile.artistDetail != null ? (props.profile.artistDetail[0].artistDeatils.artistName ? props.profile.artistDetail[0].artistDeatils.artistName : props.profile.artistDetail[0].artistDeatils.firstName + " " + props.profile.artistDetail[0].artistDeatils.lastName) : ""
                                                }
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            hitSlop={styles.hitSlop}
                                            activeOpacity={1}
                                            onPress={() => {
                                                setState({
                                                    ...state,
                                                    showImageModal: false,
                                                    imageHeight: constants.vh(361)
                                                })
                                                if (props.route.params?.fromHome) {
                                                    props.navigation.goBack()
                                                }
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
                                            source={{ uri: state.selectedItem.media_url, priority: FastImage.priority.high }}
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
                                    <View style={styles.postImageActionButton}>
                                        <Components.PostActionButton
                                            isLiked={props.post?.selectedPostData?.isLiked}
                                            onPressLikeUnlike={() => handleLikeUnlikePost()}
                                            onPressShare={() => debounce(() => handleOnSharePost(props.post?.selectedPostData))}
                                            onPressComment={() => { handleShowComment(props.post?.selectedPostData, "image") }}
                                        />
                                    </View>
                                    <View style={styles.modalTitleHeartContainer}>
                                        <View style={styles.Container23Text}>
                                            <Text style={styles.text23800}
                                            >{state.selectedItem.title}</Text>
                                        </View>

                                    </View>
                                    <View style={{ marginTop: 5, width: '95%', alignSelf: 'center' }}>
                                        <Text style={styles.text16400Image}
                                        >
                                            {state.selectedItem.description}
                                        </Text>
                                    </View>
                                    {state.selectedItem.merchandise.length > 0 &&
                                        <View style={styles.merchandiseContainerImages}>
                                            <Text style={[styles.text18500Images, { color: constants.Colors.white, marginRight: 10 }]}>Merchandise</Text>
                                            <Components.CountCard
                                                count={state.selectedItem?.merchandise.length}
                                            />
                                        </View>
                                    }

                                    <View style={{ width: "95%", alignSelf: 'center' }}>
                                        {state.selectedItem.merchandise.length > 0 ?
                                            <Components.MerchandiseSlider
                                                images={state.selectedItem.merchandise}
                                                showButton={false}
                                                containerStyle={[styles.merchandiseSliderContainer]}
                                                sliderButtonSize={8}
                                                containerStyle={{
                                                    height: constants.vh(650)
                                                }}
                                                selectedButtonColor={constants.Colors.color_FF3062}
                                                unselectedButtonBorderColor={"#fff"}
                                                onPressBuyNow={(result, selectMerchVariant) =>
                                                    handleMerchBuy(result, selectMerchVariant)
                                                }

                                            /> : <View style={{ height: constants.vh(100) }} />}
                                        <View style={{ height: constants.vh(40) }} />
                                    </View>
                                </View>
                            </ScrollView>
                            {/* </TouchableWithoutFeedback> */}
                            {/* </View> */}
                        </Modal>
                    </>
                    : null}
            {/* vedio modal */}
            {
                state.showVideoModal && state.isSubscribe ?
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={state.showVideoModal}
                        marginHorizontal={0}
                        marginBottom={0}

                    >
                        <ScrollView style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}>
                            <View >
                                <LinearGradient
                                    colors={[constants.Colors.color_333333, constants.Colors.color_232323,]}
                                    style={{
                                        // flex: 1,
                                        marginTop: constants.vh(90),
                                        height: "100%",
                                        borderRadius: 10,
                                        paddingHorizontal: constants.vw(20),
                                        paddingTop: constants.vh(15),
                                    }}>
                                    <FastImage
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
                                            <FastImage
                                                source={{
                                                    uri: props.profile.artistDetail != null ?
                                                        (props.profile.artistDetail[0].artistDeatils.profileImage ? props.profile.artistDetail[0].artistDeatils.profileImage : constants.AppConstant.bandoLogo) :
                                                        constants.AppConstant.bandoLogo,
                                                    priority: FastImage.priority.high
                                                }}
                                                style={{
                                                    width: constants.vw(33),
                                                    height: constants.vw(33),
                                                    borderRadius: constants.vw(33 / 2)
                                                }}
                                                resizeMode={FastImage.resizeMode.cover}
                                                onLoadStart={() => { }}
                                                onProgress={(e) => { }}
                                                onLoad={(e) => { }}
                                            />
                                            <View style={{ marginStart: constants.vw(11), width: '80%' }}>
                                                <Text style={{
                                                    fontSize: 20,
                                                    fontWeight: "800",
                                                    fontFamily: constants.Fonts.K2D_Regular,
                                                    color: constants.Colors.white,
                                                    // textTransform: 'capitalize',
                                                }}
                                                    numberOfLines={2}
                                                >
                                                    {props.profile.artistDetail != null ? (props.profile.artistDetail[0].artistDeatils.artistName ? props.profile.artistDetail[0].artistDeatils.artistName : props.profile.artistDetail[0].artistDeatils.firstName + " " + props.profile.artistDetail[0].artistDeatils.lastName) : ""}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            hitSlop={styles.hitSlop}
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
                                                size={25}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={[styles.card]}>
                                        <VideoPlayer
                                            onBuffer={() => {
                                                console.log("video is buffering");
                                            }}
                                            source={
                                                state.isSelectedVideoData?.chunk_url ?
                                                    {
                                                        uri: state.isSelectedVideoData.chunk_url,
                                                        type: "m3u8",
                                                    } :
                                                    {
                                                        uri: state.isSelectedVideoData.media_url,
                                                    }
                                            }
                                            aspectType={state.isSelectedVideoData?.aspectRatioType}
                                            seekColor={"red"}
                                            paused={state.shouldVideoPaused}
                                            hideShutterView={true}
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
                                            poster={
                                                state.isSelectedVideoData?.posterFrame ?
                                                    state.isSelectedVideoData?.posterFrame :
                                                    constants.AppConstant.bandoLogo
                                            }
                                            resizeMode="cover"
                                            // muted={state.audioMute}
                                            isLiked={props.post?.selectedPostData?.isLiked}
                                            onPressLikeUnlike={() => handleLikeUnlikePost()}
                                            onPressShare={() => debounce(() => handleOnSharePost(props.post?.selectedPostData))}
                                            onPressComment={() => { handleShowComment(props.post?.selectedPostData, "video") }}
                                            onPressFullScreen={(currentTime) => {
                                                NavigationService.navigate(constants.ScreensName.VideoPlayer.name, {
                                                    url: state.isSelectedVideoData?.chunk_url ? state.isSelectedVideoData?.chunk_url : state.isSelectedVideoData?.media_url,
                                                    initialPlayed: currentTime,
                                                    posterFrame: state.isSelectedVideoData?.posterFrame ? state.isSelectedVideoData?.posterFrame : constants.AppConstant.bandoLogo
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
                                        <Text style={[styles.audioTitle, { width: "50%" }]}>{state.isSelectedVideoData?.title}</Text>

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
                                        <Text style={styles.text16400}>{state.isSelectedVideoData?.description}</Text>
                                    </View>
                                    {
                                        state.isSelectedVideoData?.merchandise.length > 0 &&
                                        <View style={styles.merchandiseContainerModal}>
                                            <Text style={[styles.text18500, { color: constants.Colors.white }]}>Merchandise</Text>
                                            <Components.CountCard
                                                count={state.isSelectedVideoData?.merchandise.length}
                                            />
                                        </View>
                                    }

                                    <View style={{ width: "100%" }}>
                                        {state.isSelectedVideoData?.merchandise.length > 0 ?
                                            <Components.MerchandiseSlider
                                                images={state.isSelectedVideoData?.merchandise}
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
                    : null
            }

            {/* AUDIO Collection MODAL */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showAudioModalCollection}
                marginHorizontal={0}
                marginBottom={0}
                propagateSwipe={true}
                onShow={() => {
                    handleOnShowAudio(audioCollectionData)
                }}
            >
                <ScrollView style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    flex: 1,
                }}>
                    <View

                    >
                        <LinearGradient
                            colors={[constants.Colors.color_333333, constants.Colors.color_232323,]}
                            style={{
                                // flex: 1,
                                marginTop: constants.vh(90),
                                marginBottom: constants.vh(-10),
                                height: "100%",
                                borderRadius: 10,
                                paddingHorizontal: constants.vw(20),
                                paddingTop: constants.vh(15),
                                paddingBottom: constants.vh(100),
                                // alignItems: "center"
                            }}>
                            <FastImage
                                source={constants.Images.HomeIndicator}
                                style={{ alignSelf: "center" }}
                            />
                            <View
                                style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",

                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                        alignItems: "center"
                                    }}
                                >
                                    <FastImage

                                        source={{
                                            uri: props.profile.artistDetail != null ?
                                                (props.profile.artistDetail[0].artistDeatils.profileImage ? props.profile.artistDetail[0].artistDeatils.profileImage : constants.AppConstant.bandoLogo) :
                                                constants.AppConstant.bandoLogo,
                                            priority: FastImage.priority.high
                                        }}

                                        style={{
                                            width: constants.vw(33),
                                            height: constants.vw(33),
                                            borderRadius: constants.vw(33 / 2)
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                        onLoadStart={() => { }}
                                        onProgress={(e) => { }}
                                        onLoad={(e) => { }}
                                    />
                                    {/* <View style={{ marginStart: constants.vw(11) }}> */}
                                    <Text style={{
                                        marginStart: constants.vw(11),
                                        fontSize: 20,
                                        fontWeight: "800",
                                        fontFamily: constants.Fonts.K2D_Regular,
                                        color: constants.Colors.white,
                                        width: '80%',
                                        // textTransform: 'capitalize'
                                    }}
                                        numberOfLines={2}
                                    >{props.profile.artistDetail != null ? (props.profile.artistDetail[0].artistDeatils.artistName ? props.profile.artistDetail[0].artistDeatils.artistName : props.profile.artistDetail[0].artistDeatils.firstName + " " + props.profile.artistDetail[0].artistDeatils.lastName) : ""
                                        }</Text>
                                    {/* </View> */}
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
                                        <FastImage style={styles.cover}
                                            source={{
                                                uri:
                                                    props.post?.selectedPostData?.cover_image === "" ? constants.AppConstant.bandoLogo :
                                                        props.post?.selectedPostData?.cover_image,
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

                                    <Text style={styles.audioTitle}>{audioCollectionData?.title}</Text>
                                    <Text style={styles.albumText}>{audioCollectionData?.album ? ("Album - " + audioCollectionData?.album) : ""}</Text>
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
                                    {audioCollectionData?.description}
                                </Text>
                            </View>
                            {
                                audioCollectionData?.merchandise.length > 0 &&
                                <View style={styles.merchandiseContainerModal}>
                                    <Text style={[styles.text18500, { color: constants.Colors.white }]}>Merchandise</Text>
                                    <Components.CountCard
                                        count={audioCollectionData?.merchandise.length}
                                    />
                                </View>
                            }

                            <View style={{ width: "100%" }}>
                                {audioCollectionData?.merchandise.length > 0 ?
                                    <Components.MerchandiseSlider
                                        images={audioCollectionData?.merchandise}
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
                                    /> : <View style={{ height: constants.vh(100) }} />}
                            </View>
                            <View style={{ height: constants.vh(50) }}><Text></Text></View>
                        </LinearGradient>

                    </View>
                </ScrollView>
            </Modal>

            {/* imageModal Collection */}

            {showImageModalCollection &&
                <>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        isVisible={showImageModalCollection}
                        propagateSwipe={true}
                        marginHorizontal={0}
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
                                        <FastImage
                                            source={{
                                                uri: props.profile.artistDetail != null ?
                                                    (props.profile.artistDetail[0].artistDeatils.profileImage ? props.profile.artistDetail[0].artistDeatils.profileImage : constants.AppConstant.bandoLogo) :
                                                    constants.AppConstant.bandoLogo,
                                                priority: FastImage.priority.high
                                            }}
                                            style={styles.modalProfileImageContainer}
                                            resizeMode={FastImage.resizeMode.cover}
                                            onLoadStart={() => { }}
                                            onProgress={(e) => { }}
                                            onLoad={(e) => { }}
                                        />
                                        <Text style={[styles.text18500Images, { marginStart: constants.vw(11), width: '80%' }]} numberOfLines={2} >
                                            {
                                                props.profile.artistDetail != null ? (props.profile.artistDetail[0].artistDeatils.artistName ? props.profile.artistDetail[0].artistDeatils.artistName : props.profile.artistDetail[0].artistDeatils.firstName + " " + props.profile.artistDetail[0].artistDeatils.lastName) : ""
                                            }
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        hitSlop={styles.hitSlop}
                                        activeOpacity={1}
                                        onPress={() => {
                                            setState({
                                                ...state,
                                                // showImageModal: false,
                                                imageHeight: constants.vh(361)
                                            })
                                            setShowImageModalCollection(false)
                                            // if (props.route.params?.fromHome) {
                                            //     props.navigation.goBack()
                                            // }
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
                                        source={{ uri: imageCollectionData?.media_url, priority: FastImage.priority.high }}
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
                                <View style={styles.postImageActionButton}>
                                    <Components.PostActionButton
                                        isLiked={props.post?.selectedPostData?.isLiked}
                                        onPressLikeUnlike={() => handleLikeUnlikePost()}
                                        onPressShare={() => debounce(() => handleOnSharePost(props.post?.selectedPostData))}
                                        onPressComment={() => { handleShowComment(props.post?.selectedPostData, "image") }}
                                    />
                                </View>
                                <View style={styles.modalTitleHeartContainer}>
                                    <View style={styles.Container23Text}>
                                        <Text style={styles.text23800}
                                        >{imageCollectionData?.title}</Text>
                                    </View>

                                </View>
                                <View style={{ marginTop: 5, width: '95%', alignSelf: 'center' }}>
                                    <Text style={styles.text16400Image}
                                    >
                                        {imageCollectionData?.description}
                                    </Text>
                                </View>
                                {imageCollectionData?.merchandise.length > 0 &&
                                    <View style={styles.merchandiseContainerImages}>
                                        <Text style={[styles.text18500Images, { color: constants.Colors.white, marginRight: 10 }]}>Merchandise</Text>
                                        <Components.CountCard
                                            count={imageCollectionData?.merchandise.length}
                                        />
                                    </View>
                                }

                                <View style={{ width: "95%", alignSelf: 'center' }}>
                                    {imageCollectionData?.merchandise.length > 0 ?
                                        <Components.MerchandiseSlider
                                            images={imageCollectionData?.merchandise}
                                            showButton={false}
                                            containerStyle={[styles.merchandiseSliderContainer]}
                                            sliderButtonSize={8}
                                            containerStyle={{
                                                height: constants.vh(650)
                                            }}
                                            selectedButtonColor={constants.Colors.color_FF3062}
                                            unselectedButtonBorderColor={"#fff"}
                                            onPressBuyNow={(result, selectMerchVariant) =>
                                                handleMerchBuy(result, selectMerchVariant)
                                            }

                                        /> : <View style={{ height: constants.vh(100) }} />}
                                    <View style={{ height: constants.vh(40) }} />
                                </View>
                            </View>
                        </ScrollView>
                        {/* </TouchableWithoutFeedback> */}
                        {/* </View> */}
                    </Modal>
                </>
            }

            {/* video collection modal */}
            {
                showVideoModalCollection ?
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={showVideoModalCollection}
                        marginHorizontal={0}
                        marginBottom={0}

                    >
                        <ScrollView style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}>
                            <View >
                                <LinearGradient
                                    colors={[constants.Colors.color_333333, constants.Colors.color_232323,]}
                                    style={{
                                        // flex: 1,
                                        marginTop: constants.vh(90),
                                        height: "100%",
                                        borderRadius: 10,
                                        paddingHorizontal: constants.vw(20),
                                        paddingTop: constants.vh(15),
                                    }}>
                                    <FastImage
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
                                            <FastImage
                                                source={{
                                                    uri: props.profile.artistDetail != null ?
                                                        (props.profile.artistDetail[0].artistDeatils.profileImage ? props.profile.artistDetail[0].artistDeatils.profileImage : constants.AppConstant.bandoLogo) :
                                                        constants.AppConstant.bandoLogo,
                                                    priority: FastImage.priority.high
                                                }}
                                                style={{
                                                    width: constants.vw(33),
                                                    height: constants.vw(33),
                                                    borderRadius: constants.vw(33 / 2)
                                                }}
                                                resizeMode={FastImage.resizeMode.cover}
                                                onLoadStart={() => { }}
                                                onProgress={(e) => { }}
                                                onLoad={(e) => { }}
                                            />
                                            <View style={{ marginStart: constants.vw(11), width: '80%' }}>
                                                <Text style={{
                                                    fontSize: 20,
                                                    fontWeight: "800",
                                                    fontFamily: constants.Fonts.K2D_Regular,
                                                    color: constants.Colors.white,
                                                    // textTransform: 'capitalize',
                                                }}
                                                    numberOfLines={2}
                                                >
                                                    {props.profile.artistDetail != null ? (props.profile.artistDetail[0].artistDeatils.artistName ? props.profile.artistDetail[0].artistDeatils.artistName : props.profile.artistDetail[0].artistDeatils.firstName + " " + props.profile.artistDetail[0].artistDeatils.lastName) : ""}
                                                </Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            hitSlop={styles.hitSlop}
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
                                                size={25}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={[styles.card]}>
                                        <VideoPlayer
                                            onBuffer={() => {
                                                console.log("video is buffering");
                                            }}
                                            source={
                                                videoCollectionData?.chunk_url ?
                                                    {
                                                        uri: videoCollectionData.chunk_url,
                                                        type: "m3u8",
                                                    } :
                                                    {
                                                        uri: videoCollectionData.media_url,
                                                    }
                                            }
                                            aspectType={videoCollectionData?.aspectRatioType}
                                            seekColor={"red"}
                                            paused={state.shouldVideoPaused}
                                            hideShutterView={true}
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
                                            poster={
                                                videoCollectionData?.posterFrame ?
                                                    videoCollectionData?.posterFrame :
                                                    constants.AppConstant.bandoLogo
                                            }
                                            resizeMode="cover"
                                            // muted={state.audioMute}
                                            isLiked={props.post?.selectedPostData?.isLiked}
                                            onPressLikeUnlike={() => handleLikeUnlikePost()}
                                            onPressShare={() => debounce(() => handleOnSharePost(props.post?.selectedPostData))}
                                            onPressComment={() => { handleShowComment(props.post?.selectedPostData, "video") }}
                                            onPressFullScreen={(currentTime) => {
                                                NavigationService.navigate(constants.ScreensName.VideoPlayer.name, {
                                                    url: videoCollectionData?.chunk_url ? videoCollectionData?.chunk_url : videoCollectionData?.media_url,
                                                    initialPlayed: currentTime,
                                                    posterFrame: videoCollectionData?.posterFrame ? videoCollectionData?.posterFrame : constants.AppConstant.bandoLogo
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
                                        <Text style={[styles.audioTitle, { width: "50%" }]}>{videoCollectionData?.title}</Text>

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
                                        <Text style={styles.text16400}>{videoCollectionData?.description}</Text>
                                    </View>
                                    {
                                        videoCollectionData?.merchandise.length > 0 &&
                                        <View style={styles.merchandiseContainerModal}>
                                            <Text style={[styles.text18500, { color: constants.Colors.white }]}>Merchandise</Text>
                                            <Components.CountCard
                                                count={videoCollectionData?.merchandise.length}
                                            />
                                        </View>
                                    }

                                    <View style={{ width: "100%" }}>
                                        {videoCollectionData?.merchandise.length > 0 ?
                                            <Components.MerchandiseSlider
                                                images={videoCollectionData?.merchandise}
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
                    : null
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
                                        //onPress={() => { showArtistDetail(state.selectedCommentArtistId) }}
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
                                                // showArtistDetail(state.selectedCommentArtistId)
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

            <Modal
                visible={state.subscriptionWarning}
                animationType="slide"
                transparent={true}
            >
                <LinearGradient
                    colors={['rgb(47,46,48)', 'rgb(20,20,35)']}
                    style={{
                        flex: 1,
                        position: "absolute",
                        bottom: 0,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20
                    }}
                >
                    <View>
                        <View style={{
                            borderRadius: 15,
                            // position: "absolute",
                            width: "100%",
                            height: constants.vh(525)
                        }}>

                            <ImageBackground
                                source={constants.Images.BlueEllipses}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    justifyContent: "flex-start",
                                    resizeMode: "stretch",
                                    alignSelf: "center",
                                    alignItems: "flex-start",

                                }}
                            >
                                <View style={{
                                    width: "100%",
                                    height: "100%",
                                    paddingVertical: constants.vh(20),
                                    paddingHorizontal: constants.vw(15),
                                }}>
                                    <View style={[styles.headerCrossContainerSubscriptionThanks, {
                                        backgroundColor: "rgba(255,255,255,0.51)",
                                        alignSelf: "flex-end",
                                    }]}>

                                        <AntDesign
                                            name="close"
                                            color={constants.Colors.white}
                                            size={18}
                                            onPress={() => {
                                                handleShowSubscriptionWarning(false)
                                            }}
                                        />

                                    </View>
                                    <View style={{ alignSelf: "center" }}>
                                        <Image
                                            source={constants.Images.paymentThankLogo}
                                            resizeMode={"contain"}
                                            style={{
                                                width: constants.vw(85),
                                                height: constants.vh(103)
                                            }}
                                        />

                                    </View>
                                    <View style={{ alignSelf: "center", marginTop: constants.vh(31) }}>
                                        <Text style={styles.text24bold}>Looking to subscribe?</Text>


                                    </View>
                                    <View style={{
                                        alignSelf: "center",
                                        paddingHorizontal: constants.vw(25),
                                        marginTop: constants.vh(10)
                                    }}>
                                        <Text style={[styles.text16400, { textAlign: "center" }]}>{constants.ConstStrings.sorryYouCantSubscribe}</Text>
                                    </View>
                                    <View style={{
                                        width: "90%",
                                        alignSelf: "center",
                                        marginTop: constants.vh(61)
                                    }}>
                                        <Components.PrimaryButton
                                            title="Close"
                                            backgroundColor={constants.Colors.color_FF3062}
                                            onPress={() => {
                                                handleShowSubscriptionWarning(false)
                                            }}
                                        />
                                    </View>
                                </View>
                            </ImageBackground>



                        </View>

                    </View>
                </LinearGradient>
            </Modal>

            {/* Showing full profile image */}

            <Modal
                visible={state.showFullProfileImage}
                animationType="slide"
                transparent={false}
                onRequestClose={() => { setState({ ...state, showFullProfileImage: false }) }}
            >
                <TouchableOpacity
                    style={styles.profileModalContainer}
                    activeOpacity={1}
                    onPress={() => { setState({ ...state, showFullProfileImage: false }) }}
                >
                    <TouchableOpacity style={styles.fullProfileImageContainer}>
                        <FastImage
                            source={{ uri: state.profileImageUrl }}
                            priority={FastImage.priority.high}
                            resizeMode={FastImage.resizeMode.cover}
                            style={styles.fullProfileImage}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

        </>
    )
}

function mapStateToProps(state) {
    const { auth, post, profile,
        home, chat, collection } = state
    return {
        auth,
        post,
        profile,
        home,
        chat,
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
    mapDispatchToProps)
    (ArtistDetails);