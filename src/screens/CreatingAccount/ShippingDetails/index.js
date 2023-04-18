import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Platform,
    StatusBar,
    ScrollView,
    Keyboard
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

const ShippingDetails = (props) => {

    const address1Ref = useRef();
    const address2Ref = useRef();
    const flatRef = useRef();
    const postCodeRef = useRef();
    const cityRef = useRef();

    const [state, setState] = useState({
        spotify: '',
        website: '',
        facebook: '',
        instagram: '',
        soundCloud: '',
        address1: "",
        address2: "",
        buildingNum: "",
        postalCode: "",
        city: "",
        callingCode: "GB",
        country: "United Kingdom",
        activeButton: false,
        countryDropDownVisible: false,
    })

    const handleNext = async () => {
        Keyboard.dismiss();
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
            "address1": state.address1,
            "address2": state.address2,
            "buildingNum": state.buildingNum,
            "postalCode": state.postalCode,
            "city": state.city,
            "country": state.country,
            "countryCode": state.callingCode
        }

        const payload = {
            "shipping_address": shipping_address
        }
        await props.dispatch(setRegistrationDetails(payload));
        await props.dispatch(getGenre());
    }

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                <View style={{
                    paddingHorizontal: 15
                }}>
                    <Components.HeaderWithProgress
                        presentCount={5}
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
                    extraHeight={200}
                >
                    <View style={styles.socialMediaContainer}>
                        <Text style={styles.text30bold}>{constants.ConstStrings.shippingDetails}</Text>
                        <Text style={styles.text16500}>{constants.ConstStrings.addShippingDetailsForWhenYouPurchase}</Text>
                        <Text style={styles.text16500}>{constants.ConstStrings.artistMerchandise}</Text>
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
                                title={state.buildingNum ? "Flat/Building Number" : false}
                                placeholderTextColor={constants.Colors.color_B9B9B9}
                                placeholder={"Flat/Building Number"}
                                // maxLength={50}
                                inputRef={flatRef}
                                blurOnSubmit={false}
                                returnKeyType="next"
                                autoCapitalize="sentences"
                                onSubmitEditing={() => {
                                    address1Ref.current.focus()
                                }}
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
                                title={state.address1 ? "Address Line 1" : false}
                                placeholderTextColor={constants.Colors.color_B9B9B9}
                                placeholder={"Address Line 1"}
                                // maxLength={200}
                                inputRef={address1Ref}
                                blurOnSubmit={false}
                                returnKeyType="next"
                                autoCapitalize="sentences"
                                onSubmitEditing={() => {
                                    address2Ref.current.focus()
                                }}
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
                                title={state.address2 ? "Address Line 2 (Optional)" : false}
                                placeholderTextColor={constants.Colors.color_B9B9B9}
                                placeholder={"Address Line 2 (Optional)"}
                                // maxLength={200}
                                inputRef={address2Ref}
                                blurOnSubmit={false}
                                returnKeyType="next"
                                autoCapitalize="sentences"
                                onSubmitEditing={() => {
                                    postCodeRef.current.focus()
                                }}
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
                                title={state.postalCode ? "Postcode" : false}
                                placeholderTextColor={constants.Colors.color_B9B9B9}
                                placeholder={"Postcode"}
                                // maxLength={15}
                                inputRef={postCodeRef}
                                blurOnSubmit={false}
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    cityRef.current.focus()
                                }}
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
                                title={state.city ? "City" : false}
                                placeholderTextColor={constants.Colors.color_B9B9B9}
                                placeholder={"City"}
                                // maxLength={50}
                                inputRef={cityRef}
                                blurOnSubmit={false}
                                returnKeyType="done"
                                autoCapitalize="sentences"
                                onSubmitEditing={() => {
                                    // passwordRef.current.focus()
                                    Keyboard.dismiss();
                                }}
                            />
                        </View>
                        {/*<View style={styles.input}>
                                                    <Components.DropdownCard
                                                        title={state.country}
                                                        onPress={()=>handleCountryDropDown()}
                                                    />
                                                </View>*/}

                        <View style={styles.input}>
                            <CountryPicker
                                shouldNotVisible={false}
                                countryCode={state.callingCode}
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
                                        callingCode: country.cca2,
                                        country: country.name,
                                    })
                                )}
                            />
                        </View>

                        <View style={styles.nextButtonContainer}>
                            <Components.PrimaryButton
                                title={constants.ConstStrings.next}
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
)(ShippingDetails)