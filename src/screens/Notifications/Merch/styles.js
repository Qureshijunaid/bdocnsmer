import { StyleSheet, Platform, Dimensions } from 'react-native';

import constants from '../../../constants';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.Colors.color_232323,
    },
    modalCrossContainer: {
        backgroundColor: constants.Colors.rgba_194_194_29,
        width: constants.vw(25),
        height: constants.vw(25),
        borderRadius: constants.vw(25) / 2,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "flex-end"
    },
    modalProfileImageContainer: {
        height: constants.vw(33),
        width: constants.vw(33),
        borderRadius: constants.vw(33) / 2,
    },
    modalMerchandisingContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        //width: "46%"
    },
    text18500: {
        fontSize: 18,
        fontWeight: "500",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular,
    },
    merchandiseImageContainer: {
        marginTop: constants.vh(30),
        width: '98%',
        alignSelf: 'center',
        alignItems: 'center',
    },
    text23800: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "800",
        fontStyle: "normal",
        fontSize: constants.vw(23),
        color: constants.Colors.white
    },
    text16600: {
        fontSize: 16,
        fontWeight: "400",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular,

    },
    text23800: {
        fontSize: 23,
        fontWeight: "800",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
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
    text16400: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "400",
        fontStyle: "normal",
        fontSize: constants.vw(16),
        color: constants.Colors.white
    },
    sizeContainer: {
        marginEnd: constants.vw(16),
        backgroundColor: constants.Colors.color_2F2F2F,
        borderWidth: 1,
        borderRadius: 5,
        //width: constants.vw(50),
        //height: constants.vw(42),
        padding: constants.vh(5),
        justifyContent: "center",
        alignItems: "center",
        //padding: constants.vw(1)
    },
    text16normal: {
        fontSize: 16,
        fontWeight: "normal",
        color: constants.Colors.color_B9B9B9,
        fontFamily: constants.Fonts.K2D_Regular
    },
})