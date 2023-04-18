import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Platform,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Modal,
    BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import * as NavigationService from '../../../navigation/NavigationService';
import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import { setRegistrationDetails, registration, getGenre } from '../../../actions/registration';
import CountryPicker from '../../../components/CountryPicker/lib'
import Feather from 'react-native-vector-icons/Feather';
import { editShippingAddress } from '../../../actions/profile'

const ShippingDetails = (props) => {
    const [state, setState] = useState({
        address1: props.auth.userRegistered.shipping_address ?
            props.auth.userRegistered.shipping_address[0].line1.charAt(0).toUpperCase() +
            props.auth.userRegistered.shipping_address[0].line1.slice(1)
            : '',
        address2: props.auth.userRegistered.shipping_address ?
            props.auth.userRegistered.shipping_address[0].line2.charAt(0).toUpperCase() +
            props.auth.userRegistered.shipping_address[0].line2.slice(1)
            : '',
        buildingNum: props.auth.userRegistered.shipping_address ?
            props.auth.userRegistered.shipping_address[0].flat_number
            : '',
        postalCode: props.auth.userRegistered.shipping_address ? (props.auth.userRegistered.shipping_address[0].post_code).toString() : '',
        city: props.auth.userRegistered.shipping_address ?
            props.auth.userRegistered.shipping_address[0].city.charAt(0).toUpperCase() +
            props.auth.userRegistered.shipping_address[0].city.slice(1)
            : '',
        countryCode: props.auth.userRegistered.shipping_address ? props.auth.userRegistered.shipping_address[0].countryCode : '',
        country: props.auth.userRegistered.shipping_address ? props.auth.userRegistered.shipping_address[0].country : '',
        activeButton: false,
        countryDropDownVisible: false,
        showGoBack: false,
    })

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);

    const backAction = () => {
        setState({
            ...state,
            showGoBack: true
        })
        return true;
    };

    const handleNext = async () => {
        if (state.address1.length === 0) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter the first line of your address.",
                type: "error",
                position: "top"
            });
            return 1;
        }

        if (state.buildingNum.length === 0) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter your Flat/Building Number",
                type: "error",
                position: "top"
            });
            return 1;
        }

        if (state.postalCode.length === 0) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter a valid postcode",
                type: "error",
                position: "top"
            });
            return 1;
        }
        if (state.postalCode.length > 0) {
            if (!state.postalCode.match(constants.AppConstant.POSTAL_CODE_REGEX)) {
                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: "Please enter a valid postcode",
                    type: "error",
                    position: "top"
                });
                return 1;
            }
        }

        if (state.city.length === 0) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter your city",
                type: "error",
                position: "top"
            });
            return 1;
        }

        if (state.country.length === 0) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter your country",
                type: "error",
                position: "top"
            });
            return 1;
        }

        const shipping_address = {
            "line1": state.address1,
            "line2": state.address2,
            "flat_number": state.buildingNum,
            "post_code": state.postalCode,
            "city": state.city,
            "country": state.country,
            "countryCode": state.countryCode
        }

        const payload = {
            "shipping_address": shipping_address
        }
        await props.dispatch(editShippingAddress(payload));
    }

    const handleGoBack = () => {
        setState({
            ...state,
            showGoBack: false
        })
        props.navigation.goBack()
    }

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                {/* <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => { setState({ ...state, showGoBack: true }) }}
                    style={styles.headerContainer}>
                    <Feather
                        name="arrow-left"
                        size={25}
                        color={constants.Colors.white}
                    /> */}
                <View style={{
                    paddingHorizontal: 20,
                    marginTop: 10,
                    marginBottom: 10,
                }}>
                    <Components.HeaderWithTitle
                        onPress={() => { setState({ ...state, showGoBack: true }) }}
                    />
                </View>
                <Text style={styles.text30bold}>{constants.ConstStrings.edit_shipping_address}</Text>
                {/* </TouchableOpacity> */}
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="handled"
                    style={styles.dataContainer}
                    enableOnAndroid={true}
                    extraHeight={200}
                >
                    <View style={{ ...styles.editYourProfileContainer }}>
                        {/* <Text style={styles.text30bold}>{"EditShippingDetails"}</Text> */}
                        <Text style={styles.text16500}>{"Edit your Bando shipping address here to ensure your purchases are sent to the correct location."}</Text>
                    </View>



                    <ScrollView style={styles.inputContainer}>

                        <View style={styles.input}>
                            <Components.PrimaryInput
                                onChangeText={(buildingNum) => {
                                    if (buildingNum.length < 51) {
                                        setState({
                                            ...state,
                                            buildingNum: buildingNum,
                                        })
                                    }
                                }}
                                value={state.buildingNum}
                                title={state.buildingNum ? "Flat/Building Number" : false}
                                placeholderTextColor={constants.Colors.color_B9B9B9}
                                placeholder={"Flat/Building Number"}
                                // maxLength={50}
                                autoCapitalize="sentences"
                            />
                        </View>

                        <View style={styles.input}>
                            <Components.PrimaryInput
                                onChangeText={(address1) => {
                                    if (address1.length < 201) {
                                        setState({
                                            ...state,
                                            address1: address1,
                                        })
                                    }
                                }}
                                value={state.address1}
                                title={state.address1 ? "Address Line 1" : false}
                                placeholderTextColor={constants.Colors.color_B9B9B9}
                                placeholder={"Address Line 1"}
                                // maxLength={200}
                                autoCapitalize="sentences"
                            />
                        </View>

                        <View style={styles.input}>
                            <Components.PrimaryInput
                                onChangeText={(address2) => {
                                    if (address2.length < 201) {
                                        setState({
                                            ...state,
                                            address2: address2,
                                        })
                                    }
                                }}
                                value={state.address2}
                                title={state.address2 ? "Address Line 2 (Optional)" : false}
                                placeholderTextColor={constants.Colors.color_B9B9B9}
                                placeholder={"Address Line 2 (Optional)"}
                                // maxLength={200}
                                autoCapitalize="sentences"
                            />
                        </View>


                        <View style={styles.input}>
                            <Components.PrimaryInput
                                onChangeText={(postalCode) => {
                                    if (postalCode.length < 16) {
                                        setState({
                                            ...state,
                                            postalCode: postalCode,
                                        })
                                    }
                                }}
                                value={state.postalCode}
                                title={state.postalCode ? "Postcode" : false}
                                placeholderTextColor={constants.Colors.color_B9B9B9}
                                placeholder={"Postcode"}
                            // maxLength={15}
                            />
                        </View>

                        <View style={styles.input}>
                            <Components.PrimaryInput
                                onChangeText={(city) => {
                                    if (city.length < 51) {
                                        setState({
                                            ...state,
                                            city: city,
                                        })
                                    }
                                }}
                                value={state.city}
                                title={state.city ? "City" : false}
                                placeholderTextColor={constants.Colors.color_B9B9B9}
                                placeholder={"City"}
                                // maxLength={50}
                                autoCapitalize="sentences"
                            />
                        </View>
                        <View style={styles.input}>
                            {/* <Text style={styles.text13normal}>Country</Text> */}
                            <CountryPicker
                                title={state.city ? "City" : false}
                                shouldNotVisible={false}
                                countryCode={state.countryCode}
                                withCountryNameButton={true}
                                withCallingCode={false}
                                withCloseButton={true}
                                containerButtonStyle={{
                                    fontFamily: constants.Fonts.Poppins_Regular,
                                    flexDirection: "row",
                                    textAlignVertical: "center",
                                    paddingVertical: constants.vh(16),
                                    paddingHorizontal: constants.vw(20),
                                    width: "100%",
                                    borderRadius: 8,
                                    backgroundColor: constants.Colors.color_333333,
                                    fontSize: 16,
                                    fontFamily: constants.Fonts.K2D_Regular,
                                }}

                                onSelect={(country) => (
                                    setState({
                                        ...state,
                                        countryCode: country.cca2,
                                        country: country.name,
                                    })
                                )}
                            />
                        </View>
                        <View style={styles.nextButtonContainer}>
                            <Components.PrimaryButton
                                title={constants.ConstStrings.save}
                                onPress={
                                    (state.address1.length > 0 && state.buildingNum.length > 0
                                        && state.postalCode.length > 0 && state.city.length > 0) ? handleNext : null}
                                backgroundColor={
                                    (state.address1.length > 0 && state.buildingNum.length > 0
                                        && state.postalCode.length > 0 && state.city.length > 0)
                                        ? constants.Colors.color_FF3062 : constants.Colors.rgb_126_39_60
                                }
                            />
                        </View>
                    </ScrollView>
                </KeyboardAwareScrollView>
                <Components.ProgressView
                    isProgress={props.profile.isLoading}
                    title={constants.AppConstant.Bando}
                />

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={state.showGoBack}
                >
                    <View
                        style={styles.modalMain}
                    >
                        <View style={styles.modalSecondry}>
                            {/* <Text style={styles.text23white}>Logout?</Text> */}
                            <Text
                                style={{ ...styles.text16C4C4C4, marginTop: constants.vh(20) }}
                            >Are you sure you want to</Text>
                            <Text
                                style={styles.text16C4C4C4}
                            >go back?</Text>

                        </View>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={handleGoBack}
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
                                        showGoBack: false
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

            </SafeAreaView>
        </>
    )
}

function mapStateToProps(state) {
    const { registration, auth, profile } = state
    return {
        registration, auth, profile
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
)(ShippingDetails)