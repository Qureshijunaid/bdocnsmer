import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions,
    BackHandler,
    Alert,
} from 'react-native';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'
import database from '@react-native-firebase/database';
import moment from 'moment';
import * as NavigationService from '../../../navigation/NavigationService';
import Toast from 'react-native-toast-message';
import constants from '../../../constants';
import Components from '../../../components';
import {
    getSubcribedArtistList,
    getSubcribedArtistChatList, setFirebaseMessage,
    setRecentChatMessage
} from '../../../actions/chat';
import { firebaseCheckStatus } from '../../../utils/Firebase/auth';
import { getConsumerProfile } from '../../../actions/profile';
import { styles } from './styles';
const HEIGHT = Dimensions.get("window").height
const ArtistList = (props) => {
    const cureentDateTime = new Date().toISOString()


    useEffect(() => {
        const subscribe = props.navigation.addListener('focus', () => {
            getRecentMessageHere()
        })
        return () => {
            subscribe;
        }
        // getRecentMessageHere()
    }, [])


    const getRecentMessageHere = () => {
        database()
            .ref(`recents/consumers/${props.auth.userRegistered.firebaseUid}`)
            .on('value', async snapshot => {
                let firebaseData = snapshot.val()
                props.dispatch(setRecentChatMessage(firebaseData))
            })

    }

    const [state, setState] = useState({
        pageNumberArtistSubcribe: 1,
        subcribedData: props.chat.subcribedChatArtistList
    })

    const renderItemForHorizontalFlatlist = ({ item, index }) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={{ alignItems: 'center', marginStart: 20 }}
                onPress={() => NavigationService.navigate(constants.ScreensName.Chatting.name, item)}
            >
                <FastImage
                    style={styles.horizontalImage}
                    source={{
                        uri: !item.profileImage ? constants.AppConstant.bandoLogo : item.profileImage,
                    }}
                    priority={FastImage.priority.high}
                    resizeMode={FastImage.resizeMode.cover}
                    onLoadStart={() => { }}
                    onProgress={(e) => { }}
                    onLoad={(e) => { }}
                />
                <Text style={styles.horizontalText}>{
                    item.artistName != "" ? item.artistName : `${item.firstName} ${item.lastName}`
                }</Text>
            </TouchableOpacity>
        )
    }
    const renderItemForAlreadyChatArtist = ({ item, index }) => {
        var a = moment(cureentDateTime);
        var b = moment(item.recent.createdAt);
        var finalDifference;
        var differenceInNotificationTimeSecond = a.diff(b, 'seconds')
        var differenceInNotificationTimeMinute = a.diff(b, 'minutes')
        var differenceInNotificationTimeHour = a.diff(b, 'hours')
        var differenceInNotificationTimeDay = a.diff(b, 'days')

        if (differenceInNotificationTimeSecond < 59) {
            finalDifference = `${differenceInNotificationTimeSecond}s`
        }


        else if (differenceInNotificationTimeMinute < 59) {
            finalDifference = `${differenceInNotificationTimeMinute}m`
        }
        else if (differenceInNotificationTimeHour < 24 && differenceInNotificationTimeMinute >= 59) {
            finalDifference = `${differenceInNotificationTimeHour}h`
        }
        else if (differenceInNotificationTimeHour >= 24) {
            finalDifference = `${differenceInNotificationTimeDay}d`
        }
        return (
            <View style={{ marginTop: constants.vh(22) }}>
                <Components.AlreadyChatArtistList
                    artistImage={
                        item.chatStatus === 3 || item.chatStatus === 2 ?
                            constants.AppConstant.bandoBlockChatlogo
                            :
                            !item.profileImage ? constants.AppConstant.bandoLogo : item.profileImage}
                    artistName={item.artistName != "" ? item.artistName : `${item.firstName} ${item.lastName}`}
                    isSearch={true}
                    recentMessage={item.recent.messageBody}
                    messageTime={`${finalDifference}`}
                    onPress={() => NavigationService.navigate(constants.ScreensName.Chatting.name, item)}
                />
            </View>


        )
    }
    const renderEmptyFeed = ({ }) => {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: HEIGHT * 0.15,
            }}>
                <Components.NoChatFound
                    title="Sorry ! No recent chat present."
                />
            </View>
        )
    }
    const handleProfileClick = async () => {
        await props.dispatch(getConsumerProfile());
    }
    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => handleProfileClick()}
                    >
                        <FastImage
                            style={styles.headerImage}
                            source={{
                                uri:
                                    props.auth?.userRegistered?.profileImage != null ?
                                        props.auth?.userRegistered?.profileImage :
                                        constants.AppConstant.bandoLogo
                                ,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.chatSearchContainer}>
                    <Text style={styles.titleText}>{constants.ConstStrings.chat}</Text>
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => NavigationService.navigate(constants.ScreensName.SearchArtistList.name, null)}
                    >
                        <Image
                            source={constants.Images.SearchTab}
                            resizeMode={"cover"}

                        />
                    </TouchableOpacity>
                </View>



                <View style={{ marginTop: constants.vh(21) }} >
                    <FlatList

                        data={props.chat.subcribedArtistList}
                        renderItem={renderItemForHorizontalFlatlist}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
                {/* <View style={{ width: "50%", backgroundColor: "red" }}>
                    <Text ellipsizeMode="tail" numberOfLines={1} >fdfdfdhfhdhfdhfhdfhdhfhdfhdhfhdfhh</Text>
                </View> */}
                <View style={{
                    width: "90%",
                    alignSelf: 'center',
                    flex: 1,
                    // backgroundColor: 'red'
                }}
                >
                    <FlatList
                        // inverted
                        data={props.chat.subcribedChatArtistList}
                        extraData={props.chat.subcribedChatArtistList}
                        renderItem={renderItemForAlreadyChatArtist}
                        ListEmptyComponent={renderEmptyFeed}

                    />
                </View>

                <Components.ProgressView
                    isProgress={props.chat.isLoading}
                    title={constants.AppConstant.Bando}
                />
            </SafeAreaView>

        </>
    )
}
function mapStateToProps(state) {
    let { auth, chat, home } = state;
    return {
        auth, chat, home
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtistList);