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
        paddingTop: constants.vh(90),
    },
    aboutYouContainer: {
        marginTop: constants.vh(37),
    },
    text30normal: {
        fontSize: 30,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        textAlign: "center"
    },
    text30bold: {
        fontSize: 30,
        fontWeight: "bold",
        color: constants.Colors.color_FF3062,
        fontFamily: constants.Fonts.K2D_Regular
    },
    text16normal: {
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        textAlign: "center",
        marginTop: constants.vh(20)
    },
})