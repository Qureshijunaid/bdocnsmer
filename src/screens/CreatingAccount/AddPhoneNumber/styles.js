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
    aboutYouContainer: {
        marginTop: constants.vh(37),
    },
    infoTextContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: constants.vh(19)
    },
    buttonContainer: {
        marginTop: HEIGHT * 0.35
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
    text12bold: {
        fontSize: 12,
        fontWeight: "bold",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular,
        textAlign: "right",
        marginTop: 8
    },
    text14normal: {
        fontSize: 14,
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular,
        textAlign: "left",
    }
})