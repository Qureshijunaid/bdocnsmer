import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Platform,
    StatusBar,
    Image,
    TouchableOpacity,
    Modal,
    Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as EmailValidator from 'email-validator';

import * as NavigationService from '../../../navigation/NavigationService';
import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
//import { setInitialLoginDetails } from '../../../actions/initialLogin';
import { setRegistrationDetails, verifyEmail } from '../../../actions/registration';
const AddEmailPassword = (props) => {

    const emailRef = useRef();
    const passwordRef = useRef();

    const [state, setState] = React.useState({
        password: "",
        hidePassword: true,
        email: props.registration.email ? props.registration.email : '',
        activeButton: false,
        is8Characters: false,
        isOneCaps: false,
        isOneNumber: false,
        showSorryModal: false,
        isEmailEditable: props.registration.gmail ? true : (props.registration.apple ? true : false),
    })

    const handleToggleSorryModal = (value) => {
        setState({
            ...state,
            showSorryModal: value
        })
    }
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

    const handleNext = async () => {
        Keyboard.dismiss()
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
        if (state.email.length === 0) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter email",
                type: "error",
                position: "top"
            });
            return 1;
        }
        if (!EmailValidator.validate(state.email.toLowerCase())) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter a valid email address.",
                type: "error",
                position: "top"
            });
            return 1;
        }

        const payload = {
            "email": state.email.toLowerCase(),
            "password": state.password
        }

        await props.dispatch(setRegistrationDetails(payload))
        //NavigationService.navigate(constants.ScreensName.PhoneNumber.name, null)
        const payloadForEmailVerification = {
            "email": state.email.toLowerCase()
        }
        await props.dispatch(verifyEmail(payloadForEmailVerification))
    }
    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                <View style={{ paddingHorizontal: 15 }}>
                    <Components.HeaderWithProgress
                        presentCount={2}
                        totalCount={7}
                        onPress={() => { props.navigation.goBack() }}
                    />
                </View>

                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="handled"
                    style={styles.dataContainer}
                    enableOnAndroid={true}
                    extraHeight={140}
                >
                    <View style={styles.addYourPasswordContainer}>
                        <Text style={styles.text30bold}>{constants.ConstStrings.addYourPassword}</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.input}>
                            {!state.isEmailEditable ?
                                <Components.PrimaryInput
                                    placeholder={constants.ConstStrings.email}
                                    placeholderTextColor={constants.Colors.color_B9B9B9}
                                    showTitle={state.email.length > 0 ? true : false}
                                    keyboardType="email-address"
                                    value={state.email}
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
                                />
                                :
                                <Components.PrimaryInput
                                    onPressLock={() => { handleToggleSorryModal(true) }}
                                    title="Email"
                                    editable={false}
                                    value={props.registration.email}
                                    showLock={true}
                                    inputTextColor={constants.Colors.white}
                                />}
                        </View>
                        <View style={styles.input}>
                            <Components.PrimaryInput
                                placeholder={constants.ConstStrings.password}
                                placeholderTextColor={constants.Colors.color_B9B9B9}
                                isSecure={state.hidePassword}
                                showTitle={state.password.length > 0 ? true : false}
                                showSecure={true}
                                onIconpress={handlePasswordShow}
                                onChangeText={handlePasswordChange}
                                inputRef={passwordRef}
                                blurOnSubmit={false}
                                returnKeyType="done"
                                onSubmitEditing={() => {
                                    Keyboard.dismiss()
                                    //passwordRef.current.focus()
                                }}
                            />
                        </View>


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
                    <View style={styles.inputContainer}>
                        <Text style={styles.text13normal}>{constants.ConstStrings.byClickingNextYouAgree}</Text>
                        <View style={styles.termsAndDataUseContainer}>
                            <TouchableOpacity onPress={() => { props.navigation.navigate(constants.ScreensName.TermsAndCondition.name) }}>
                                <Text style={styles.text13bold}>{constants.ConstStrings.termsEula}{' '}</Text>
                            </TouchableOpacity>
                            <Text style={styles.text13normal}>{constants.ConstStrings.and}{' '}</Text>
                            <TouchableOpacity onPress={() => props.navigation.navigate(constants.ScreensName.PrivacyPolicy.name)}>
                                <Text style={styles.text13bold}>{constants.ConstStrings.dataUsePolicy}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* </View> */}
                    <View style={styles.buttonContainer}>
                        <Components.PrimaryButton
                            title={constants.ConstStrings.next}
                            onPress={state.is8Characters && state.isOneCaps && state.isOneNumber && (state.email.length > 0) ?
                                handleNext : null}
                            backgroundColor=
                            {state.is8Characters && state.isOneCaps && state.isOneNumber && (state.email.length > 0) ?
                                constants.Colors.color_FF3062 :
                                constants.Colors.rgb_126_39_60
                            }
                        />
                    </View>
                </KeyboardAwareScrollView>
                <Components.ProgressView
                    isProgress={props.registration.isLoading}
                    title={constants.AppConstant.Bando}
                />
            </SafeAreaView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={state.showSorryModal}
            >
                <TouchableOpacity
                    onPress={() => handleToggleSorryModal(false)}
                    activeOpacity={1}
                    style={styles.modalSorryMain}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.modalSorrySecondry}>
                        <View style={{
                            paddingVertical: constants.vh(20),
                            paddingHorizontal: constants.vw(20),
                        }}>
                            <Text style={[styles.text18bold, { textAlign: "center" }]}>Sorry!</Text>
                            <View >
                                <Text style={styles.text14600}>To protect our customers, we prevent verified artists from altering certain account information. </Text>
                                <Text style={styles.text14600}>If you’d like to edit this information, please contact us at support@bando.com and we’ll be in touch shortly.</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => handleToggleSorryModal(false)}
                            style={styles.modalOkButtonContainer}>
                            <Text style={styles.text16500}>Ok</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>

                </TouchableOpacity>
            </Modal>
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
)(AddEmailPassword)