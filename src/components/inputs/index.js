import React from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { SvgUri } from 'react-native-svg';
import CountryPicker from '../CountryPicker/lib'

import constants from '../../constants';
import { styles } from './styles';

export const PrimaryInput = ({
    onPress,
    onChangeText,
    maxLength,
    multiline,
    value,
    onSubmitEditing,
    placeholder,
    placeholderTextColor,
    keyboardType,
    returnKeyType,
    isSecure,
    showSecure,
    onIconpress,
    showOptional,
    height,
    textAlignVertical,
    title,
    showEuro,
    inputTextColor,
    blurOnSubmit,
    showTitle,
    showLock,
    onPressLock,
    editable,
    autoCapitalize,
    autoFocus,
    inputRef,
    paddingRight
}) => {

    return (

        <>
            {title &&
                <Text style={styles.text13normal}>{title}</Text>
            }
            {
                showTitle &&
                <Text style={styles.text13normal}>{placeholder}</Text>
            }
            <TouchableOpacity style={styles.inputContainer}
                activeOpacity={1}
            // onPress={onPress}
            >
                <TextInput
                    ref={inputRef}
                    onChangeText={onChangeText}
                    maxLength={maxLength}
                    multiline={multiline}
                    blurOnSubmit={blurOnSubmit}
                    style={[styles.input, {
                        height: height,
                        color: inputTextColor ? inputTextColor : constants.Colors.color_B9B9B9,
                        textAlignVertical: textAlignVertical ? textAlignVertical : "center",
                        paddingRight: Platform.OS === "ios" ? (showOptional ? "25%" : (showSecure || showLock ? "15%" : "5%")) : showOptional ? "29%" : (showSecure || showLock ? "15%" : "5%"),
                    }]}
                    value={value}
                    onSubmitEditing={onSubmitEditing}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    keyboardType={keyboardType}
                    returnKeyType={returnKeyType}
                    secureTextEntry={isSecure}
                    autoCapitalize={autoCapitalize ? autoCapitalize : "none"}
                    editable={editable}
                    caretHidden={false}
                // paddingRight={paddingRight}
                />
                {
                    showSecure &&
                    <View style={styles.secureIconContainer}>
                        <Ionicons
                            name={isSecure ? "eye-off-outline" : "eye-outline"}
                            color={"#fff"}
                            size={25}
                            onPress={onIconpress}
                        />
                    </View>
                }

                {
                    showLock &&
                    <View style={styles.secureIconContainer}>
                        <SimpleLineIcons
                            name={"lock"}
                            color={"#fff"}
                            size={constants.vw(20)}
                            onPress={onPressLock}
                        />
                    </View>
                }

                {
                    showOptional &&
                    <View style={styles.secureIconContainer}>
                        <Text style={styles.text16normal}>({constants.ConstStrings.optional})</Text>
                    </View>
                }
                {
                    showEuro &&
                    <View
                        style={{
                            position: "absolute",
                            right: "96%"
                        }}
                    >
                        <Image
                            source={constants.Images.Pound}
                        />
                    </View>
                }
            </TouchableOpacity>
        </>
    )
}

export const PrimaryMaskedInput = ({
    onPress,
    onChangeText,
    maxLength,
    multiline,
    value,
    onSubmitEditing,
    placeholder,
    placeholderTextColor,
    keyboardType,
    returnKeyType,
    isSecure,
    showSecure,
    onIconpress,
    showOptional,
    height,
    textAlignVertical,
    title,
    showEuro,
    inputTextColor,
    blurOnSubmit,
    showTitle,
    showLock,
    onPressLock,
    editable,
    type,
    options
}) => {
    return (
        <>
            {title &&
                <Text style={styles.text13normal}>{title}</Text>
            }
            {
                showTitle &&
                <Text style={styles.text13normal}>{placeholder}</Text>
            }
            <TouchableOpacity style={styles.inputContainer}
                activeOpacity={1}
            // onPress={onPress}
            >
                <TextInputMask
                    type={type}
                    options={options}
                    onChangeText={onChangeText}
                    maxLength={maxLength}
                    multiline={multiline}
                    blurOnSubmit={blurOnSubmit}
                    style={[styles.input, {
                        height: height,
                        color: inputTextColor ? inputTextColor : constants.Colors.color_B9B9B9,
                        textAlignVertical: textAlignVertical ? textAlignVertical : "center"
                    }]}
                    value={value}
                    onSubmitEditing={onSubmitEditing}
                    placeholder={placeholder}
                    placeholderTextColor={placeholderTextColor}
                    keyboardType={keyboardType}
                    returnKeyType={returnKeyType}
                    secureTextEntry={isSecure}
                    editable={editable}
                //autoFocus={false}
                />
                {
                    showSecure &&
                    <View style={styles.secureIconContainer}>
                        <Ionicons
                            name={isSecure ? "eye-off-outline" : "eye-outline"}
                            color={"#fff"}
                            size={25}
                            onPress={onIconpress}
                        />
                    </View>
                }

                {
                    showLock &&
                    <View style={styles.secureIconContainer}>
                        <SimpleLineIcons
                            name={"lock"}
                            color={"#fff"}
                            size={constants.vw(20)}
                            onPress={onPressLock}
                        />
                    </View>
                }

                {
                    showOptional &&
                    <View style={styles.secureIconContainer}>
                        <Text style={styles.text16normal}>({constants.ConstStrings.optional})</Text>
                    </View>
                }
                {
                    showEuro &&
                    <View
                        style={{
                            position: "absolute",
                            right: "96%"
                        }}
                    >
                        <Image
                            source={constants.Images.Pound}
                        />
                    </View>
                }
            </TouchableOpacity>
        </>
    )
}

