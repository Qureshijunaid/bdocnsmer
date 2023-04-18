import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Platform,
    StatusBar,
    Image,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import OTPInputView from '@twotalltotems/react-native-otp-input';

import * as NavigationService from '../../../navigation/NavigationService';
import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import { verifyOtp, reSendOtp } from '../../../actions/registration';

const YourOtp = (props) => {
    const [state, setState] = useState({
        activeButton: false,
        otp: '',
        clearOtp: false
    })

    const handleNext = async () => {
        const payload = {
            "otp": state.otp,
        }

        await props.dispatch(verifyOtp(payload))
    }

    const handleResend = async () => {

        setState({
            ...state,
            otp: '',
            clearOtp: true
        })
        await props.dispatch(reSendOtp())
    }
    return (

        <>
            <StatusBar barStyle="light-content" />

            <SafeAreaView style={styles.container}>
                <View style={styles.dataContainer}>
                    <Components.HeaderWithProgress
                        presentCount={4}
                        totalCount={7}
                        onPress={() => { props.navigation.goBack() }}
                    />
                    <View style={styles.aboutYouContainer}>
                        <Text style={styles.text30bold}>{constants.ConstStrings.addYourCode}</Text>
                        <Text style={[styles.text16500, { marginTop: constants.vh(13) }]}>{constants.ConstStrings.addYourRecievedCodeBelow}</Text>
                        <Text style={styles.text16500}>{constants.ConstStrings.weSentTheCodeTo} (+{props.registration.phoneCode}) {props.registration.phoneNumber}</Text>
                    </View>
                    <View style={styles.aboutYouContainer}>
                        <Text style={styles.text13normal}>{constants.ConstStrings.addCodeHere}</Text>

                        <OTPInputView
                            style={{ width: '100%', height: constants.vh(60) }}
                            pinCount={6}
                            code={state.otp}
                            onCodeChanged={otp => {
                                setState({
                                    ...state,
                                    clearOtp: false,
                                    otp: otp
                                })
                            }}
                            autoFocusOnLoad
                            codeInputFieldStyle={styles.underlineStyleBase}
                            codeInputHighlightStyle={styles.underlineStyleHighLighted}
                            onCodeFilled={(otp => {
                                setState({ ...state, otp: otp })
                            })}
                            clearInputs={state.clearOtp}
                        />
                    </View>
                    <Text
                        onPress={() => handleResend()}
                        style={[styles.text13normal, {
                            marginTop: constants.vh(25),
                            textDecorationLine: "underline"
                        }]}>{constants.ConstStrings.resendCodeAgain}</Text>
                    <View style={styles.buttonContainer}>
                        <Components.PrimaryButton
                            title={constants.ConstStrings.next}
                            onPress={state.otp.length > 5 ? handleNext : null}
                            backgroundColor=
                            {state.otp.length > 5 ?
                                constants.Colors.color_FF3062 :
                                constants.Colors.rgb_126_39_60
                            }
                        />
                    </View>
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
    const { initialLogin, registration } = state
    return {
        initialLogin,
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
)(YourOtp)