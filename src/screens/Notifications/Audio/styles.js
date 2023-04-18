import { StyleSheet, Platform, Dimensions } from 'react-native';

import constants from '../../../constants';

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.Colors.color_232323,
    },
    dataContainer: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: constants.vh(13)
    },
    titleContainer: {
        marginTop: constants.vh(33)
    },
    text35bold: {
        fontSize: 35,
        fontWeight: "bold",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    headerWithICon: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    headerImageConainer: {
        height: constants.vh(33),
        width: constants.vh(33),
        borderRadius: constants.vh(33) / 2
    },

    card: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
    },
    cover: {
        width: constants.vw(150),
        height: constants.vh(150),
        // marginTop: constants.vw(33),
        borderRadius: constants.vw(22.5405),
        alignSelf: 'center'
    },
    audioTitle: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "800",
        fontStyle: "normal",
        fontSize: constants.vw(23),
        color: constants.Colors.white,
        // marginTop:constants.vh(27)
    },
    albumText: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "600",
        fontStyle: "normal",
        fontSize: constants.vw(14),
        color: constants.Colors.color_B9B9B9,
        //   marginTop: constants.vh(12)   
    },
    timerContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    text700Normal: {
        fontFamily: constants.Fonts.SF_ProText,
        fontWeight: "700",
        fontStyle: "normal",
        fontSize: 12,
        color: constants.Colors.white
    },
    controls: {
        marginTop: 20,
        width: "60%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    toggleButtonContainer: {
        width: constants.vw(68),
        height: constants.vw(68),
        borderRadius: constants.vw(68 / 2),
        backgroundColor: constants.Colors.color_FF3062,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        width: constants.vw(42),
        height: constants.vw(42),
        backgroundColor: constants.Colors.white,
        borderRadius: constants.vw(42) / 2,
        alignItems: "center",
        justifyContent: "center"
    },
    text16400: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "400",
        fontStyle: "normal",
        fontSize: constants.vw(16),
        color: constants.Colors.white
    },
    merchandiseContainerModal: {
        marginTop: constants.vh(29),
        flexDirection: "row",
        alignItems: "center",
        width: "43%",
        justifyContent: "space-between",
    },
    text18500: {
        fontSize: 18,
        fontWeight: "500",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    merchandiseSliderContainer: {
        marginTop: constants.vh(23),
    },
    merchandiseContainerImages: {
        marginTop: constants.vh(29),
        flexDirection: "row",
        //justifyContent: "space-between",
        width: "95%",
        alignSelf: 'center',
        alignItems: "center",
        //paddingLeft:constants.vw(10)
    },
    carPaymentModal: {
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.4)'

    },
    headerCrossContainerSubscriptionBox: {
        padding: 5,
        borderRadius: 50,
        backgroundColor: "rgba(255,255,255,0.4)",
        justifyContent: "center",
        alignItems: "center",
        //position:"relative",
        marginRight: constants.vw(10),
        marginTop: constants.vw(10),
        //bottom:constants.vh(60)
    },
    headerCrossContainerSubscription: {
        padding: 5,
        borderRadius: 50,
        backgroundColor: "rgba(255,255,255,0.4)",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        right: constants.vw(10),
        bottom: constants.vh(60)
    },
    text40700: {
        fontSize: constants.vw(40),
        fontWeight: "700",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    modalContainer: {
        position: "absolute",
        backgroundColor: constants.Colors.color_232323,
        // backgroundColor: "#000000",
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        flex: 1
    },
    modalDataContainer: {
        width: "100%",
        height: "100%",
        marginTop: constants.vh(90),
        backgroundColor: constants.Colors.color_373737,
        // backgroundColor:"#000000",
        borderRadius: 10,
        // paddingHorizontal: constants.vw(10),
        paddingVertical: constants.vh(25),
        flex: 1
    },
    modalHeaderContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "98%"
    },
    modalMerchandisingContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        //width: "46%"
    },
    modalCrossContainer: {
        backgroundColor: constants.Colors.rgba_255_255_255_3,
        width: constants.vw(25),
        height: constants.vw(25),
        borderRadius: constants.vw(25) / 2,
        justifyContent: "center",
        alignItems: "center"
    },
    modalProfileImageContainer: {
        height: constants.vw(33),
        width: constants.vw(33),
        borderRadius: constants.vw(33) / 2,
    },
    merchandiseImageContainer: {
        marginTop: constants.vh(30),
        width: '98%',
        alignSelf: 'center',
        alignItems: 'center',
    },
    modalTitleHeartContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "95%",
        alignSelf: "center",
        marginTop: constants.vh(19)
    },
    Container23Text: {
        width: "50%",
    },
    text23800: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "800",
        fontStyle: "normal",
        fontSize: constants.vw(23),
        color: constants.Colors.white,

    },
    text16400Image: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "400",
        fontStyle: "normal",
        fontSize: constants.vw(16),
        color: constants.Colors.white,

    },
    text18500Images: {
        fontSize: 18,
        fontWeight: "500",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    text16normal: {
        fontSize: 16,
        fontWeight: "normal",
        color: constants.Colors.color_B9B9B9,
        fontFamily: constants.Fonts.K2D_Regular
    },
    hitSlop: {
        top: 5,
        left: 5,
        right: 5,
        bottom: 5
    }
})