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
    profileImageContainer: {
        marginTop: constants.vh(71),
        alignItems: 'center'
    },
    instructionTextContainer: {
        marginTop: HEIGHT * 0.065,
    },
    buttonContainer: {
        marginTop: constants.vh(30),
        width: "100%"
    },
    imageOuterRadius: {
        width: constants.vw(97),
        height: constants.vw(97),
        borderRadius: constants.vw(97 / 2),
        borderWidth: 1,
        borderColor: constants.Colors.color_FF3062,
        justifyContent: "center",
        alignItems: "center"
    },
    imageInnerRadius: {
        width: constants.vw(83),
        height: constants.vw(83),
        borderRadius: constants.vw(83 / 2),
        backgroundColor: constants.Colors.color_373737,
        justifyContent: "center",
        alignItems: "center"
    },
    addPhotoContainer: {
        marginTop: HEIGHT * 0.095,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    profileImage: {
        width: 87,
        height: 87,
        borderRadius: 87 / 2,
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
    text14normal: {
        fontSize: 14,
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular,
        textAlign: "center"
    },
    text16normal: {
        fontSize: 16,
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular,
        textAlign: "center"
    }
})