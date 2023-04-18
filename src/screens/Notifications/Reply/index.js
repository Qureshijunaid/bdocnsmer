import React, { useEffect, useState, useRef, createRef } from 'react';
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
    Alert,
    StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import TrackPlayer, { useTrackPlayerProgress } from "react-native-track-player";
import Entypo from 'react-native-vector-icons/Entypo';
import Voice from '@react-native-community/voice';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';

import constants from '../../../constants';
import Components from '../../../components';
import * as NavigationService from '../../../navigation/NavigationService';
import {
    getCommentList,
    CommentOnPost,
    getReplyList,
    ReplyOnComment,
    clearReplyList,
} from '../../../actions/post';
import { styles } from './styles';

const HEIGHT = Dimensions.get("window").height;

const ReplyNotification = (props) => {
    const [showPopUp, setShowPopUp] = useState(true)
    const [state, setState] = useState({
        showReply: true,
        showComment: false,
        reply: "",
        selectedPost: null,
        selectedComment: null,
        replyDone: false,
        replyListParams: []
    })
    useEffect(() => {
        const payload = {
            comment_id: props.route.params.notificationData.parent_id
        }
        props.dispatch(getReplyList(payload))
        const subscribeOnFocus = props.navigation.addListener('focus', () => {
            setShowPopUp(true)
        });
        const unsubscribe = props.navigation.addListener('blur', () => {
            setShowPopUp(false)
        });
        return () => {
            subscribeOnFocus;
            unsubscribe;
        }

    }, [props.route.params])

    const renderReply = ({ item, index }) => {
        // if (item.parent_id) {
        return (
            <>
                <View
                    style={{
                        width: "90%",
                        alignSelf: (item.commentBy === "artist" ? "flex-start" : "flex-end"),
                        alignItems: (item.commentBy === "artist" ? "flex-start" : "flex-end")
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
        // }

    }

    const handleReplyToComment = () => {
        let comment = state.reply.replace(/^\s+|\s+$/g, '')
        if (comment.length < 1) {
            return 1;
        }
        let parentCommentObj = props.post.replyList.find(item => item.parent_id === null)
        const payload = {
            "post_id": props.route.params.notificationData._id,
            "parent_id": parentCommentObj._id,
            //props.route.params.notificationData.parent_id,
            "comment": comment,

        }
        console.log("payload", payload);
        props.dispatch(ReplyOnComment(payload))
        setState({
            ...state,
            reply: "",
            replyDone: true
        })
    }

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor={constants.Colors.color_232323} />
            <SafeAreaView style={styles.container}>
                <View style={styles.dataContainer}>
                </View>
            </SafeAreaView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showPopUp}
            >

                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        props.dispatch(clearReplyList());
                        setState({
                            ...state,
                            showComment: false,
                            showReply: false
                        })
                        props.navigation.goBack()
                    }
                    }

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
                            activeOpacity={1}
                            style={styles.modalCommentSecondry}>
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
                                    alignItems: "center"
                                }}
                            >
                                <View
                                    style={{
                                        width: "50%"
                                    }}
                                >
                                    <Text
                                        numberOfLines={1}
                                        style={{
                                            fontSize: 18,
                                            fontWeight: "500",
                                            color: "#F0F0F0"
                                        }}>{props.route.params.notificationData?.artistName}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.crossIconContainer}>
                                    <Entypo
                                        onPress={() => {
                                            props.dispatch(clearReplyList());
                                            if (state.showReply) {
                                                setState({
                                                    ...state,
                                                    showReply: false
                                                })
                                            } else {
                                                setState({
                                                    ...state,
                                                    showComment: false
                                                })
                                            }
                                            props.navigation.goBack()
                                        }}
                                        name="cross"
                                        color={constants.Colors.white}
                                        size={25}
                                    />
                                </TouchableOpacity>
                            </View>
                            <>
                                <View
                                    style={{
                                        marginTop: constants.vh(31),
                                        flex: 1
                                    }}
                                >
                                    <FlatList
                                        //inverted={state.replyDone ? true : false}
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
                                            onSubmitEditing={handleReplyToComment}
                                        />
                                    </View>
                                </View>
                            </>
                        </TouchableOpacity>
                    </KeyboardAwareScrollView>
                </TouchableOpacity>
            </Modal>

        </>
    )
}

function mapStateToProps(state) {
    const { post, auth, profile, home } = state
    return {
        post,
        auth,
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
    mapDispatchToProps
)(ReplyNotification)