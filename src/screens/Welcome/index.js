import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    StatusBar,
    Dimensions,
    Platform,
    Touchable,
    Alert
} from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import * as Keychain from 'react-native-keychain';
import {
    AccessToken,
    GraphRequest,
    GraphRequestManager,
    LoginManager,
} from 'react-native-fbsdk';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';

import * as NavigationService from '../../navigation/NavigationService';
import constants from '../../constants';
import Components from '../../components';
import { styles } from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { checkSocialLogin } from '../../actions/auth';
import { setSocialLoginRegistrationDetails, setAppleLogin, setFirebaseUID } from '../../actions/registration';
import Toast from 'react-native-toast-message';
import { setUserFCMTokenToStorage } from '../../utils/asyncstorage'


const sDevice = (Dimensions.get('window').height <= 700)

const bannerArray = [
    { "body": constants.Images.welcome1, "header": constants.Images.w1Header },
    { "body": constants.Images.welcome2, "header": constants.Images.w2Header },
    { "body": constants.Images.welcome3, "header": constants.Images.w3Header },
    { "body": constants.Images.welcome4, "header": constants.Images.w4Header },
]

const Welcome = (props) => {
    const [state, setState] = useState({
        count: 0,
        fname: "",
        lname: "",
        email: "",
        appId: ""
    })

    const getFcmToken = async () => {
        const fcmToken = await messaging().getToken().then((fcmToken) => {
            setUserFCMTokenToStorage(fcmToken)
        }

        ).catch((error) =>
            () => getFcmToken()
        );
    };

    useEffect(() => {
        props.navigation.addListener('focus', focusHandler)

        GoogleSignin.configure({ webClientId: "870176039634-amsa4s9sh0dsbpr2f806197nnc34bqnr.apps.googleusercontent.com" });
        setInterval(() => {
            if (state.count < bannerArray.length - 1) {
                state.count = state.count + 1;
                setState({
                    ...state
                })
            } else {
                state.count = 0;
                setState({
                    ...state
                })
            }
        }, 3000);

        return () => {
            props.navigation.removeListener('focus', focusHandler)

        }
    }, [])

    const focusHandler = () => {
        getFcmToken();
    }

    const getInfoFromToken = (token) => {
        const PROFILE_REQUEST_PARAMS = {
            fields: {
                string: 'id,name,first_name,last_name,email',
            },
        };
        const profileRequest = new GraphRequest(
            '/me',
            { token, parameters: PROFILE_REQUEST_PARAMS },
            (error, user) => {
                if (error) {
                    Toast.show({
                        text1: constants.AppConstant.Bando,
                        text2: "Login error",
                        type: "error",
                        position: "top"
                    });

                } else {
                    let payload = {
                        "firstName": user.first_name,
                        "lastName": user.last_name,
                        "email": null,
                        "facebook": user.id,
                        "gmail": "",
                        "apple": "",
                    }
                    props.dispatch(setSocialLoginRegistrationDetails(payload));
                    setTimeout(() => {
                        props.dispatch(checkSocialLogin());
                    }, 500)
                }
            },
        );
        new GraphRequestManager().addRequest(profileRequest).start();
    };

    const handleFacebook = async () => {
        LoginManager.logOut();
        LoginManager.logInWithPermissions(['email', 'public_profile',])
            .then(
                login => {
                    if (login.isCancelled) {
                        Toast.show({
                            text1: constants.AppConstant.Bando,
                            text2: "Login cancelled",
                            type: "error",
                            position: "top"
                        });
                    } else {
                        AccessToken.getCurrentAccessToken().then(data => {
                            const accessToken = data.accessToken.toString();
                            getInfoFromToken(accessToken);
                        });
                    }
                },
                error => {
                    this.setState({ userInfo: error }, () => this.getData())
                    Toast.show({
                        text1: constants.AppConstant.Bando,
                        text2: "Login error",
                        type: "error",
                        position: "top"
                    });
                },
            );
    };

    const handleApple = async () => {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });

        const { identityToken, nonce } = appleAuthRequestResponse;
        const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

        auth().signInWithCredential(appleCredential).then(async (result) => {
            const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
            console.log("appleAuthRequestResponse", appleAuthRequestResponse);

            if (credentialState === appleAuth.State.AUTHORIZED) {
                if (appleAuthRequestResponse.email) {
                    const payload = {
                        "firstName": appleAuthRequestResponse.fullName.givenName,
                        "lastName": appleAuthRequestResponse.fullName.familyName,
                        "facebook": "",
                        "email": appleAuthRequestResponse.email,
                        "gmail": "",
                        "apple": appleAuthRequestResponse.user,
                        "appleFirebaseUid": result.user.uid
                    }
                    let dataToSaveKeyChain = {
                        "firstName": appleAuthRequestResponse.fullName.givenName,
                        "lastName": appleAuthRequestResponse.fullName.familyName,
                        "email": appleAuthRequestResponse.email,
                        "apple": appleAuthRequestResponse.user,
                        "appleFirebaseUid": result.user.uid
                    }
                    const username = JSON.stringify(dataToSaveKeyChain);
                    const password = appleAuthRequestResponse.user;

                    await Keychain.setGenericPassword(username, password);
                    console.log("payload welcome", payload);

                    props.dispatch(setSocialLoginRegistrationDetails(payload));
                    props.dispatch(setAppleLogin(true))

                    // setTimeout(() => {
                    //     props.dispatch(checkSocialLogin());
                    // }, 500)
                } else {
                    // Retrieve the credentials
                    Keychain.getGenericPassword().then(credentials => {
                        if (credentials) {
                            console.log(
                                'Credentials successfully loaded for user ' + credentials.username
                            );
                            let userData = JSON.parse(credentials.username)
                            const payload = {
                                "firstName": userData.firstName,
                                "lastName": userData.lastName,
                                "facebook": "",
                                "email": userData.email,
                                "gmail": "",
                                "apple": userData.apple,
                                "appleFirebaseUid": userData.appleFirebaseUid
                            }
                            console.log("payload welcome", payload);

                            props.dispatch(setSocialLoginRegistrationDetails(payload));
                            props.dispatch(setAppleLogin(true))

                            // setTimeout(() => {
                            //     props.dispatch(checkSocialLogin());
                            // }, 500)
                        } else {
                            // console.log('No credentials stored');
                            const payload = {
                                "firstName": "",
                                "lastName": "",
                                "facebook": "",
                                "email": "",
                                "gmail": "",
                                "apple": appleAuthRequestResponse.user,
                                "appleFirebaseUid": result.user.uid
                            }

                            props.dispatch(setSocialLoginRegistrationDetails(payload));
                            props.dispatch(setAppleLogin(true))
                        }
                    }).catch((error) => {
                        //console.log("Keychain couldn't be accessed!", error);
                        const payload = {
                            "firstName": "",
                            "lastName": "",
                            "facebook": "",
                            "email": "",
                            "gmail": "",
                            "apple": appleAuthRequestResponse.user,
                            "appleFirebaseUid": result.user.uid
                        }

                        props.dispatch(setSocialLoginRegistrationDetails(payload));
                        props.dispatch(setAppleLogin(true))
                    })
                }
            }

        }).catch(error =>
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Something went wrong.",
                type: "error",
                position: "top"
            })
        )

    }

    const handleGoogle = async () => {
        try {
            await GoogleSignin.signOut();
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            let payload = {
                "firstName": userInfo.user.givenName,
                "lastName": userInfo.user.familyName,
                "email": userInfo.user.email,
                "facebook": "",
                "gmail": userInfo.user.id,
                "apple": "",
            }
            props.dispatch(setSocialLoginRegistrationDetails(payload));
            setTimeout(() => {
                props.dispatch(checkSocialLogin());
            }, 500);
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: "Login cancelled",
                    type: "error",
                    position: "top"
                });
            } else if (error.code === statusCodes.IN_PROGRESS) {
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {

                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: "Login Error",
                    type: "error",
                    position: "top"
                });
            } else {
                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: "Login Error",
                    type: "error",
                    position: "top"
                });
            }
        }
    };

    const handleMail = () => {
        let payload = {
            "firstName": "",
            "lastName": "",
            "email": "",
            "facebook": "",
            "gmail": "",
            "apple": "",
        }
        props.dispatch(setSocialLoginRegistrationDetails(payload));
        NavigationService.navigate(constants.ScreensName.LogIn.name, null)
    }

    const showIosStatusBar = () => {
        if (Platform.OS !== 'ios') {
            return null;
        } else {
            return <View style={styles.iosStatusBar} />;
        }
    }

    return (
        <>
            <StatusBar backgroundColor={constants.Colors.black} barStyle="light-content" />
            <View style={styles.container}>
                <Components.BackgroundCarousel
                    images={bannerArray}
                    sliderButtonSize={10}
                    spaceBetweenButton={5}
                    showButton={false}
                    unselectedButtonBorderColor={constants.Colors.white}
                    sliderMarginBottom={sDevice ? constants.vh(170) : constants.vh(200)}
                />
                <LinearGradient
                    style={styles.secondryContainer}
                    colors={[constants.Colors.rgba_0_0_0_0, constants.Colors.rgb_0_0_0]}
                >
                    <View style={{
                        position: "absolute",
                        top: 0,
                        width: Dimensions.get("window").width
                    }}>
                        <Image
                            style={{
                                width: Dimensions.get("window").width,
                            }}
                            source={bannerArray[state.count].header}
                        />
                    </View>

                    <View style={styles.welcomeTextContainer}>
                        <Text style={styles.text25bold}>{constants.ConstStrings.welcome}</Text>
                        <Text style={styles.text16500}>{constants.ConstStrings.welcomeToBando}</Text>
                        <Text style={styles.text16500}>{constants.ConstStrings.trueArtist}</Text>
                        <View style={styles.signinUPContainer}>
                            <Text style={[styles.text16500, { fontSize: constants.vw(14), }]}>{constants.ConstStrings.signUpAndSignin}</Text>
                        </View>


                    </View>

                    <View style={styles.socialMediaContainer}>
                        {/* <TouchableOpacity
                            activeOpacity={1}
                            style={styles.buttonContainer}
                            onPress={() => { handleFacebook() }}
                        >
                            <Image
                                source={constants.Images.Facebook}
                                resizeMode={"contain"}
                                style={styles.imageStyle}
                            />

                        </TouchableOpacity> */}
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.buttonContainer}
                            onPress={() => { handleGoogle() }}
                        >
                            <Image
                                source={constants.Images.Google}
                                resizeMode={"contain"}
                                style={styles.imageStyle}
                            />

                        </TouchableOpacity>
                        {Platform.OS === "ios" ?
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.buttonContainer}
                                onPress={() => { handleApple() }}>
                                <Image
                                    source={constants.Images.Apple}
                                    resizeMode={"contain"}
                                    style={styles.imageStyle}
                                />
                            </TouchableOpacity>
                            : <></>
                        }
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            activeOpacity={1}
                            onPress={() => { handleMail() }}>
                            <Image
                                source={constants.Images.Mail}
                                resizeMode={"contain"}
                                style={styles.imageStyle}
                            />
                        </TouchableOpacity>
                    </View>

                </LinearGradient>

                <Components.ProgressView
                    isProgress={props.auth.isLoading}
                    title={constants.AppConstant.Bando}
                />
            </View>
        </>
    )
}


function mapStateToProps(state) {
    const { login, auth } = state
    return {
        login, auth

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
)(Welcome);