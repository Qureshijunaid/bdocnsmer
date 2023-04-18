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
        marginTop: constants.vh(140),
    },
    image: {
        width: constants.vw(300),
        height: constants.vh(202),
        alignSelf: "center",
    },
    tickContainer: {
        width: constants.vw(66),
        height: constants.vw(66),
        borderRadius: constants.vw(33),
        backgroundColor: constants.Colors.color_FF3062,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: constants.vh(110),
        alignSelf: "center"
    },
    thankForApplyingTextContainer: {
        marginTop: constants.vh(20)
    },
    text30normal: {
        fontSize: 30,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        textAlign: "center"
    },
    text16normal: {
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        textAlign: "center",
        marginTop: constants.vh(20)
    },
})