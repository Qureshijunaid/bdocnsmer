import React, { useState, useEffect, createRef } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Platform,
    StatusBar,
    TouchableOpacity,
    Image,
    Modal,
    Dimensions
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from "react-native-actions-sheet";
import Toast from 'react-native-toast-message';

import * as NavigationService from '../../../navigation/NavigationService';
import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import { setRegistrationDetails, registration } from '../../../actions/registration';

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const Notifications = (props) => {
    const [state, setState] = useState({
        artistAdded: false,
        contentAdded: false,
    })

    const handleNext = async () => {
        const payload = {
            "artistAdded": state.artistAdded,
            "contentAdded": state.contentAdded
        }

        await props.dispatch(setRegistrationDetails(payload));
        await props.dispatch(registration());
    }

    const handleMaybeLater = async () => {
        const payload = {
            "artistAdded": false,
            "contentAdded": false,
        }

        await props.dispatch(setRegistrationDetails(payload));
        await props.dispatch(registration());
    }

    const handleartistAdded = () => {
        setState({
            ...state,
            artistAdded: !state.artistAdded
        })
    }
    const handlecontentAdded = () => {
        setState({
            ...state,
            contentAdded: !state.contentAdded
        })
    }
    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                <View style={{
                    paddingHorizontal: 15
                }}>
                    <Components.HeaderWithProgress
                        presentCount={7}
                        totalCount={7}
                        onPress={() => {
                            props.navigation.goBack()
                        }}
                    />
                </View>
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="handled"
                    style={styles.dataContainer}
                    enableOnAndroid={true}
                    extraHeight={240}
                >
                    <View style={styles.dataContainer}>
                        <View style={styles.profileImageContainer}>
                            <Image
                                source={constants.Images.NotificationCross}
                            />
                            <View style={{
                                marginTop: constants.vh(40)
                            }}>
                                <Text style={styles.text30normal}>{constants.ConstStrings.neverMissAnArtist}</Text>
                            </View>
                            <View style={{
                                marginTop: constants.vh(15)
                            }}>
                                <Text style={styles.text16normal}>{constants.ConstStrings.weWillKeepYouUpToDate}</Text>
                                <Text style={styles.text16normal}>{constants.ConstStrings.youCanCustomizeYourAlerts}</Text>
                            </View>

                            <View style={styles.mainContainer}>
                                <Text style={styles.text16normal}>{constants.ConstStrings.newArtistAdded}</Text>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => { handleartistAdded() }}
                                >
                                    <Image
                                        style={{
                                            width: constants.vw(40),
                                            height: constants.vh(30),
                                            resizeMode: "contain"
                                        }}
                                        source={state.artistAdded ? constants.Images.ToggleOn : constants.Images.ToggleOff}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.divider} />

                            <View style={styles.mainContainer}>
                                <Text style={styles.text16normal}>{constants.ConstStrings.newContentAdded}</Text>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => { handlecontentAdded() }}
                                >
                                    <Image
                                        style={{
                                            width: constants.vw(40),
                                            height: constants.vh(30),
                                            resizeMode: "contain"
                                        }}
                                        source={state.contentAdded ? constants.Images.ToggleOn : constants.Images.ToggleOff}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.divider} />


                            <View style={styles.instructionTextContainer}>
                                <Image
                                    source={constants.Images.InfoSquare}
                                    style={{
                                        alignSelf: "center"
                                    }}
                                />
                                <Text style={styles.text14normal}>{constants.ConstStrings.notificationPreviewWillBeShownWhether}</Text>

                            </View>
                            <View style={styles.buttonContainer}>
                                <Components.PrimaryButton
                                    title={constants.ConstStrings.allowNotifications}
                                    onPress={() => { state.artistAdded || state.contentAdded ? handleNext() : null }}
                                    backgroundColor=
                                    {
                                        state.artistAdded || state.contentAdded ? constants.Colors.color_FF3062 : constants.Colors.rgb_126_39_60
                                    }
                                />
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => {
                                        handleMaybeLater()
                                    }}
                                >
                                    <Text style={styles.text16normal}>{constants.ConstStrings.maybeLater}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <Components.ProgressView
                    isProgress={props.registration.isLoading}
                    title={constants.AppConstant.Bando}
                />
            </SafeAreaView>
        </>
    )
}

function mapStateToProps(state) {
    const { registration } = state
    return {
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
)(Notifications)