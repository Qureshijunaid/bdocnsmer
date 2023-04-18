import React, { useState, useEffect } from 'react';
import {
    SafeAreaView, View, Text, StatusBar, TextInput, TouchableOpacity,
    FlatList, ScrollView, Modal, ActivityIndicator, Image, BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import Components from '../../components';
import { styles } from './styles';
import constants from '../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import {
    searchArtist, searchArtistByGenre, getGenre, getNotification, viewNotification,
    setEmptySearchResult, clearNotificationDataWhenToggle
} from '../../actions/home';
import { setSelectedPost } from '../../actions/post';
import { getArtistDetail, getConsumerProfile, setArtistID, getArtistDetailHomePage } from '../../actions/profile';
import * as NavigationService from '../../navigation/NavigationService';
import { getMerchDetails } from "../../actions/merch";
import {
    getSubcribedArtistList,
    getSubcribedArtistChatList,
} from '../../actions/chat';

const Search = (props) => {
    const cureentDateTime = new Date().toISOString()
    const [state, setState] = useState({
        pageNumberNotificationRead: 1,
        pageNumberNotificationUnRead: 1,
        notificationRead: false,
        showNotification: false,
        isActive: false,
        searchQuery: '',
        pageNumber: 1,
    });
    const [ref, setRef] = useState(null);

    useEffect(() => {
        props.dispatch(getGenre());
        props.navigation.addListener('focus', focusHandler)
        const unsubscribe = props.navigation.addListener('blur', () => {
            props.dispatch(setEmptySearchResult());
            handleClose();
            setState({
                ...state,
                showNotification: false,
            })
        });
        const backAction = () => {
            handleClose();
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => {
            backHandler.remove();
            unsubscribe;
        };
    }, []);

    const focusHandler = () => {
        let payload = {
            "pageNumber":
                state.notificationRead ? state.pageNumberNotificationRead : state.pageNumberNotificationUnRead,
            "isRead": false,
        }
        props.dispatch(getNotification(payload));
    }

    const handleClose = () => {
        setState({
            ...state,
            isActive: false,
            searchQuery: ''
        })
    }

    const setSearchQuery = (text) => {
        setState({
            ...state,
            searchQuery: text,
            isActive: true
        });
        if (text.length > 1) {
            props.dispatch(searchArtist({ query: text, type: 'ArtistName' }));
        }
    }

    const handleProfileClick = async () => {
        await props.dispatch(getConsumerProfile());
        //NavigationService.navigate(constants.ScreensName.UserProfile.name, null)
    }

    const renderArtistList = ({ item, index }) => {
        return (
            <Components.AudioListCard
                image={item.profileImage == null ? { uri: constants.AppConstant.bandoLogo } : { uri: item.profileImage }}
                title={item.artistName ? item.artistName : item.firstName + " " + item.lastName}
                genre={item.genreDetails.length > 0 ? item.genreDetails[0].title : ''}
                onPress={() => { checkArtistProfile(item) }}
            />
        )
    }

    const setSearchQueryForBrowseAll = (item) => {
        setState({
            ...state,
            searchQuery: item.title,
            isActive: true
        });

        if (item._id.length > 1) {
            ref.scrollTo(0, 0, true);
            props.dispatch(searchArtistByGenre({ query: item._id, type: 'BrowseAll' }));
        }
    }
    const checkArtistProfile = (item) => {
        props.dispatch(setArtistID(item._id))
        props.dispatch(getArtistDetail("homeArtistDetail"))
    }

    const renderBrowseAllItem = ({ item, index }) => {
        return (
            <View
                style={{
                    margin: constants.vh(10),
                    width: "45%",
                }}
            >
                <Components.GenreCardReactangle
                    genreName={item.title}
                    image={item.image_url}
                    //isSelected={item.isSelected}
                    onPress={() => { setSearchQueryForBrowseAll(item) }}
                />
            </View>
        )
    }

    const handleNotificationBellIcon = () => {

        let data = {
            "pageNumber": 1,
            "isRead": false,
        }
        props.dispatch(getNotification(data));
        setTimeout(() => {
            setState({
                ...state,
                showNotification: true
            })

        }, 100)

    }

    const handlePressNotification = (payload, notificationID, notificationIdForChat) => {
        console.log("payload notificationID", payload, notificationID);
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
            // let payload = {
            //     "pageNumber":
            //         state.notificationRead ? state.pageNumberNotificationRead : state.pageNumberNotificationUnRead,
            //     "isRead": false,
            // }
            // props.dispatch(getNotification(payload));
            NavigationService.navigate(constants.ScreensName.Homepage.name, { payload: true })
        }


        else if (payload.notificationType === 2) {
            props.dispatch(viewNotification(notificationID))
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
        else if (payload.notificationType === 3) {
            props.dispatch(viewNotification(notificationID))
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
        else if (payload.notificationType === 4) {
            props.dispatch(viewNotification(notificationID))
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
        else if (payload.notificationType === 5) {
            console.log("payload", payload);
            const parentId = payload.parent_id
            props.dispatch(viewNotification(notificationID, parentId));
            //props.dispatch(viewNotification(notificationID))
            NavigationService.navigate(constants.ScreensName.ReplyNotification.name, { notificationData: payload })
            return 1
            // const comments = JSON.parse(payload.comments);
            // const parentId = (comments && comments.length > 0) ? comments[0].parent_id : "";
            // props.dispatch(viewNotification(notificationID, parentId));
            // NavigationService.navigate(constants.ScreensName.ReplyNotification.name, { notificationData: payload })
            // return 1
        }
        else if (payload.notificationType === 6) {
            props.dispatch(getMerchDetails(payload._id, (merchDetails) => {
                if (!!merchDetails) {
                    const payloadForMerch = {
                        ArtistId: merchDetails.ArtistId,
                        artistId: merchDetails.artistId,
                        artistName: merchDetails.artistName,
                        artistProfileImage: merchDetails.artistProfileImage,
                        createdAt: merchDetails.createdAt,
                        height: merchDetails.height,
                        images: JSON.stringify(merchDetails.images),
                        merch_details: JSON.stringify(merchDetails.merch_details),
                        notificationType: 6,
                        price_details: JSON.stringify(merchDetails.price_details),
                        status: merchDetails.status,
                        updatedAt: merchDetails.updatedAt,
                        width: merchDetails.width,
                        _id: merchDetails._id
                    }
                    props.dispatch(viewNotification(notificationID))
                    NavigationService.navigate(constants.ScreensName.MerchNotification.name, { notificationData: payloadForMerch })
                }
            }))

            return 1

        }
        else if (payload.notificationType === 13) {
            props.dispatch(viewNotification(notificationID))
            // props.dispatch(setArtistID(data))
            props.dispatch(getArtistDetail("homeArtistDetail"))
            // NavigationService.navigate(constants.ScreensName.MerchNotification.name, { notificationData: payload })
            return 1
        }
        if (payload.notificationType === 18) {
            props.dispatch(viewNotification(notificationIdForChat))
            let payload = {
                "pageNumber": 1
            }
            props.dispatch(getSubcribedArtistChatList(payload))
            props.dispatch(getSubcribedArtistList(payload))
            NavigationService.navigate("ChatTab")
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
        else if (differenceInNotificationTimeHour < 24 && differenceInNotificationTimeMinute > 59) {
            finalDifference = `${differenceInNotificationTimeHour}h`
        }
        else if (differenceInNotificationTimeHour > 24) {
            finalDifference = `${differenceInNotificationTimeDay}d`
        }
        return (
            <View style={{
                marginVertical: 10
            }}>
                <Components.NotificationCard
                    image={
                        item.data.artistProfileImage != null ? { uri: item.data.artistProfileImage } : { uri: constants.AppConstant.bandoLogo }
                    }
                    title={
                        item.data.notificationType === 1 ? constants.ConstStrings.welcomeMessage :
                            null
                    }
                    subtitle={item.notification.name}
                    date={finalDifference}
                    onPress={
                        () => handlePressNotification(item.data, item.data._id, item.notification._id)
                    }

                />
            </View>
        )
    }

    const handleOnReachedTrending = () => {
        if (props.home.searchCount > props.home.searchArtistList.length) {
            state.pageNumber = state.pageNumber + 1
            setState({
                ...state
            })
            let payload = {
                "pageNumber": state.pageNumber
            }

            props.dispatch(searchQuery(payload))
        }

    }

    const renderEmptyList = () => {
        return (
            <View>
                {
                    state.searchQuery.length > 1 && props.home.searchArtistList.length == 0 ?
                        props.home.isSearchingByName ? <ActivityIndicator size="small" color="white" />
                            : <Text style={styles.text16bold}>Artist not found</Text> : <></>
                }
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

    const handleShowPostDetails = (item, artistId) => {
        props.dispatch(setArtistID(artistId))
        props.dispatch(getArtistDetailHomePage(artistId, false, item))

        const payloadForSetSeletcedPost = {
            "post_id": item._id,
            "post_data": item
        }
        props.dispatch(setSelectedPost(payloadForSetSeletcedPost))

    }

    return (
        <>
            <StatusBar backgroundColor={constants.Colors.color_232323} barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                <View style={{
                    paddingHorizontal: 15,
                    flex: 1
                }}>
                    <Components.HeaderWithNotification
                        title1="Discover"
                        //title2="Back"
                        showNotification={true}
                        onPress={() =>
                            handleNotificationBellIcon()
                        }
                        showCount={props.home?.notificationCount === 0 ? false : true}
                        count={props.home?.notificationCount}
                        onPressProfile={() => handleProfileClick()}
                        image={props.auth?.userRegistered?.profileImage != null ? { uri: props.auth?.userRegistered?.profileImage } : { uri: constants.AppConstant.bandoLogo }}
                    />
                    <View style={state.isActive ? styles.searchBlackContainer : styles.searchContainer}>
                        {state.isActive ? <></> :
                            <View style={styles.searchIcon}>
                                <AntDesign name={"search1"} size={20} />
                            </View>
                        }
                        <TextInput
                            placeholder='Artists'
                            style={styles.searchField}
                            autoFocus={false}
                            autoCapitalize={"none"}
                            onBlur={() => { }}
                            //onFocus={()=>{setState({...state,isActive:true})}}
                            onChangeText={(text) => {
                                setSearchQuery(text)
                            }}
                            value={state.searchQuery}
                        />
                        <TouchableOpacity style={styles.closeIcon} onPress={() => { handleClose() }}>
                            <AntDesign name={"close"} size={20} color={state.isActive ? constants.Colors.white : constants.Colors.black} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        ref={(ref) => {
                            setRef(ref);
                        }}
                    >
                        <View style={{ marginVertical: 20, flex: 1 }}>
                            <FlatList
                                //style={{flex:1,height:constants.vh(200)}}
                                data={state.searchQuery.length > 1 ? props.home.searchArtistList : []}
                                ListEmptyComponent={renderEmptyList}
                                renderItem={renderArtistList}
                                onEndReached={handleOnReachedTrending}
                                onEndReachedThreshold={0.5}
                                keyExtractor={(item, index) => index.toString()}
                            //maxToRenderPerBatch={5}
                            />
                        </View>
                        {state.searchQuery.length == 0 ?
                            <View style={{ flex: 1 }}>
                                <Text style={styles.text20bold}>Browse All</Text>
                                <FlatList
                                    ListEmptyComponent={<View />}
                                    horizontal={false}
                                    numColumns={2}
                                    data={props.registration.genres}
                                    extraData={props.registration.genres}
                                    renderItem={renderBrowseAllItem}
                                    keyExtractor={(item, index) => index.toString()}
                                    ListFooterComponent={<View style={styles.listFooterLayout} />}
                                />
                            </View> : <></>}
                    </ScrollView>
                    <Components.ProgressView
                        isProgress={props.home.isSearchArtistList || props.auth.isLoading || props.home.isLoading}
                        title={constants.AppConstant.Bando}
                    />
                    <Components.AudioMinimize />
                </View>

            </SafeAreaView>
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

        </>
    )
}

function mapStateToProps(state) {
    const { post, auth, profile, home, registration } = state
    return {
        post,
        auth,
        profile,
        home,
        registration
    }
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search);
