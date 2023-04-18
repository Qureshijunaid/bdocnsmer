import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Platform,
    StatusBar,
    Image,
    TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Toast from 'react-native-toast-message';

import * as NavigationService from '../../../navigation/NavigationService';
import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import { setRegistrationDetails, sendOtp } from '../../../actions/registration';

const AddPhoneNumber = (props) => {
    const [state, setState] = useState({
        activeButton: false,
        selectedCountryCode: "44",
        callingCode: "44",
        countryCode: "44",
        countryName: "GB",
        phone: '',
    })

    const handleNext = async () => {
        if (state.phone.length === 0) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter your phone number.",
                type: "error",
                position: "top"
            });
            return 1;
        }

        let modifiedPhone = state.phone.replace(/^0+/, '');
        if (modifiedPhone.length < 10) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "This phone number doesn't look right. Please ensure it's at least 10 digits.",
                type: "error",
                position: "top"
            });
            return 1;
        }

        const payload = {
            "phoneNumber": modifiedPhone,
            "phoneCode": state.callingCode,
            "countryName": state.countryName
        }

        await props.dispatch(setRegistrationDetails(payload))
        const payloadForSendOtp = {
            "phoneNumber": modifiedPhone,
            "countryCode": state.callingCode
        }
        await props.dispatch(sendOtp(payloadForSendOtp))
        //NavigationService.navigate(constants.ScreensName.YourOtp.name, null)
    }
    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                <View style={styles.dataContainer}>
                    <Components.HeaderWithProgress
                        presentCount={3}
                        totalCount={7}
                        onPress={() => { props.navigation.goBack() }}
                    />
                    <View style={styles.aboutYouContainer}>
                        <Text style={styles.text30bold}>{constants.ConstStrings.addYourPhone}</Text>
                        <Text style={styles.text30bold}>{constants.ConstStrings.number}</Text>
                        <Text style={styles.text16500}>{constants.ConstStrings.specifyYourPhoneNumber}</Text>
                        <Text style={styles.text16500}>{constants.ConstStrings.yourAccount}</Text>
                    </View>

                    <View style={styles.aboutYouContainer}>
                        <Components.PrimaryPhoneInput
                            placeholder="XXXX XXX XXX"
                            placeholderTextColor={constants.Colors.color_B9B9B9}
                            onChangeText={(phone) => setState({ ...state, phone })}
                            selectedCountryCode={state.selectedCountryCode}
                            keyboardType="numeric"
                            callingCode={state.callingCode}
                            countryName={state.countryName}
                            value={state.phone}
                            returnKeyType="done"
                            maxLength={11}
                            onSelect={(country) => {
                                // if (country.length < 12) {
                                setState({
                                    ...state,
                                    callingCode: country.callingCode[0],
                                    selectedCountryCode: country.callingCode[0],
                                    countryCode: `+${country.callingCode[0] ? country.callingCode[0] : "44"}`,
                                    countryName: country.cca2,
                                })
                                // }
                            }}
                        />
                    </View>
                    <View style={styles.infoTextContainer}>
                        <View style={{ width: 20 }}>
                            <Image
                                source={constants.Images.InfoSquare}
                            />
                        </View>

                        <View>
                            <Text style={styles.text14normal}>{constants.ConstStrings.weWillSendToYouAMessage}</Text>
                        </View>
                    </View>
                    <Text style={[styles.text14normal, { marginStart: 20 }]}>{constants.ConstStrings.numberForYouToConfirm}</Text>
                    <View style={styles.buttonContainer}>
                        <Components.PrimaryButton
                            title={constants.ConstStrings.next}
                            onPress={state.phone.length > 0 ? handleNext : null}
                            backgroundColor=
                            {
                                state.phone.length > 0 ?
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
        initialLogin, registration
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
)(AddPhoneNumber)