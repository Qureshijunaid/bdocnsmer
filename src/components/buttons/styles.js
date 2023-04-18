import {
    StyleSheet,
    Platform
} from 'react-native';

import constants from '../../constants';

export const styles = StyleSheet.create({
    primaryButtonContainer: {
        width: "100%",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    calendarButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: constants.vw(20),
        paddingVertical: constants.vh(10),
        backgroundColor: constants.Colors.color_333333,
        borderRadius: 8
    },
    dobAndArrowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "89%"
    },
    countContainer: {
        paddingHorizontal: constants.vw(5),
        paddingVertical: constants.vh(2),
        backgroundColor: constants.Colors.white,
        borderRadius: 10
    },
    text11bold: {
        fontSize: 11,
        fontWeight: "bold",
    },
    text16600: {
        fontSize: 16,
        fontWeight: "600",
        color: constants.Colors.white
    },
    text70011: {
        fontWeight: "700",
        fontSize: constants.vw(11),
        fontFamily: constants.Fonts.SF_ProText,
        color: constants.Colors.white,
        fontStyle: "normal"
    },
    text13normal: {
        fontSize: 13,
        //fontWeight: "600",
        color: constants.Colors.color_B9B9B9
    },
    text16normal: {
        fontSize: 16,
        //fontWeight: "600",
        color: constants.Colors.white
    },
    orderCalendarContainer: {
        paddingVertical: constants.vh(10),
        paddingHorizontal: constants.vw(15),
        backgroundColor: constants.Colors.color_333333,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    text18bold: {
        fontSize: 18,
        fontWeight: "bold",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
})