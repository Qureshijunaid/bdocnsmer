import { StyleSheet } from 'react-native';

import constants from '../../constants';

export const styles = StyleSheet.create({
    container: {
        // position: "absolute",
        // bottom: constants.vh(24),
        paddingVertical: constants.vw(10),
        paddingHorizontal: constants.vw(10),
        backgroundColor: "white",
        width: "100%",
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    profileImage: {
        width: constants.vw(33),
        height: constants.vw(33),
        borderRadius: constants.vw(33 / 2)
    },
    text11normal: {
        fontSize: 11,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.color_232323
    },
    text12bold: {
        fontSize: 12,
        fontWeight: "bold",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.color_232323,
        width: constants.vw(100),
    },
    hitSlop: {
        top: 5,
        left: 5,
        right: 5,
        bottom: 5
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
        width: Platform.OS == 'ios' ? "100%" : "90%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    text700Normal: {
        fontFamily: constants.Fonts.SF_ProText,
        fontWeight: "600",
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
})