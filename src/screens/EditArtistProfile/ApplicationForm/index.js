import React, { createRef, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    View,
    Text,
    TouchableOpacity,
    Image,
    ImageBackground,
    Modal,
    FlatList,
    Dimensions,
    BackHandler,
    Alert,
    Linking,
    Platform,
} from 'react-native';
import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image';
import Entypo from 'react-native-vector-icons/Entypo';
import moment from 'moment';
import ActionSheet from "react-native-actions-sheet";
import Toast from 'react-native-toast-message';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { launchImageLibrary } from 'react-native-image-picker';
import * as EmailValidator from 'email-validator';
import DatePicker from 'react-native-date-picker';

import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import { editConsumerDetail } from '../../../actions/profile';
import Cropper from '../../../components/Cropper'

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const todayDate = new Date().toISOString();
const dumyDate = new Date('1970/01/01');
const EditProfile = (props) => {
    const actionSheetRef = createRef();
    const [state, setState] = React.useState({
        activeButton: false,
        firstName: props.auth.userRegistered.firstName,
        lastName: props.auth.userRegistered.lastName,
        selectedCountryCode: props.auth.userRegistered.phoneCode,
        callingCode: props.auth.userRegistered.phoneCode,
        countryCode: props.auth.userRegistered.phoneCode,
        countryName: props.auth.userRegistered.countryName,
        phone: props.auth.userRegistered.phoneNumber ? props.auth.userRegistered.phoneNumber : "",
        showSorryModal: false,
        image: "",
        imageFull: null,
        activeButton: false,
        isVisibleProfilePhoto: false,
        profilePhoto: null,
        email: props.auth.userRegistered.email,
        bio: props.auth.userRegistered.bio ? props.auth.userRegistered.bio : "",
        handleCameraAndGalleryValue: false,
        gender: props.auth.userRegistered.gender,
        genderData: ["Male", "Female", "Other", "Prefer not to say"],
        showGender: false,
        showCalendar: false,
        dob: props.auth.userRegistered.dob ? new Date(props.auth.userRegistered.dob) : new Date("1970"),
        showGoBack: false,
        isCropping: false
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

    const handleGoBack = () => {
        setState({
            ...state,
            showGoBack: false
        })
        props.navigation.goBack()
    }

    const handleCameraAndGallery = (value) => {
        state.handleCameraAndGalleryValue = value
        setState({
            ...state,
        })
    }

    const handleToggleSorryModal = (value) => {
        setState({
            ...state,
            showSorryModal: value
        })
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

    const handleReadStoragePermission = async () => {
        request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE || PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY).then((result) => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    Platform.OS === "ios" ? handleOpenLibraryIOS() : handleOpenLibraryAndroid()
                    break;
                case RESULTS.DENIED:
                    handleCameraAndGallery(false)
                    break;
                case RESULTS.LIMITED:
                    Platform.OS === "ios" ? handleOpenLibraryIOS() : handleOpenLibraryAndroid()
                    break;
                case RESULTS.GRANTED:
                    Platform.OS === "ios" ? handleOpenLibraryIOS() : handleOpenLibraryAndroid()
                    break;
                case RESULTS.BLOCKED:
                    Alert.alert(
                        "Bando",
                        "You need to change permission from setting.",
                        [
                            { text: "Go to setting", onPress: () => Linking.openSettings() },
                            { text: "Cancel", onPress: () => { } },
                        ],
                        { cancelable: false }
                    );
                    break;
            }
        })
    };

    const handleCameraPermission = async () => {
        request(PERMISSIONS.ANDROID.CAMERA || PERMISSIONS.IOS.CAMERA).then((result) => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    break;
                case RESULTS.DENIED:
                    handleCameraAndGallery(false)
                    break;
                case RESULTS.LIMITED:
                    handleCameraAndGallery(false)
                    break;
                case RESULTS.GRANTED:
                    Platform.OS === "ios" ? handleOpenCameraIOS() : handleOpenCameraAndroid()
                    break;
                case RESULTS.BLOCKED:
                    Alert.alert(
                        "Bando",
                        "You need to change permission from setting.",
                        [
                            { text: "Go to setting", onPress: () => Linking.openSettings() },
                            { text: "Cancel", onPress: () => { } },
                        ],
                        { cancelable: false }
                    );
                    break;
            }
        })
    };

    const handleOpenCameraIOS = () => {
        let options = {
            mediaType: "photo",
        };
        launchCamera(options, (response) => {
            handleCameraAndGallery(false)
            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {

                Alert.alert(response.customButton);
            } else {
                let source = response;
                let imageSizeInKb = source.fileSize / 1024
                let imageSizeInMb = imageSizeInKb / 1024
                if (imageSizeInMb < 10) {
                    setState({
                        ...state,
                        image: source.uri,
                        isCropping: true,
                    })
                }
                else {
                    Toast.show({
                        text1: constants.AppConstant.Bando,
                        text2: constants.ConstStrings.imageValidationSize,
                        type: "error",
                        position: "top"
                    });
                }
            }
        });
    }

    const handleOpenCameraAndroid = () => {
        let options = {
            mediaType: "photo",
            cropping: true,
            maxWidth: 1000,
            maxHeight: 1000,
            compressImageQuality: 1,
        };

        ImagePicker.openCamera(options).then(response => {
            handleCameraAndGallery(false)
            let source = response;
            if (source.mime == "image/jpeg" || source.type == "image/png") {
                if (source.size > 10000000) {
                    Toast.show({
                        text1: constants.AppConstant.Bando,
                        text2: "Sorry, the uploaded image must be less than 10 mb",
                        type: "error",
                        position: "top"
                    });
                } else {
                    setState({
                        ...state,
                        profilePhoto: source.path,
                    })
                }
            } else {
                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: "Invalid image. The image format should be jpeg, jpg or png",
                    type: "error",
                    position: "top"
                });
            }
        }).catch(error => {
        });

    }

    const handleOpenLibraryIOS = () => {
        let options = {
            mediaType: "photo",
        };
        launchImageLibrary(options, (response) => {
            handleCameraAndGallery(false)
            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {

                Alert.alert(response.customButton);
            } else {
                let source = response;
                let imageSizeInKb = source.fileSize / 1024
                let imageSizeInMb = imageSizeInKb / 1024
                if (imageSizeInMb < 10) {
                    setState({
                        ...state,
                        image: source.uri,
                        isCropping: true,
                    })
                }
                else {
                    Toast.show({
                        text1: constants.AppConstant.Bando,
                        text2: constants.ConstStrings.imageValidationSize,
                        type: "error",
                        position: "top"
                    });
                }
            }
        });
    }

    const handleOpenLibraryAndroid = () => {
        let options = {
            mediaType: "photo",
            multiple: false,
            maxWidth: 1000,
            maxHeight: 1000,
            cropping: true,
            compressImageQuality: 1,
        };

        ImagePicker.openPicker(options).then(response => {
            handleCameraAndGallery(false)
            let source = response;
            if (source.mime == "image/jpeg" || source.type == "image/png") {

                if (source.size > 10000000) {
                    Toast.show({
                        text1: constants.AppConstant.Bando,
                        text2: "Sorry, the uploaded image must be less than 10 mb",
                        type: "error",
                        position: "top"
                    });
                } else {
                    setState({
                        ...state,
                        profilePhoto: source.path,
                    })
                }
            } else {
                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: "Invalid image. The image format should be jpeg, jpg or png",
                    type: "error",
                    position: "top"
                });
            }
        }).catch(error => {
        });

    }

    const handleSaveButton = async () => {
        if (!EmailValidator.validate(state.email.toLowerCase())) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter a valid email address.",
                type: "error",
                position: "top"
            });
            return 1;
        }

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

        // if (state.bio.length === 0) {
        //     Toast.show({
        //         text1: constants.AppConstant.Bando,
        //         text2: "Please tell us about yourself.",
        //         type: "error",
        //         position: "top"
        //     });
        //     return 1;
        // }
        let pickDate = state.dob.toISOString()
        let pickerDate = moment(pickDate).format(moment.HTML5_FMT.DATE);
        let todayDateHere = moment(todayDate).format(moment.HTML5_FMT.DATE);
        if (pickerDate >= todayDateHere) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please provide a valid date of birth",
                type: "error",
                position: "top"
            });
            return 1;
        }


        let payload = {
            profileImage: state.profilePhoto,
            firstName: state.firstName,
            lastName: state.lastName,
            //dob:state.dob,
            dob: moment(state.dob).format("MM/DD/YYYY"),
            email: state.email.toLowerCase(),
            gender: state.gender,
            bio: state.bio ? state.bio : "",
            phoneCode: state.callingCode,
            phoneNumber: state.phone
        }

        await props.dispatch(editConsumerDetail(payload))

    }

    const handleChangeProfilePhoto = () => {
        state.isVisibleProfilePhoto = true
        setState({
            ...state,
        })
        handleCameraAndGallery(true)
    }

    const handleGenderDropdown = (value) => {
        setState({
            ...state,
            showGender: value
        })
    }

    const openCalendar = () => {
        setState({
            ...state,
            showCalendar: !state.showCalendar
        })
    }

    const onDateChange = (date) => {
        setState({
            ...state,
            dob: date,
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

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                {
                    state.isCropping ?

                        <Cropper
                            image={state.image}
                            hideAspects
                            onCroppedComplete={(result) => {
                                setState({
                                    ...state,
                                    profilePhoto: result.uri,
                                    isCropping: false
                                })
                            }}
                            onClose={() => {
                                setState({
                                    ...state,
                                    image: "",
                                    handleCameraAndGalleryValue: false,
                                    isCropping: false
                                })
                            }}
                        />

                        :
                        <>

                            <View style={{
                                paddingHorizontal: 20,
                                marginTop: 10,
                                marginBottom: 10,
                            }}>
                                <Components.HeaderWithTitle
                                    onPress={() => { setState({ ...state, showGoBack: true }) }}
                                />
                            </View>
                            <Text style={styles.text30bold}>Edit Profile</Text>
                            <KeyboardAwareScrollView
                                keyboardShouldPersistTaps="handled"
                                style={styles.dataContainer}
                                enableOnAndroid={true}
                                extraHeight={240}
                            >

                                <View style={styles.editYourProfileContainer}>
                                    <Text style={styles.text16500}>Edit your Bando profile here in order to manage what others can see about you.</Text>
                                </View>

                                <View style={styles.profilePicContainer}>
                                    <ImageBackground
                                        source={constants.Images.ProfileCircle}
                                        style={{
                                            width: constants.vw(92),
                                            height: constants.vw(92),
                                            borderRadius: constants.vw(92 / 2),
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                    >
                                        <FastImage
                                            source={{
                                                uri: state.profilePhoto != null ?
                                                    state.profilePhoto : (
                                                        props.auth?.userRegistered?.profileImage ?
                                                            props.auth.userRegistered.profileImage
                                                            : constants.AppConstant.bandoLogo
                                                    ),
                                                priority: FastImage.priority.high
                                            }}
                                            style={{
                                                width: constants.vw(80),
                                                height: constants.vw(80),
                                                borderRadius: constants.vw(80 / 2),
                                                //resizeMode: "cover"
                                            }}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                    </ImageBackground>
                                </View>

                                <TouchableOpacity
                                    activeOpacity={1}
                                    hitSlop={styles.hitSlop}
                                    style={styles.changePicContainer}
                                    onPress={() =>
                                        handleChangeProfilePhoto()
                                    }
                                >
                                    <Feather
                                        name="camera"
                                        size={constants.vw(20)}
                                        color={constants.Colors.white}
                                    />
                                    <Text>{"  "}</Text>
                                    <Text style={[styles.text14500, { textDecorationLine: "underline" }]}>
                                        {props.auth?.userRegistered?.profileImage ? 'Change profile photo' : 'Add profile photo'}

                                    </Text>
                                </TouchableOpacity>

                                <View style={styles.inputContainer}>
                                    <Components.PrimaryInput
                                        title="First Name"
                                        editable={true}
                                        value={state.firstName}
                                        autoCapitalize="words"
                                        inputTextColor={constants.Colors.white}
                                        onChangeText={(
                                            (text) => {
                                                setState({
                                                    ...state,
                                                    firstName: text
                                                })
                                            }
                                        )}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Components.PrimaryInput
                                        title="Last Name"
                                        editable={true}
                                        value={state.lastName}
                                        autoCapitalize="words"
                                        inputTextColor={constants.Colors.white}
                                        onChangeText={(
                                            (text) => setState({
                                                ...state,
                                                lastName: text
                                            })
                                        )}
                                    />
                                </View>
                                <View style={[styles.inputContainer, { marginTop: constants.vh(22) }]}>
                                    <Components.CalendarButton
                                        onPress={() => { openCalendar() }}
                                        date={JSON.stringify(state.dob) != JSON.stringify(new Date("1970")) ? moment(state.dob).format("MM/DD/YYYY") : "MM/DD/YYYY"}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Components.PrimaryPhoneInput
                                        onPressLock={() => { handleToggleSorryModal(true) }}
                                        shouldNotVisible={true}
                                        showLock={true}
                                        inputTextColor={constants.Colors.white}
                                        placeholderTextColor={constants.Colors.color_B9B9B9}
                                        onChangeText={(phone) => setState({ ...state, phone })}
                                        selectedCountryCode={state.selectedCountryCode}
                                        keyboardType="numeric"
                                        callingCode={state.callingCode}
                                        countryName={state.countryName}
                                        value={props.auth.userRegistered.phoneNumber ? JSON.stringify(props.auth.userRegistered.phoneNumber) : ""}
                                        returnKeyType="done"
                                        maxLength={11}
                                        editable={false}
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

                                <View style={styles.inputContainer}>
                                    <Components.PrimaryInput
                                        title="Email"
                                        editable={props.auth.userRegistered.gmail ? false : true}
                                        showLock={props.auth.userRegistered.gmail ? true : false}
                                        onPressLock={() => { handleToggleSorryModal(true) }}
                                        // value={props.profile.artistDetail[0].artistDeatils.email}
                                        value={state.email}
                                        inputTextColor={constants.Colors.white}
                                        placeholderTextColor={constants.Colors.white}
                                        onChangeText={(
                                            (text) => setState({
                                                ...state,
                                                email: text
                                            })
                                        )}
                                    />
                                </View>

                                <View style={[styles.inputContainer, { marginTop: constants.vh(22) }]}>
                                    <Components.DropdownCard
                                        title={state.gender ? state.gender : "Gender"}
                                        onPress={() => handleGenderDropdown(true)}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Components.PrimaryInput
                                        multiline={true}
                                        maxLength={100}
                                        blurOnSubmit={true}
                                        textAlignVertical={"top"}
                                        title="Bio"
                                        height={constants.vh(300)}
                                        placeholder="Bio"
                                        placeholderTextColor={constants.Colors.white}
                                        autoCapitalize="sentences"
                                        value={state.bio}
                                        onChangeText={
                                            (text) => {
                                                // if (text.length < 101) {
                                                setState({
                                                    ...state,
                                                    bio: text
                                                })
                                                // }
                                            }}
                                    />
                                    <View style={{
                                        //position: 'absolute', bottom: constants.vh(10), right: constants.vh(15) 
                                    }}>
                                        <Text style={{ ...styles.text40016, alignSelf: 'flex-end' }

                                        }>
                                            {
                                                state.bio != null &&
                                                state.bio.length
                                            } / 100
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ marginTop: constants.vh(48), marginBottom: 15 }}>
                                    <Components.PrimaryButton
                                        title="SAVE"
                                        onPress={() => handleSaveButton()}
                                    />
                                </View>
                            </KeyboardAwareScrollView>

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

                            <Modal
                                visible={state.handleCameraAndGalleryValue}
                                animationType="slide"
                                transparent={true}
                            >
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => handleCameraAndGallery(false)}
                                    style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        top: 0,
                                    }}
                                >
                                    <TouchableOpacity style={{
                                        marginTop: HEIGHT * 0.75
                                    }}>
                                        <View style={{
                                            borderBottomWidth: 1,
                                        }}>
                                            <Components.BottomSheet
                                                title="Camera"
                                                iconName="camera"
                                                //onPress={handleOpenCamera}
                                                onPress={handleCameraPermission}
                                            />
                                            <Components.BottomSheet
                                                title="Gallery"
                                                iconName="photo"
                                                //onPress={handleOpenLibrary}
                                                onPress={handleReadStoragePermission}
                                            />
                                        </View>
                                        <Components.BottomSheet
                                            title="Cancel"
                                            onPress={() => { handleCameraAndGallery(false) }}
                                        />
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
                                                    date={state.dob}
                                                    mode="date"
                                                    onDateChange={onDateChange}
                                                    fadeToColor={'none'}
                                                    textColor={constants.Colors.color_FF3062}
                                                />
                                            </View>


                                        </View>
                                    </TouchableOpacity>

                                </TouchableOpacity>
                            </Modal>

                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={state.showGoBack}
                            >
                                <View
                                    style={styles.modalMain}
                                >
                                    <View style={styles.modalSecondry}>
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

                            <Components.ProgressView
                                isProgress={props.profile.isLoading}
                                title={constants.AppConstant.Bando}
                            />
                        </>
                }
            </SafeAreaView>
        </>
    )
}

function mapStateToProps(state) {
    let { post, auth, profile } = state;
    return {
        post, auth, profile
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);