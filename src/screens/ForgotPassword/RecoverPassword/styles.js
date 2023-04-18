import { StyleSheet, Platform, Dimensions } from 'react-native';
import constants from '../../../constants';
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
    emailContainer: {
        marginTop: constants.vh(48)
    },
    text13normal: {
        fontFamily:constants.Fonts.SF_ProText,
        fontWeight:"400",
        fontStyle:"normal",
        fontSize: constants.vw(13),
        color:constants.Colors.color_B9B9B9

    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    input: {
        paddingVertical: constants.vh(16),
        paddingHorizontal: constants.vw(20),
        width: "100%",
        borderRadius: 8,
        backgroundColor: constants.Colors.color_333333,
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        borderWidth:2,
        borderColor:constants.Colors.color_FFF500,
        color:constants.Colors.color_B9B9B9
    },

})