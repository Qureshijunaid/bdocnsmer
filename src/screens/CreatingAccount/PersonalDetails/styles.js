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
    applyToBandoContainer: {
        marginTop: constants.vh(37)
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
    inputContainer: {
        marginTop: constants.vh(27)
    },
    nextButtonContainer: {
        marginTop: constants.vh(40),
        marginBottom: constants.vh(20)
    },
    text16normal: {
        fontSize: 16,
        color: constants.Colors.color_B9B9B9,
        fontFamily: constants.Fonts.K2D_Regular
    },
    text12bold: {
        fontSize: 12,
        fontWeight: "bold",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular,
        textAlign: "right",
        marginTop: 8,

    },

    //Modal
    modalContainer: {
        position: "absolute",
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: "rgba(0,0,0,0.2)"
    },
    modalDataContainer: {
        width: "100%",
        height: "100%",
        marginTop: constants.vh(530),
        backgroundColor: constants.Colors.color_333333,
        borderRadius: 10,
        paddingTop: constants.vh(5),
        flex: 1,
    },
    modalHeaderContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 10
    },
    modalHeaderContainerSpaceBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 10
    },
    modalMerchandisingContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "46%"
    },
    modalCrossContainer: {
        backgroundColor: constants.Colors.rgba_255_255_255_3,
        width: constants.vw(25),
        height: constants.vw(25),
        borderRadius: constants.vw(25) / 2,
        justifyContent: "center",
        alignItems: "center"
    },
    modalFlatlistContainer: {
        marginBottom: Platform.OS === "ios" ? constants.vh(50) : constants.vh(75)
    },
    modalItemContainer: {
        paddingVertical: Platform.OS === "ios" ? constants.vh(17) : constants.vh(10),
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: constants.Colors.color_3A3A3A
    }
})