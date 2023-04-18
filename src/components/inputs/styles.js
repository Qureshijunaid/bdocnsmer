import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';

import constants from '../../constants';
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    input: {
        paddingVertical: constants.vh(16),
        paddingHorizontal: constants.vw(20),
        width: "100%",
        borderRadius: 8,
        backgroundColor: constants.Colors.color_333333,
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
    },
    secureIconContainer: {
        position: "absolute",
        right: constants.vw(18),
    },
    phoneInputContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal: constants.vw(20),
        paddingVertical: constants.vh(10),
        backgroundColor: constants.Colors.color_333333,
        width: "100%",
        borderRadius: constants.vw(10),
        marginTop: 5
    },
    flagContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "20%",
    },

    verticalSeperator: {
        width: 1,
        height: "100%",
        backgroundColor: constants.Colors.color_464545,
        marginHorizontal: constants.vw(18)
    },
    codeAndPhoneContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    phoneNumber: {
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.color_B9B9B9,
        marginStart: constants.vw(10),
        width: "68%"
    },
    text16normal: {
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.color_B9B9B9
    },
    text13normal: {
        fontSize: 13,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.color_B9B9B9
    },
    inputMultiline: {
        paddingVertical: constants.vh(16),
        paddingHorizontal: constants.vw(20),
        width: "100%",
        borderRadius: 8,
        backgroundColor: constants.Colors.color_333333,
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        height: 200,
        textAlignVertical: "top"
    },
    sendReplyInputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: constants.vw(20),
        paddingVertical: constants.vw(15),
        borderRadius: 30,
        backgroundColor: "rgba(99,99,99,0.2)"
    },
    sendReplyInput: {
        paddingVertical: 0,
        width: "75%",
        marginHorizontal: constants.vw(5),
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.color_B9B9B9,
        maxHeight: constants.vh(100)
    }
})