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
    buttonContainer: {
        marginTop: HEIGHT * 0.42
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
    text13normal: {
        fontSize: 13,
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular,
    },
    borderStyleBase: {
        width: 40,
        height: 50,
        borderRadius: 10,
        borderWidth: 0,
        backgroundColor: constants.Colors.color_333333,
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },

    borderStyleHighLighted: {
        width: 40,
        height: 50,
        borderRadius: 10,
        borderWidth: 0,
        backgroundColor: constants.Colors.color_333333,
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },

    underlineStyleBase: {
        width: 40,
        height: 50,
        borderRadius: 10,
        borderWidth: 0,
        backgroundColor: constants.Colors.color_333333,
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },

    underlineStyleHighLighted: {
        borderColor: constants.Colors.color_333333,
    },
})