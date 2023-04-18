import React, { useState, useLayoutEffect } from 'react';
import {
    StatusBar,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Dimensions,
    Platform,
} from 'react-native';
import { connect } from 'react-redux';
import database from '@react-native-firebase/database';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Clipboard from '@react-native-community/clipboard';
import * as NavigationService from '../../../navigation/NavigationService';
import uuid from 'react-native-uuid';
import { setArtistID, getArtistDetail } from '../../../actions/profile';
import {
    setFirebaseMessage,
    clearFirebaseMessage, postChatLastMessage,
    setNavigationForSubcribedChat, clearSearchArtistForChat,
    setSearchParamsOfFirebase,
    sendChatNotification,
    setRecentChatMessage
} from '../../../actions/chat';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import { initializeFirebase } from '../../../utils/Firebase/FirebaseConfig';
const HEIGHT = Dimensions.get("window").height
const Chatting = (props) => {

    // let newUDID = null;
    useLayoutEffect(() => {
        initializeFirebase()
        getMessage()
    }, [])

    const [state, setState] = useState({
        reply: '',
        profileImage: props.route.params !== null ? props.route.params.profileImage : constants.AppConstant.bandoLogo,
        title: props.route.params !== null ? props.route.params.artistName != "" ? props.route.params.artistName :
            `${props.route.params.firstName} ${props.route.params.lastName}`
            :
            null,

        /*---------CHATS VARIABLES START HERE-----------*/
        chatStatus: props.route.params !== null && props.route.params.chatStatus,

        // Initialise Consumer Ids
        userId: props.route.params !== null && props.route.params.userId,
        userFirebaseId: props.route.params !== null && props.route.params.userFirebaseId,

        // Initialize Artist Ids
        artistId: props.route.params !== null && props.route.params.receiverId,
        artistFirebaseId: props.route.params !== null && props.route.params.receiverFirebaseId,
        /*---------CHATS VARIABLES ENDS HERE-----------*/

        nestedId: 0,
        replyList: [],
        getMesssgeFromFirebase: [],
        messageCounter: props.chat.firebaseMessageCounter
    })


    const getMessage = () => {
        database()
            .ref(`conversations/${state.userFirebaseId}/${state.artistFirebaseId}`)
            .on('value', async snapshot => {
                let firebaseData = snapshot.val()
                console.log('firebaseData====>', firebaseData)
                let payload = {
                    "getMesssgeFromFirebase": firebaseData,
                    "messageCounter": (firebaseData && firebaseData.length) ? firebaseData.length : 0

                }
                props.dispatch(setFirebaseMessage(payload))

            })

        database()
            .ref(`recents/consumers/${state.userFirebaseId}/${state.artistFirebaseId}/chatStatus`)
            .on('value', async snapshot => {
                let firebaseData = snapshot.val()
                if (!firebaseData) {
                } else {
                    state.chatStatus = firebaseData
                    setState({
                        ...state,

                    })
                }
            })
    }

    const renderReply = ({ item, index }) => {

        return (
            <>
                <View
                    style={{
                        width: "90%",
                        marginTop: constants.vh(10),
                        marginEnd: (item.messageBy === 1 ? constants.vw(10) : constants.vw(0)),
                        marginStart: (item.messageBy === 1 ? constants.vw(0) : constants.vw(10)),
                        alignSelf: (item.messageBy === 1 ? "flex-end" : "flex-start"),
                        alignItems: (item.messageBy === 1 ? "flex-end" : "flex-start")
                    }}
                >
                    <Components.ReplyCard
                        time={moment(item.createdAt).format('DD-MM-YY HH:mm')}
                        reply={item.messageBody}
                        profileImage={
                            state.chatStatus === 3 || state.chatStatus === 2 ?
                                item.messageBy === 2 &&
                                constants.AppConstant.bandoBlockChatlogo :
                                item.messageBy === 1 ? null :
                                    (!state.profileImage ? constants.AppConstant.bandoLogo : state.profileImage)
                        }
                        alignContent={(item.messageBy === 1 ? "flex-end" : "flex-start")}
                        backgroundColor={item.messageBy === 2 ? "#fff" : "#000"}
                        textColor={item.messageBy === 2 ? "#000" : "#fff"}
                        textAlign={item.messageBy === 2 ? "left" : "right"}
                        onLongPress={() => {
                            Clipboard.setString(item.messageBody)
                            Toast.show({
                                text1: constants.AppConstant.Bando,
                                text2: "Copied to clipboard",
                                type: "success",
                                position: "top"
                            });
                        }}
                    />
                </View>
            </>
        )
    }

    const handleText = () => {
        if (state.reply.length < 1) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter a message to send to the Artist.",
                type: "error",
                position: "top"
            });
            return 1;
        }
    }
    const handleReplyToComment = () => {
        let message = state.reply.replace(/^\s+|\s+$/g, '')
        if (message.length < 1) {
            // Toast.show({
            //     text1: constants.AppConstant.Bando,
            //     text2: "Please enter a message to send to the Artist.",
            //     type: "error",
            //     position: "top"
            // });
            return 1;
        }

        let newUDID = uuid.v4()

        database()
            .ref(`conversations/${state.userFirebaseId}/${state.artistFirebaseId}/${newUDID}`)
            .set({
                messageBody: message,
                type: 1,
                isDeleted: false,
                messageBy: 1,
                attachmentUrl: null,
                createdAt: new Date().toISOString(),
            })
            .then(() => setState({
                ...state,
                reply: '',
                nestedId: state.nestedId + 1
            }));
        //recent message of consumer

        database()
            .ref(`recents/consumers/${state.userFirebaseId}/${state.artistFirebaseId}/recent`)
            .set({
                messageBody: message,
                createdAt: new Date().toISOString(),
            })
            .then(() => setState({
                ...state,
                reply: '',
                nestedId: state.nestedId + 1
            }));

        //recent message of artist

        database()
            .ref(`recents/artists/${state.artistFirebaseId}/${state.userFirebaseId}/recent`)
            .set({
                messageBody: message,
                createdAt: new Date().toISOString(),
            })
            .then(() => setState({
                ...state,
                reply: '',
                nestedId: state.nestedId + 1
            }));


        if (props.chat.firebaseMessages.length === 0) {
            let data = {
                "messageBody": message,
                'receiverId': state.artistId,
                "receiverFirebaseId": state.artistFirebaseId
            }
            props.dispatch(postChatLastMessage(data))
        }
        const dataForNotification = {
            "messageBody": message,
            'receiverId': state.artistId,
            "receiverFirebaseId": state.artistFirebaseId
        }
        props.dispatch(sendChatNotification(dataForNotification))

        setState({
            ...state,
            reply: "",
        })
    }
    const inputTextBox = () => {
        return (
            <View
                style={{
                    // marginTop:Height*0.76,
                    marginTop: constants.vh(10),
                    width: "95%",
                    alignSelf: "center"
                }}
            >
                <Components.SendChatMessage
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
                // onSubmitEditing={handleReplyToComment}
                // onSubmitEditing={handleText}
                />
            </View>
        )
    }
    const blockedMessage = () => {
        return (
            <View style={{ flex: 0.9, justifyContent: "center", alignItems: "center" }}>
                <Text style={styles.text70018}>{constants.ConstStrings.sorry}</Text>
                <Text style={[styles.text60012, { marginTop: constants.vh(12) }]}>{constants.ConstStrings.artistSorryMessageChat}</Text>
                <Text style={styles.text60012}>{constants.ConstStrings.artistSorryMessageChat2}</Text>
            </View>
        )
    }

    const subscriptionEnd = () => {
        return (
            <View style={{ flex: 0.9, justifyContent: "center", alignItems: "center", }}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => showArtistDetail(state.artistId)}
                    style={
                        styles.primaryButtonContainer}>
                    <Text style={[styles.text16600]}>Subscribe</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const accountDeleteMessage = () => {
        return (
            <View style={{ flex: 0.8, justifyContent: "center", alignItems: "center" }}>
                <Text style={[styles.text60012, { marginTop: constants.vh(12), fontSize: 14 }]}>{constants.ConstStrings.deleteAccountSorry}</Text>
                <Text style={[styles.text60012, { fontSize: 14 }]}>{constants.ConstStrings.deleteAccountSorry1}</Text>
            </View>
        )
    }
    const notSubcribed = () => {
        return (
            <View style={{ flex: 0.9, justifyContent: "center", alignItems: "center", marginTop: Platform.OS === "android" ? "50%" : "50%" }}>
                <Text style={styles.text70018}>{constants.ConstStrings.sorry}</Text>
                <Text style={[styles.text60012, { marginTop: constants.vh(12) }]}>{constants.ConstStrings.artistSubcribeMessageChat}</Text>
                <Text style={styles.text60012}>{constants.ConstStrings.artistSubcribeMessageChat2}</Text>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => showArtistDetail(state.artistId)}
                    style={
                        styles.primaryButtonContainer}>
                    <Text style={[styles.text16600]}>Subscribe</Text>

                </TouchableOpacity>
            </View>
        )
    }

    const showArtistDetail = (data) => {
        props.dispatch(setSearchParamsOfFirebase(props.route.params))
        props.dispatch(clearSearchArtistForChat())
        props.dispatch(setNavigationForSubcribedChat())
        props.dispatch(setArtistID(data))
        props.dispatch(getArtistDetail("homeArtistDetail"))
    }

    const handleBack = () => {
        NavigationService.navigate(constants.ScreensName.ArtistList.name, null)
        props.dispatch(clearSearchArtistForChat())
        setTimeout(() => {
            props.dispatch(clearFirebaseMessage())
        }, 100)
    }

    return (
        <>
            <StatusBar barStyle="light-content" />
            <View style={styles.headerContainer}>
                <Components.ChattingHeader
                    onPress={() => handleBack()}
                    artistImage={
                        state.chatStatus === 3 || state.chatStatus === 2 ? constants.AppConstant.bandoBlockChatlogo :
                            !state.profileImage ? constants.AppConstant.bandoLogo : state.profileImage}
                    artistName={state.title}
                    onArtistProfile={() => showArtistDetail(state.artistId)}
                />
            </View>
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={false}
                extraHeight={150}
                style={styles.container}>
                {/* {state.chatStatus != 4 ? */}
                {props.chat.firebaseMessages.length > 0 || state.chatStatus != 4 ?
                    <View
                        style={{
                            flex: 1,
                            height: HEIGHT - constants.vh(180),
                        }}
                    >
                        <FlatList
                            inverted
                            data={props.chat.firebaseMessages}
                            extraData={props.chat.firebaseMessages}
                            showsVerticalScrollIndicator={false}
                            renderItem={renderReply}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    : null}

                {state.chatStatus === 1 ?
                    inputTextBox()
                    : (state.chatStatus === 2 || state.chatStatus === 3) ?
                        blockedMessage()
                        : state.chatStatus === 4 ?
                            props.chat.firebaseMessages.length > 0 ?
                                subscriptionEnd()
                                :
                                notSubcribed() : state.chatStatus === 5 ?
                                accountDeleteMessage() : null
                }

            </KeyboardAwareScrollView>
            <Components.ProgressView
                isProgress={props.profile.isLoading}
                title={constants.AppConstant.Bando}
            />
            {/* <Components.ProgressView
                isProgress={props.chat.isLoading}
                title={constants.AppConstant.Bando}
            /> */}

        </>
    )
}
function mapStateToProps(state) {
    let { post, auth, profile, chat } = state;
    return {
        post, auth, profile, chat
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chatting);