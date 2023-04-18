import React, { useState, useEffect, createRef } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Platform,
    StatusBar,
    TouchableOpacity,
    Image,
    Modal,
    Dimensions,
    Alert,
    Linking,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from "react-native-actions-sheet";
import Toast from 'react-native-toast-message';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import * as NavigationService from '../../../navigation/NavigationService';
import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import { setRegistrationDetails } from '../../../actions/registration';
import uploadFile from '../../../utils/S3Upload';
import Cropper from '../../../components/Cropper';

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const ProfilePhoto = (props) => {
    const actionSheetRef = createRef();
    let actionSheet;
    const [state, setState] = useState({
        image: null,
        imageFull: null,
        tempImage: null,
        activeButton: false,
        showActionSheet: false,
        isLoading: false,
        handleCameraAndGalleryValue: false,
        isCropping: false
    })

    const handleCameraAndGallery = (value) => {
        state.handleCameraAndGalleryValue = value
        setState({
            ...state,
        })
    }

    const handleNext = async () => {
        const payload = {
            "profilePhoto": state.image,
            "profilePhotoName": state.imageFull.fileName,
            "profilePhotoType": state.imageFull.type,
        }

        await props.dispatch(setRegistrationDetails(payload))
        NavigationService.navigate(constants.ScreensName.Notifications.name, null)
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
                        tempImage: source.uri,
                        isCropping: true,
                        imageFull: source,
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
            width: 1000,
            height: 800,
            cropping: true,
            multiple: false,
            compressImageQuality: 1,
            showCropGuidelines: true,
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
                        imageFull: source,
                        image: source.path,
                        activeButton: true
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
                    console.log("source", source);
                    setState({
                        ...state,
                        tempImage: source.uri,
                        isCropping: true,
                        imageFull: source,
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
            width: 1000,
            height: 800,
            cropping: true,
            multiple: false,
            compressImageQuality: 1,
            showCropGuidelines: true,
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
                        imageFull: source,
                        image: source.path,
                        activeButton: true
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

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                {
                    state.isCropping ?

                        <Cropper
                            image={state.tempImage}
                            hideAspects
                            onCroppedComplete={(result) => {
                                setState({
                                    ...state,
                                    image: result.uri,
                                    activeButton: true,
                                    isCropping: false,
                                    handleCameraAndGalleryValue: false,
                                })
                            }}
                            onClose={() => {
                                setState({
                                    ...state,
                                    tempImage: null,
                                    handleCameraAndGalleryValue: false,
                                    isCropping: false
                                })
                            }}
                        />

                        :
                        <View style={styles.dataContainer}>
                            <Components.HeaderWithProgress
                                presentCount={6}
                                totalCount={7}
                                onPress={() => { props.navigation.goBack() }}
                            />
                            <KeyboardAwareScrollView
                                keyboardShouldPersistTaps="handled"
                                style={styles.dataContainer}
                                enableOnAndroid={true}
                                extraHeight={240}
                            >
                                <View style={styles.aboutYouContainer}>
                                    <Text style={styles.text30bold}>{constants.ConstStrings.addYourProfile}</Text>
                                    <Text style={styles.text30bold}>{constants.ConstStrings.profilePhoto}</Text>
                                </View>
                                <View style={styles.profileImageContainer}>
                                    <View style={styles.imageOuterRadius}>
                                        <View
                                            style={styles.imageInnerRadius}
                                        >
                                            {
                                                state.image ?
                                                    <Image
                                                        source={{ uri: state.image }}
                                                        style={styles.profileImage}
                                                        resizeMode="cover"
                                                    />
                                                    :
                                                    <FontAwesome
                                                        name="user"
                                                        size={constants.vw(70)}
                                                        color={constants.Colors.color_525252}
                                                    />
                                            }

                                        </View>
                                    </View>
                                    <Text style={[
                                        styles.text16500,
                                        {
                                            marginTop: constants.vh(7),
                                            // textTransform: 'capitalize'
                                        }]}>
                                        {props.registration.firstName}{" "}
                                        {props.registration.lastName}
                                    </Text>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        hitSlop={{
                                            top: 10,
                                            bottom: 10,
                                            left: 5,
                                            right: 5,
                                        }}
                                        onPress={() => {
                                            handleCameraAndGallery(true)
                                        }}
                                        style={styles.addPhotoContainer}>
                                        <Feather
                                            name={"camera"}
                                            size={25}
                                            color={constants.Colors.white}
                                        />
                                        <Text style={[styles.text14normal, { textDecorationLine: "underline", marginStart: 10 }]}>{state.imageFull == null ? "Add Photo" : "Change Photo"}</Text>
                                    </TouchableOpacity>
                                    <View style={styles.instructionTextContainer}>
                                        <Image
                                            source={constants.Images.InfoSquare}
                                            style={{
                                                alignSelf: "center"
                                            }}
                                        />
                                        <Text style={styles.text14normal}>{constants.ConstStrings.youCanAddProfilePhoto}</Text>
                                        <Text style={styles.text14normal}>{constants.ConstStrings.insideYourProfilePage}</Text>
                                    </View>
                                    <View style={styles.buttonContainer}>
                                        <Components.PrimaryButton
                                            title={constants.ConstStrings.next}
                                            onPress={state.image ? handleNext : null}
                                            backgroundColor=
                                            {state.image ?
                                                constants.Colors.color_FF3062 :
                                                constants.Colors.rgb_126_39_60
                                            }
                                        />
                                    </View>
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity
                                            activeOpacity={1}
                                            onPress={() => {
                                                NavigationService.navigate(constants.ScreensName.Notifications.name, null)
                                            }}
                                        >
                                            <Text style={styles.text16normal}>{constants.ConstStrings.skip}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </KeyboardAwareScrollView>
                        </View>
                }
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
                <Components.ProgressView
                    isProgress={state.isLoading}
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
)(ProfilePhoto)