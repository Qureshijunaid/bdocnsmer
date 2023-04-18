import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Platform,
    StatusBar,
    FlatList,
    Image,
    TouchableOpacity,
    ScrollView,
    BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import * as NavigationService from '../../../navigation/NavigationService';
import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import { resetPassword, setForgetPasswordResetToken } from '../../../actions/registration'
const ResetPassword = (props) => {
    const [state, setState] = useState({
        activeButton: false,
        is8Characters: false,
        isOneCaps: false,
        isOneNumber: false,
        password: null,
        confirmPassword: null,
        hidePassword: true,
        hideConfirmPassword: true,
    })

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, [])
    const backAction = () => {
        return true;
    };

    const handlePasswordChange = (password) => {

        //checking if contains atleast one character
        if (constants.AppConstant.oneCapitalRegex.test(password)) {
            state.isOneCaps = true
            setState({
                ...state,
            })
        } else {
            state.isOneCaps = false
            setState({
                ...state,
            })
        }

        //checking if contains atleast one number
        if (constants.AppConstant.oneNumberRegex.test(password)) {
            state.isOneNumber = true
            setState({
                ...state,

            })
        } else {
            state.isOneNumber = false
            setState({
                ...state,
            })
        }

        //Length check for 8 character
        if (password.length > 7) {
            state.is8Characters = true
            setState({
                ...state,

            })
        } else {
            state.is8Characters = false
            setState({
                ...state,
            })
        }
        setState({
            ...state,
            password: password
        })
    }
    const handlePasswordShow = () => {
        setState({
            ...state,
            hidePassword: !state.hidePassword
        })
    }
    const handleConfirmPasswordShow = () => {
        setState({
            ...state,
            hideConfirmPassword: !state.hideConfirmPassword
        })
    }
    const handleNext = async () => {
        if (!state.is8Characters) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter a valid password",
                type: "error",
                position: "top"
            });
            return 1;
        }
        if (!state.isOneCaps) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter a valid password",
                type: "error",
                position: "top"
            });
            return 1;
        }
        if (!state.isOneNumber) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter a valid password",
                type: "error",
                position: "top"
            });
            return 1;
        }
        if (state.password !== state.confirmPassword) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Both passwords should be same.",
                type: "error",
                position: "top"
            });
            return 1;
        }

        await props.dispatch(setForgetPasswordResetToken({ "reset_token": props.route.params.resetToken }));
        const payload = {
            "password": state.password
        }
        await props.dispatch(resetPassword(payload));
    }
    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={[styles.container]}>
                <ScrollView style={styles.dataContainer}>

                    <View style={styles.aboutYouContainer}>
                        <Text style={styles.text30bold}>{constants.ConstStrings.reset}</Text>
                        <Text style={styles.text30bold}>{constants.ConstStrings.Password}</Text>
                        <Text style={[styles.text16500, { marginTop: 10 }]}>Please enter a new password and confirm password.</Text>
                        {/* <Text style={styles.text16500}>{constants.ConstStrings.linkToResetYourPassword}</Text> */}
                    </View>
                    <View style={styles.passwordContainer}>
                        <Components.PrimaryInput
                            placeholder={constants.ConstStrings.Password}
                            placeholderTextColor={constants.Colors.color_B9B9B9}
                            showSecure={true}
                            isSecure={state.hidePassword}
                            onIconpress={handlePasswordShow}
                            onChangeText={handlePasswordChange}
                        />
                    </View>
                    <View style={styles.resetPasswordContainer}>
                        <Components.PrimaryInput
                            placeholder={constants.ConstStrings.confirmPassword}
                            placeholderTextColor={constants.Colors.color_B9B9B9}
                            isSecure={state.hideConfirmPassword}
                            showSecure={true}
                            onIconpress={handleConfirmPasswordShow}
                            onChangeText={(confirmPassword) => {
                                setState({
                                    ...state,
                                    confirmPassword: confirmPassword
                                })
                            }}
                        />
                    </View>
                    <View style={styles.regexMatchContainer}>
                        <Components.PasswordRegexMatch
                            isMatched={state.is8Characters}
                            title={constants.ConstStrings.use8Characters}
                        />
                        <Components.PasswordRegexMatch
                            isMatched={state.isOneCaps}
                            title={constants.ConstStrings.useOneCaps}
                        />
                        <Components.PasswordRegexMatch
                            isMatched={state.isOneNumber}
                            title={constants.ConstStrings.useOneNumber}
                        />
                    </View>
                </ScrollView>
                <View style={{ paddingHorizontal: 15, marginBottom: 15 }}>
                    <Components.PrimaryButton
                        title={constants.ConstStrings.done}
                        onPress={state.is8Characters && state.isOneCaps && state.isOneNumber && (state.password === state.confirmPassword) ?
                            handleNext : null}
                        backgroundColor=
                        {state.is8Characters && state.isOneCaps && state.isOneNumber && (state.password === state.confirmPassword) ?
                            constants.Colors.color_FF3062 :
                            constants.Colors.rgb_126_39_60
                        }
                    />
                </View>
                <Components.ProgressView
                    isProgress={props.registration.isLoading}
                    title={constants.AppConstant.Bando}
                />
            </SafeAreaView>
        </>
    )
}

function mapStateToProps(state) {
    const { login, registration } = state
    return {
        login, registration

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
)(ResetPassword);