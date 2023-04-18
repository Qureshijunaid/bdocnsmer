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
    socialMediaContainer: {
        marginTop: constants.vh(30),
    },
    inputContainer: {
        //marginTop: constants.vh(20)
    },
    input: {
        marginTop: constants.vh(15)
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
    nextButtonContainer: {
        marginTop: Platform.OS === "ios" ? constants.vh(54) : constants.vh(44),
        marginBottom: constants.vh(20)
    }
})