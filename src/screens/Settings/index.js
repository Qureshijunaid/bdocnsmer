import React, { useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    FlatList,
    Image,
    TouchableOpacity,
    Modal,
    ScrollView,
    Alert,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { openInbox, openComposer } from "react-native-email-link";
import Mailer from 'react-native-mail';

import Components from '../../components';
import constants from '../../constants';
import { styles } from './styles';
import { logOut, clearLogoutData } from '../../actions/auth';
import { getGenreMapWithPreValue } from '../../actions/registration';
import * as NavigationServices from '../../navigation/NavigationService';
import { setNewArtistNotification, setNewContentNotification } from '../../actions/profile'
import { deleteAllCachedVideo } from '../../utils/DownloadVideo';
import { clearMyFeed } from '../../actions/home';
import { requestChangeMyCredential, requestDeleteMyAccount } from "../../actions/auth";
const Settings = (props) => {
    const [state, setState] = React.useState({
        newArtistAdded: props.auth?.userRegistered?.newArtistAdded,
        newContentAdded: props.auth?.userRegistered?.newContentAdded,
        showLogout: false,
        showDeleteMyAccount: false
    })
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('blur', () => {
            setState({
                ...state,
                showLogout: false,
            })
        });
        return () => {
            unsubscribe;
        };
    }, []);


    const handleNewArtistAdded = () => {
        state.newArtistAdded = !state.newArtistAdded
        setState({
            ...state,

        })
        props.dispatch(setNewArtistNotification(state.newArtistAdded))
    }
    const handleNewContentAdded = () => {
        state.newContentAdded = !state.newContentAdded
        setState({
            ...state,

        })
        props.dispatch(setNewContentNotification(state.newContentAdded))
    }

    const handleLogout = () => {
        setState({
            ...state,
            showLogout: false
        })
        props.dispatch(logOut())
    }
    const handleReportAProblem = () => {
        Platform.OS === "ios" ? handleEmailIOS() : handleEmailAndroid()
    }
    const handleEmailAndroid = () => {
        const appVersion = "1.5.9"
        openComposer({
            to: "development@bando-app.com",
            subject: "Report a problem",
            body: `Hi, \n I have found an issue with \n App name: Bando Fans \n App version: ${appVersion} \n Platform: Android`,
        });
    }
    const handleEmailIOS = () => {
        const appVersion = "1.4.9 (1)"
        Mailer.mail({
            subject: 'Report a problem',
            recipients: ['development@bando-app.com'],
            //   ccRecipients: ['supportCC@example.com'],
            //   bccRecipients: ['supportBCC@example.com'],
            body: `<p>Hi,</p><p>I have found an issue with</p><p>App name: Bando Fans</p><p>App version: ${appVersion}</p><p>Platform: iOS</p>`,
            isHTML: true,
        }, (error, event) => {
            Alert.alert(
                error,
                event,
                [
                    { text: 'Ok', onPress: () => console.log('OK: Email Error Response') },
                    { text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response') }
                ],
                { cancelable: true }
            )
        });
    }
    const handleRequestDeleteMyAccount = () => {
        props.dispatch(requestDeleteMyAccount())
        setState({
            ...state,
            showDeleteMyAccount: false
        })
    }
    const handleRequestCredentialChange = () => {
        props.dispatch(requestChangeMyCredential())
    }

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                {/* <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => props.navigation.goBack()}
                    style={{ marginStart: 15, marginTop: 10 }}
                >

                    <AntDesign
                        name="arrowleft"
                        size={30}
                        color={constants.Colors.white}
                    />



                </TouchableOpacity>
*/}
                <View style={{
                    paddingHorizontal: 20,
                    marginTop: 10,
                    marginBottom: 10,
                }}>
                    <Components.HeaderWithTitle
                        onPress={() => props.navigation.goBack()}
                    // title="Terms and EULA"
                    />
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.text35bold}>{constants.ConstStrings.settings}</Text>
                </View>
                <View style={styles.dataContainer}>
                    <ScrollView>
                        <View style={styles.notificationContainer}>
                            <Text style={styles.text16bold}>{constants.ConstStrings.capitalNotifications}</Text>
                        </View>
                        <View style={styles.divider} />

                        <View style={styles.mainContainer}>
                            <Text style={styles.text16normal}>{constants.ConstStrings.newArtistAdded}</Text>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => { handleNewArtistAdded() }}
                            >
                                <Image
                                    style={{
                                        width: constants.vw(45),
                                        height: constants.vh(35),
                                        resizeMode: "contain"
                                    }}
                                    source={state.newArtistAdded ? constants.Images.ToggleOn : constants.Images.ToggleOff}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.divider} />

                        <View style={styles.mainContainer}>
                            <Text style={styles.text16normal}>{constants.ConstStrings.newContentAdded}</Text>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => { handleNewContentAdded() }}
                            >
                                <Image
                                    style={{
                                        width: constants.vw(45),
                                        height: constants.vh(35),
                                        resizeMode: "contain"
                                    }}
                                    source={state.newContentAdded ? constants.Images.ToggleOn : constants.Images.ToggleOff}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.divider} />

                        <View style={{
                            marginTop: constants.vh(52)
                        }}>
                            <View style={styles.divider} />
                            <TouchableOpacity
                                onPress={() => { NavigationServices.navigate(constants.ScreensName.TermsAndCondition.name, null) }}
                                activeOpacity={1}
                                style={styles.secondryContainer}>
                                <Text style={styles.text16normal}>{constants.ConstStrings.termsAndEula}</Text>
                                <View>
                                    <AntDesign
                                        name="right"
                                        color={constants.Colors.white}
                                        size={30}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={styles.divider} />
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => { NavigationServices.navigate(constants.ScreensName.PrivacyPolicy.name, null) }}
                                style={styles.secondryContainer}>
                                <Text style={styles.text16normal}>{constants.ConstStrings.privacyPolicy}</Text>
                                <View>
                                    <AntDesign
                                        name="right"
                                        color={constants.Colors.white}
                                        size={30}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={styles.divider} />
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => NavigationServices.navigate(constants.ScreensName.EditProfile.name, null)}
                                style={styles.secondryContainer}>
                                <Text style={styles.text16normal}>{constants.ConstStrings.edit_profile}</Text>
                                <View>
                                    <AntDesign
                                        name="right"
                                        color={constants.Colors.white}
                                        size={30}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={styles.divider} />
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => NavigationServices.navigate(constants.ScreensName.EditShippingDetails.name, null)}
                                style={styles.secondryContainer}>
                                <Text style={styles.text16normal}>{constants.ConstStrings.edit_shipping_address}</Text>
                                <View>
                                    <AntDesign
                                        name="right"
                                        color={constants.Colors.white}
                                        size={30}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={styles.divider} />
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => { NavigationServices.navigate(constants.ScreensName.EditConsumerGenre.name, props.dispatch(getGenreMapWithPreValue())) }}
                                style={styles.secondryContainer}>
                                <Text style={styles.text16normal}>{constants.ConstStrings.edit_interests}</Text>
                                <View>
                                    <AntDesign
                                        name="right"
                                        color={constants.Colors.white}
                                        size={30}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View style={styles.divider} />
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => NavigationServices.navigate(constants.ScreensName.PaymentSetting.name, null)}
                                style={styles.secondryContainer}>
                                <Text style={styles.text16normal}>{constants.ConstStrings.paymentSettings}</Text>
                                <View>
                                    <AntDesign
                                        name="right"
                                        color={constants.Colors.white}
                                        size={30}
                                    />
                                </View>
                            </TouchableOpacity>



                            {/* <View style={styles.divider} /> */}
                        </View>

                        <View style={styles.divider} />
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => handleReportAProblem()}
                            style={styles.secondryContainer}>
                            <Text style={styles.text16normal}>Report a problem</Text>
                            <View>
                                <AntDesign
                                    name="right"
                                    color={constants.Colors.white}
                                    size={30}
                                />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.divider} />
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                handleRequestCredentialChange()
                            }}
                            style={styles.secondryContainer}>
                            <Text style={styles.text16normal}>Request credential change</Text>
                            {/* <View>
                                <AntDesign
                                    name="right"
                                    color={constants.Colors.white}
                                    size={30}
                                />
                            </View> */}
                        </TouchableOpacity>
                        <View style={styles.divider} />

                        <View style={{
                            marginTop: constants.vh(50)
                        }}>
                            <View style={styles.divider} />
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                    setState({
                                        ...state,
                                        showLogout: true
                                    })
                                }}
                                style={styles.secondryContainer}>
                                <Text style={[styles.text16normal, { color: constants.Colors.color_FF3062 }]}>{constants.ConstStrings.logout}</Text>
                            </TouchableOpacity>
                            <View style={styles.divider} />
                        </View>

                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                setState({
                                    ...state,
                                    showDeleteMyAccount: true
                                })
                                //handleRequestDeleteMyAccount()
                            }}
                            style={styles.secondryContainer}>
                            <Text style={[styles.text16normal, { color: constants.Colors.color_FF3062 }]}>Delete my account</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />

                    </ScrollView>
                </View>
                <Components.ProgressView
                    isProgress={props.profile.isLoading}
                    title={constants.AppConstant.Bando}
                />
            </SafeAreaView>
            <Components.ProgressView
                isProgress={props.auth.isLoading}
                title={constants.AppConstant.Bando}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={state.showLogout}
            >
                <View
                    style={styles.modalMain}
                >
                    <View style={styles.modalSecondry}>
                        <Text style={styles.text23white}>Logout?</Text>
                        <Text
                            style={styles.text16C4C4C4}
                        >You sure you want to</Text>
                        <Text
                            style={styles.text16C4C4C4}
                        >logout?</Text>

                    </View>
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                // props.dispatch(clearLogoutData());
                                handleLogout();
                            }}
                            style={styles.modalButton}
                        >
                            <Text
                                style={[styles.text16white, {
                                    color: "#FF4F4F",
                                }]}
                            >Yes</Text>
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
                                setState({
                                    ...state,
                                    showLogout: false
                                })
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
                animationType="slide"
                transparent={true}
                visible={state.showDeleteMyAccount}
            >
                <View
                    style={styles.modalMain}
                >
                    <View style={styles.modalSecondry}>
                        <Text style={styles.text23white}>Delete?</Text>
                        <Text
                            style={styles.text16C4C4C4}
                        >Are you sure want to</Text>
                        <Text
                            style={styles.text16C4C4C4}
                        >delete your account?</Text>

                    </View>
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                // props.dispatch(clearLogoutData());
                                handleRequestDeleteMyAccount();
                            }}
                            style={styles.modalButton}
                        >
                            <Text
                                style={[styles.text16white, {
                                    color: "#FF4F4F",
                                }]}
                            >Yes</Text>
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
                                setState({
                                    ...state,
                                    showDeleteMyAccount: false
                                })
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
    const { auth, profile } = state
    return {
        auth, profile
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
)(Settings)