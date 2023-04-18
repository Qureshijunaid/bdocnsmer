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

    passwordContainer: {
        marginTop: constants.vh(51)
    },
    resetPasswordContainer:{
        marginTop:constants.vh(19)
    },
    regexMatchContainer: {
        marginTop: constants.vh(24)
    },

})