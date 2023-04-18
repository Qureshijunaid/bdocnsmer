import { StyleSheet, Platform, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

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
        paddingHorizontal: 15
    },
    whatBandoUseContainer: {
        marginTop: constants.vh(17),
    },
    text30bold: {
        fontSize: 30,
        fontWeight: "bold",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular,
        marginStart: 20
    },
    text16500: {
        fontSize: 16,
        fontWeight: "500",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    text12bold: {
        fontSize: 12,
        fontWeight: "bold",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular,
        textAlign: "right",
        marginTop: 8
    },
    absoluteBtn: {
        position: 'absolute',
        zIndex: 3,
        bottom: Platform.OS === "ios" ? constants.vh(40) : constants.vh(10),
        width: '95%',
        alignSelf: 'center',
    },
    listFooterLayout: {
        height: Platform.OS === "ios" ? constants.vh(140) : constants.vh(120),
        marginBottom: Platform.OS === "ios" ? constants.vh(50) : constants.vh(100)
    },
    modalMain: {
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
    modalSecondry: {
        paddingVertical: constants.vh(17),
        backgroundColor: constants.Colors.color_232323,
        //paddingHorizontal: constants.vw(23),
        width: "80%",
        borderTopRightRadius: 14,
        borderTopLeftRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(84, 84, 88, 0.65)"
    },
    text23white: {
        fontSize: 23,
        fontWeight: "bold",
        color: "#fff"
    },
    text16C4C4C4: {
        fontSize: 16,
        fontWeight: "600",
        color: "#C4C4C4"
    },
    modalButtonContainer: {
        width: "80%",
        borderBottomRightRadius: 14,
        borderBottomLeftRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: constants.Colors.color_232323,
        flexDirection: "row",
        alignItems: "center"
    },
    text16white: {
        fontSize: 16,
        color: "#fff",
        fontFamily: constants.Fonts.K2D_Regular
    },
    modalButton: {
        width: "49%",
        paddingVertical: constants.vh(13),
        justifyContent: "center",
        alignItems: "center"
    },
})