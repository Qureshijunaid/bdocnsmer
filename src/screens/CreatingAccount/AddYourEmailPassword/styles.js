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
        paddingHorizontal: 15,
    },
    addYourPasswordContainer: {
        marginTop: constants.vh(44)
    },
    inputContainer: {
        marginTop: constants.vh(48)
    },
    input: {
        marginTop: constants.vh(22)
    },
    regexMatchContainer: {
        marginTop: constants.vh(7)
    },
    termsAndDataUseContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    buttonContainer: {
        marginTop: constants.vh(80),
        marginBottom: constants.vh(10)
    },
    text30bold: {
        fontSize: 30,
        fontWeight: "bold",
        color: constants.Colors.color_FF3062,
        fontFamily: constants.Fonts.K2D_Regular
    },
    text16500: {
        fontSize: 16,
        fontWeight: "500",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    text13normal: {
        fontSize: 13,
        fontWeight: "600",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.color_959595
    },
    text13bold: {
        fontSize: 13,
        fontWeight: "bold",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular,
        textDecorationLine: "underline",
        color: constants.Colors.white
    },
    modalSorryMain: {
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalSorrySecondry: {
        backgroundColor: constants.Colors.color_333333,
        width: constants.vw(268),
        borderRadius: 20,
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center"
    },
    text18bold: {
        fontSize: 18,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        fontWeight: "bold",
    },
    text14600: {
        fontSize: 14,
        fontFamily: constants.Fonts.K2D_Regular,
        color: "#C4C4C4",
        fontWeight: "600",
        textAlign: "center"
    },
    divider: {
        width: "100%",
        height: 2,
        backgroundColor: "rgba(60,60,67,0.29)"
    },
    modalOkButtonContainer: {
        paddingVertical: constants.vh(9),
        width: constants.vw(268),
        justifyContent: "center",
        alignItems: "center"
    },
})