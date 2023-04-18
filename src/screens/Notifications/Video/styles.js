import { StyleSheet, Platform, Dimensions } from 'react-native';

import constants from '../../../constants';

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.Colors.color_232323,
    },
    text16400: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "400",
        fontStyle: "normal",
        fontSize: constants.vw(16),
        color: constants.Colors.white,

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
    carPaymentModal: {
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.4)'

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
    text40700: {
        fontSize: constants.vw(40),
        fontWeight: "700",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    modalContainer: {
        position: "absolute",
        // backgroundColor: constants.Colors.color_232323,
        backgroundColor: "#000000",
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        flex: 1
    },
    modalDataContainer: {
        width: "100%",
        height: "100%",
        marginTop: constants.vh(20),
        backgroundColor: constants.Colors.color_232323,
        backgroundColor: "#000000",
        borderRadius: 10,
        paddingHorizontal: constants.vw(20),
        paddingVertical: constants.vh(25),
        flex: 1
    },
    modalHeaderContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
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
        marginTop: constants.vh(30)
    },
    modalTitleHeartContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
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
        color: constants.Colors.white
    },
    card: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
    },
    audioTitle: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "800",
        fontStyle: "normal",
        fontSize: constants.vw(23),
        color: constants.Colors.white,

        // marginTop:constants.vh(27)
    },
    text16normal: {
        fontSize: 16,
        fontWeight: "normal",
        color: constants.Colors.color_B9B9B9,
        fontFamily: constants.Fonts.K2D_Regular
    },
})