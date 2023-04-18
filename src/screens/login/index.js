import React, { useRef } from 'react';
import {
    SafeAreaView,
    View,
    StatusBar,
    Text,
    ImageBackground,
    TouchableOpacity,
    Keyboard
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as EmailValidator from 'email-validator';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import * as NavigationService from '../../navigation/NavigationService';
import constants from '../../constants';
import Components from '../../components';
import { styles } from './styles';
import { login } from '../../actions/auth';

const LogIn = (props) => {

    const emailRef = useRef();
    const passwordRef = useRef();

    const [state, setState] = React.useState({
        hidePassword: true,
        email: '',
        password: '',
        remember: false
    })
    const handlePasswordShow = () => {
        setState({
            ...state,
            hidePassword: !state.hidePassword
        })
    }
    const handleSignIn = () => {
        Keyboard.dismiss()
        if (state.email.length === 0) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter an email address.",
                type: "error",
                position: "top"
            });
            return 1;
        }
        if (!EmailValidator.validate(state.email.toLowerCase())) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter a valid email.",
                type: "error",
                position: "top"
            });
            return 1;
        }
        if (state.password.length === 0) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter your password",
                type: "error",
                position: "top"
            });
            return 1;
        }
        if (!constants.AppConstant.PASSWORD_REGEX.test(state.password)) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Your password must contain 1 capital letter, at least 8 characters and 1 number",
                type: "error",
                position: "top"
            });
            return 1;
        }
        const payload = {
            "email": state.email.toLowerCase(),
            "password": state.password,
            "stayLoggedIn": state.remember
        }
        props.dispatch(login(payload))
    }

    return (
        <>
            <StatusBar barStyle="light-content" />
            <ImageBackground
                style={styles.imageBackground}
                source={constants.Images.welcome4}
            />
            <LinearGradient
                style={styles.container}
                locations={[0, 0.7]}
                colors={[constants.Colors.rgba_0_0_0_0, constants.Colors.rgb_0_0_0]}
            >
                <SafeAreaView style={styles.secondryContainer}>
                    <View style={styles.headerContainer}>
                        <Components.HeaderWithLogo
                            //onPress={() => { props.navigation.goBack() }}
                            onPress={() => { props.navigation.navigate(constants.ScreensName.Welcome.name) }}
                        />
                    </View>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps="handled"
                        style={styles.dataContainer}
                        enableOnAndroid={true}
                        extraHeight={210}
                    >
                        <View style={styles.welcomeContainer}>
                            <Text style={styles.text25bold}>{constants.ConstStrings.welcome}</Text>
                            <Text style={styles.text16500}>{constants.ConstStrings.signInWithYourEmail}</Text>
                        </View>
                        <View style={styles.emailContainer}>
                            <Components.PrimaryInput
                                placeholder={constants.ConstStrings.email}
                                placeholderTextColor={constants.Colors.color_B9B9B9}
                                keyboardType="email-address"
                                onChangeText={(email) => {
                                    setState({
                                        ...state,
                                        email: email
                                    })
                                }}
                                inputRef={emailRef}
                                blurOnSubmit={false}
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    passwordRef.current.focus()
                                }}
                                value={state.email}
                            />
                        </View>
                        <View style={styles.passwordContainer}>
                            <Components.PrimaryInput
                                placeholder={constants.ConstStrings.Password}
                                placeholderTextColor={constants.Colors.color_B9B9B9}
                                showSecure={true}
                                isSecure={state.hidePassword}
                                onIconpress={handlePasswordShow}
                                onChangeText={(password) => {
                                    setState({
                                        ...state,
                                        password: password
                                    })
                                }}
                                value={state.password}
                                inputRef={passwordRef}
                                blurOnSubmit={false}
                                returnKeyType="done"
                                onSubmitEditing={() => {
                                    Keyboard.dismiss()
                                    //passwordRef.current.focus()
                                }}
                                paddingRight={50}
                            />
                        </View>

                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                setState({
                                    ...state,
                                    remember: !state.remember
                                })
                            }}
                            style={styles.rememberContainer}>
                            <MaterialCommunityIcons
                                name={
                                    state.remember ?
                                        "check-box-outline" :
                                        "checkbox-blank-outline"
                                }

                                color={constants.Colors.white}
                                size={20}
                            />
                            <Text style={[styles.text14Normal,
                            {
                                textDecorationLine: "underline",
                                marginStart: constants.vw(10)
                            }
                            ]}>Remember</Text>
                        </TouchableOpacity>



                        <View style={styles.signUpAndForgotContainer}>
                            <View style={styles.didNotHaveAccountContainer}>
                                <Text style={styles.text14Normal}>{constants.ConstStrings.dontHaveAccount}</Text>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => {
                                        setState({
                                            ...state,
                                            password: "",
                                            email: ""
                                        });
                                        NavigationService.navigate(constants.ScreensName.PersonalDetails.name, null);

                                    }}
                                >
                                    <Text style={styles.text14Bold}> {constants.ConstStrings.signUp}</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => NavigationService.navigate(constants.ScreensName.RecoverPassword.name, null)}
                            >
                                <Text style={[styles.text14Normal,
                                {
                                    textDecorationLine: "underline"
                                }
                                ]}>{constants.ConstStrings.forgotPassword}</Text>
                            </TouchableOpacity>

                        </View>


                        <View style={styles.buttonContainer}>
                            <Components.PrimaryButton
                                title={constants.ConstStrings.signIn}
                                onPress={handleSignIn}
                            />
                        </View>

                    </KeyboardAwareScrollView>

                    <Components.ProgressView
                        isProgress={props.auth.isLoading}
                        title={constants.AppConstant.Bando}
                    />
                </SafeAreaView>
            </LinearGradient>
        </>
    )
}

function mapStateToProps(state) {
    const { auth } = state
    return {
        auth
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
)(LogIn)