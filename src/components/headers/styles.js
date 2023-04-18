import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';

import constants from '../../constants';
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export const styles = StyleSheet.create({
    headerWithLogoContainer: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
    },
    headerWithLogoIconContainer: {
        width: "10%",
    },
    headerWithLogoImageContainer: {
        width: "85%",
        justifyContent: "center",
        alignItems: "center"
    },
    headerWithLogoImage: {
        position: "relative",
        top: constants.vh(15)
    },
    headerWithProgressContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
    },
    headerWithNotificationTitleContainer: {
        width: "50%",
    },
    headerWithNotificationProfileContainer: {
        width: "50%",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"
    },
    headerWithNotificationContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    headerWithNotificationTitle: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "bold",
        fontSize: 35,
        color: constants.Colors.white
    },
    headerWithNotificationIconContainer: {
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
    },
    text12500: {
        fontSize: 12,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    hitSlop: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
    },
    chattingHeaderContainer: {
    },
    innerChattingHeaderContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    artistImage: {
        height: constants.vh(33),
        width: constants.vh(33),
        borderRadius: constants.vh(33 / 2)
    },
    artistName: {
        fontFamily: constants.Fonts.K2D_Bold,
        fontWeight: "600",
        fontStyle: "normal",
        fontSize: constants.vw(16),
        color: constants.Colors.white
    }
})