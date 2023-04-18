import {
    StyleSheet,
    Platform,
    Dimensions,
    StatusBar
} from 'react-native';

import constants from '../../constants';
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const { height, width } = Dimensions.get('window');

export const isIPhoneX = () => Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
    ? width === X_WIDTH && height === X_HEIGHT || width === XSMAX_WIDTH && height === XSMAX_HEIGHT
    : false;

export const STATUSBAR_HEIGHT = Platform.select({
    ios: isIPhoneX() ? 34 : 0,  //44 & 20
    android: 0,   //StatusBar.currentHeight
    default: 0
})

const iPhoneX = Dimensions.get('window').height >= 812


export const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    secondryContainer: {
        flex: 1
    },
    imageBackground: {
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0
    },
    headerContainer: {
        paddingHorizontal: 15,
    },
    dataContainer: {
        paddingHorizontal: 15,
        width: "100%",
        flex: 1
    },
    welcomeContainer: {
        marginTop: constants.vh(250)
    },
    text25bold: {
        fontSize: 25,
        fontWeight: "bold",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        textAlign: "center"
    },
    text16500: {
        fontSize: 16,
        fontWeight: "500",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.color_B9B9B9,
        textAlign: "center"
    },
    text14Normal: {
        fontSize: 14,
        //fontWeight: "500",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        textAlign: "center"
    },
    text14Bold: {
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        textAlign: "center"
    },
    emailContainer: {
        marginTop: constants.vh(48)
    },
    passwordContainer: {
        marginTop: constants.vh(21),
    },
    buttonContainer: {
        marginTop: Platform.OS === "ios" ? constants.vh(70) : constants.vh(45)
    },
    didNotHaveAccountContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    signUpAndForgotContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: constants.vh(11)
    },
    rememberContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: constants.vh(15)
    }
})