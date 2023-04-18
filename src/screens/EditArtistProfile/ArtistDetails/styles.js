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
        //marginTop: Platform.OS === "ios" ? constants.vh(360) : constants.vh(320),
    },
    paddingHorizontal20: {

    },
    portionContainer: {
        marginTop: constants.vh(26),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 20
    },
    text20bold: {
        fontSize: 20,
        fontWeight: "bold",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    descriptionContainer: {
        //width: "100%",
        marginHorizontal: 20
    },
    text16normal: {
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    text14500: {
        fontSize: 14,
        fontWeight: "500",
        color: constants.Colors.color_B9B9B9,
        fontFamily: constants.Fonts.K2D_Regular
    },
    text18500: {
        fontSize: 18,
        fontWeight: "500",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    merchandiseContainer: {
        marginTop: constants.vh(28),
        //marginHorizontal: 20
    },
    titleAndCountContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "50%"
    },
    countContainer: {
        width: "21%",
        marginStart: constants.vw(15)
    },
    hitSlop: {
        top: 5,
        left: 5,
        right: 5,
        bottom: 5
    },
    noDataContainer: {
        width: "90%",
        marginTop: constants.vh(28),
        alignSelf: 'center'

    },
    noDataText: {
        fontSize: constants.vw(16),
        color: constants.Colors.white,
        fontWeight: "normal"
    }
})