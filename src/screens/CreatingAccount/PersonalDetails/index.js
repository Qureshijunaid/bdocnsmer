import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Platform,
    StatusBar,
    Dimensions,
    ScrollView,
    Modal,
    TouchableOpacity,
    FlatList,
    Keyboard
} from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import CalendarPicker from 'react-native-calendar-picker';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { connect } from 'react-redux';
import Toast from 'react-native-toast-message';
import * as EmailValidator from 'email-validator';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Entypo from 'react-native-vector-icons/Entypo';

import * as NavigationService from '../../../navigation/NavigationService';
import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import { setRegistrationDetails, verifyEmail } from '../../../actions/registration';

const WIDTH = Dimensions.get("window").width;
// const todayDate = moment(new Date()).format("DD/MM/YYYY")

const todayDate = new Date();
const futureDate = moment(todayDate).add(1, 'M').format("DD/MM/YYYY")
const PersonalDetails = (props) => {

    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const aboutRef = useRef();

    const [state, setState] = useState({
        activeButton: false,
        showCalendar: false,
        dateOfBirth: todayDate,
        firstName: props.registration.firstName ? props.registration.firstName : '',
        lastName: props.registration.lastName ? props.registration.lastName : '',
        email: '',
        artistName: '',
        aboutText: "",
        showFNameTitle: false,
        showLNameTitle: false,
        showArtistTitle: false,
        showDobTitle: false,
        showEmailTitle: false,
        showOptional: true,
        showGender: false,
        gender: "",
        genderData: ["Male", "Female", "Other", "Prefer not to say"],
        isDOBValid: false
    })

    const onDateChange = (date) => {
        setState({
            ...state,
            dateOfBirth: date,
            isDOBValid: true
            // dateOfBirth: moment(date).format("DD/MM/YYYY"),
            //showCalendar: false
        })
    }
    const openCalendar = () => {
        Keyboard.dismiss();
        setState({
            ...state,
            showCalendar: !state.showCalendar
        })
    }
    const handleNext = async () => {
        Keyboard.dismiss()
        if (state.firstName.length === 0) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter your first name",
                type: "error",
                position: "top"
            });
            return 1;
        }
        if (state.lastName.length === 0) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter your last name",
                type: "error",
                position: "top"
            });
            return 1;
        }
        if (state.gender.length === 0) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please select your gender",
                type: "error",
                position: "top"
            });
            return 1;
        }
        if (state.dateOfBirth > todayDate) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please provide a valid date of birth",
                type: "error",
                position: "top"
            });
            return 1;
        }
        const payload = {
            "firstName": state.firstName,
            "lastName": state.lastName,
            "email": state.email.toLowerCase(),
            "aboutYou": state.aboutText,
            "gender": state.gender,
            "dob": state.dateOfBirth < todayDate ? moment(state.dateOfBirth).format("MM/DD/YYYY") : ""

        }
        await props.dispatch(setRegistrationDetails(payload));

        if (props.registration.isAppleLogin) {
            NavigationService.navigate(constants.ScreensName.ShippingDetails.name, null);
        }
        else {
            NavigationService.navigate(constants.ScreensName.AddEmailPassword.name, null);
        }


    }
    const handleGenderDropdown = (value) => {
        Keyboard.dismiss();
        setState({
            ...state,
            showGender: value
        })
    }
    const renderGender = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={styles.modalItemContainer}
                onPress={() => handleGenderSelect(item)}
            >
                <Text style={[styles.text16normal, {
                    color: state.gender === item ? constants.Colors.color_FF3062 : constants.Colors.white
                }]}>{item}</Text>
            </TouchableOpacity>
        )
    }
    const handleGenderSelect = (item) => {
        setGender(item)
        handleGenderDropdown(false)
    }

    const setGender = (item) => {
        state.gender = item
        setState({
            ...state,
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
                        presentCount={1}
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
                    <View style={styles.applyToBandoContainer}>
                        <Text style={styles.text30bold}>{constants.ConstStrings.personalDetails}</Text>
                        <Text style={styles.text16500}>{constants.ConstStrings.tellUsWhoYouAre}</Text>
                    </View>
                    <View style={[styles.inputContainer, { marginTop: constants.vh(40) }]}>
                        <Components.PrimaryInput
                            placeholder={constants.ConstStrings.firstName}
                            placeholderTextColor={constants.Colors.color_B9B9B9}
                            showTitle={state.firstName.length > 0 ? true : false}
                            value={state.firstName}
                            // maxLength={40}
                            autoCapitalize="words"
                            onChangeText={(firstName) => {
                                if (firstName.length < 41) {
                                    setState({
                                        ...state,
                                        firstName
                                    })
                                }
                            }}
                            inputRef={firstNameRef}
                            blurOnSubmit={false}
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                lastNameRef.current.focus()
                            }}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Components.PrimaryInput
                            placeholder={constants.ConstStrings.lastName}
                            placeholderTextColor={constants.Colors.color_B9B9B9}
                            showTitle={state.lastName.length > 0 ? true : false}
                            value={state.lastName}
                            // maxLength={40}
                            autoCapitalize="words"
                            onChangeText={(lastName) => {
                                if (lastName.length < 41) {
                                    setState({
                                        ...state,
                                        lastName
                                    })
                                }
                            }}
                            inputRef={lastNameRef}
                            blurOnSubmit={false}
                            returnKeyType="next"
                            onSubmitEditing={() => {
                                aboutRef.current.focus()
                            }}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Components.DropdownCard
                            title={state.gender ? state.gender : "Gender"}
                            onPress={() => handleGenderDropdown(true)}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Components.CalendarButton
                            onPress={() => { openCalendar() }}
                            date={
                                state.isDOBValid ?
                                    moment(state.dateOfBirth).format("MM/DD/YYYY")
                                    :
                                    "MM/DD/YYYY"
                            }
                        />

                    </View>
                    <View style={styles.inputContainer}>
                        <Components.PrimaryInput
                            placeholder={`${constants.ConstStrings.pleaseTellUsAboutYourself} (optional)`}
                            placeholderTextColor={constants.Colors.color_B9B9B9}
                            showTitle={state.aboutText.length > 0 ? true : false}
                            multiline={true}
                            maxLength={100}
                            autoCapitalize="sentences"
                            blurOnSubmit={true}
                            textAlignVertical={"top"}
                            height={constants.vh(128)}
                            onChangeText={(aboutText) => {
                                // if (email.length < 101) {
                                setState({
                                    ...state,
                                    aboutText
                                })
                                // }
                            }}
                            inputRef={aboutRef}
                            blurOnSubmit={false}
                        //returnKeyType="done"
                        // onSubmitEditing={() => {
                        //     // passwordRef.current.focus()
                        //     Keyboard.dismiss()
                        // }}
                        />
                    </View>
                    <Text style={styles.text12bold}
                    >{state.aboutText.length}/100</Text>
                    <View style={styles.nextButtonContainer}>
                        <Components.PrimaryButton
                            title={constants.ConstStrings.next}
                            onPress={state.gender.length > 0 &&
                                // state.aboutText.length > 20 &&
                                state.firstName.length > 0 &&
                                state.lastName.length > 0 ? handleNext
                                : null
                            }
                            backgroundColor=
                            {
                                state.gender.length > 0 &&
                                    // state.aboutText.length > 20 &&
                                    state.firstName.length > 0 &&
                                    state.lastName.length > 0 ?
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
                visible={state.showCalendar}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        setState({
                            ...state,
                            showCalendar: false
                        })
                    }}
                    style={styles.modalContainer}>

                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.modalDataContainer}
                    >
                        <View style={{ flex: 1 }}>
                            <View style={{ ...styles.modalHeaderContainerSpaceBetween }}>
                                <Text style={{ ...styles.text16500, padding: 10 }}>{constants.ConstStrings.dateOfBirth}</Text>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => {
                                        setState({
                                            ...state,
                                            showCalendar: false
                                        })
                                    }}
                                    style={styles.modalCrossContainer}
                                >
                                    <Entypo
                                        name="cross"
                                        size={constants.vw(25)}
                                        color={constants.Colors.white}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={{ ...styles.modalFlatlistContainer, ...styles.modalItemContainer }}>
                                <DatePicker
                                    date={state.dateOfBirth}
                                    mode="date"
                                    onDateChange={onDateChange}
                                    fadeToColor={'none'}
                                    //locale={props.data.app_language}
                                    textColor={constants.Colors.color_FF3062}
                                    androidVariant="iosClone"
                                />
                            </View>


                        </View>
                    </TouchableOpacity>

                </TouchableOpacity>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={state.showGender}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => { handleGenderDropdown(false) }}
                    style={styles.modalContainer}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.modalDataContainer}
                    >
                        <View style={{ flex: 1 }}>
                            <View style={styles.modalHeaderContainer}>

                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => { handleGenderDropdown(false) }}
                                    style={styles.modalCrossContainer}
                                >
                                    <Entypo
                                        name="cross"
                                        size={constants.vw(25)}
                                        color={constants.Colors.white}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalFlatlistContainer}>
                                <FlatList
                                    data={state.genderData}
                                    renderItem={renderGender}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>

                </TouchableOpacity>
            </Modal>
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
)(PersonalDetails)