export const PrimaryMultilineInput = ({
    onChangeText,
    maxLength,
    multiline,
    value,
    onSubmitEditing,
    placeholder,
    placeholderTextColor,
    keyboardType,
    returnKeyType,
    height
}) => {
    return (
        <View>
            <TextInput
                onChangeText={onChangeText}
                maxLength={maxLength}
                multiline={multiline}
                style={styles.inputMultiline}
                value={value}
                onSubmitEditing={onSubmitEditing}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                keyboardType={keyboardType}
                returnKeyType={returnKeyType}
                caretHidden={false}
            />

        </View>
    )
}

export const PrimaryPhoneInput = ({
    onChangeText,
    placeholder,
    placeholderTextColor,
    callingCode,
    countryName,
    onSelect,
    keyboardType,
    returnKeyType,
    value,
    maxLength,
    editable,
    shouldNotVisible,
    showLock,
    onPressLock,
    inputTextColor
}) => {
    return (
        <View>
            <Text style={styles.text13normal}>{constants.ConstStrings.phoneNumber}</Text>
            <View style={styles.phoneInputContainer}>
                <CountryPicker
                    shouldNotVisible={shouldNotVisible}
                    countryCode={callingCode ? countryName : "GB"}
                    withCallingCode={true}
                    withCloseButton={true}
                    containerButtonStyle={{
                        fontFamily: constants.Fonts.Poppins_Regular,
                        flexDirection: "row"
                    }}
                    onSelect={onSelect}
                />
                <View style={styles.verticalSeperator} />
                <View style={styles.codeAndPhoneContainer}>
                    <Text style={styles.text16normal}>{callingCode ? `+${callingCode}` : ""}</Text>
                    <TextInput
                        style={[styles.phoneNumber, {
                            color: inputTextColor ? inputTextColor : constants.Colors.color_B9B9B9,
                        }]}
                        placeholder={placeholder}
                        placeholderTextColor={placeholderTextColor}
                        onChangeText={onChangeText}
                        keyboardType={keyboardType}
                        returnKeyType={returnKeyType}
                        value={value}
                        maxLength={maxLength}
                        editable={editable}
                        keyboardAppearance={'dark'}
                        caretHidden={false}
                    />
                </View>
                {
                    showLock &&
                    <View style={styles.secureIconContainer}>
                        <SimpleLineIcons
                            name={"lock"}
                            color={"#fff"}
                            size={constants.vw(20)}
                            onPress={onPressLock}
                        />
                    </View>
                }
            </View>
        </View>
    )
}

export const SendReplyInput = ({
    onChangeText,
    onPressPlus,
    onPressSpeaker,
    value,
    showSpeaker,
    onSubmitEditing
}) => {
    return (
        <View style={styles.sendReplyInputContainer}>

            <TouchableOpacity
                onPress={onPressPlus}
                activeOpacity={1}
                style={{
                    padding: constants.vw(8),
                    borderRadius: 100,
                    backgroundColor: constants.Colors.color_636363
                }}
            >
                <AntDesign
                    name="plus"
                    size={constants.vw(20)}
                    color={constants.Colors.white}
                />
            </TouchableOpacity>

            <TextInput
                onChangeText={onChangeText}
                placeholder={"Type something..."}
                placeholderTextColor={constants.Colors.color_B9B9B9}
                value={value}
                style={styles.sendReplyInput}
                maxLength={400}
                onSubmitEditing={onSubmitEditing}
                caretHidden={false}
            />
            {
                showSpeaker &&
                <FontAwesome
                    // onPress={onPressSpeaker}
                    name="microphone"
                    color={constants.Colors.white}
                    size={constants.vw(25)}
                />
            }
        </View>
    )
}

export const SendReplyInputConsumer = ({
    onChangeText,
    onPressSend,
    value,
    onSubmitEditing,
    autoFocus
}) => {
    return (
        <View style={styles.sendReplyInputContainer}>
            <TextInput
                onChangeText={onChangeText}
                placeholder={"Type something..."}
                placeholderTextColor={constants.Colors.color_B9B9B9}
                value={value}
                style={[styles.sendReplyInput, { borderRadius: 50 }]}
                maxLength={400}
                //onSubmitEditing={onSubmitEditing}
                autoFocus={autoFocus}
                multiline
                caretHidden={false}
            />
            <TouchableOpacity
                onPress={onPressSend}
                activeOpacity={1}
                style={{
                    padding: constants.vw(8),
                    borderRadius: 100,
                    backgroundColor: constants.Colors.color_636363
                }}
            >
                <Ionicons
                    name="send"
                    size={constants.vw(20)}
                    color={constants.Colors.white}
                />
            </TouchableOpacity>
        </View>
    )
}

export const SendChatMessage = ({
    onChangeText,
    onPressSend,
    value,
    onSubmitEditing
}) => {
    return (
        <View style={[styles.sendReplyInputContainer, { paddingVertical: constants.vh(12), marginBottom: 10 }]}>
            <TextInput
                onChangeText={onChangeText}
                placeholder={"Type something . . . "}
                placeholderTextColor={constants.Colors.color_B9B9B9}
                value={value}
                style={[styles.sendReplyInput, { borderRadius: 50 }]}
                maxLength={400}
                onSubmitEditing={onSubmitEditing}
                multiline={true}
                maxHeight={70}
                caretHidden={false}
            />
            <TouchableOpacity
                onPress={onPressSend}
                activeOpacity={1}
                style={{
                    padding: constants.vw(8),
                }}
            >
                <Image
                    source={constants.Images.ChatSend}
                    resizeMode={"cover"}
                />
            </TouchableOpacity>
        </View>
    )
}