import { StyleSheet, Platform, Dimensions } from 'react-native';
import constants from '../../../constants';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.Colors.color_232323,
        alignItems: 'center',
    },
    dataContainer: {
        // flex: 1,
        // alignItems: 'center'
        paddingHorizontal: 15
    },
    aboutYouContainer: {
        marginTop: constants.vh(350),
    },
    text30bold: {
        fontSize: 30,
        fontWeight: "bold",
        color: constants.Colors.color_FF3062,
        fontFamily: constants.Fonts.K2D_Regular,
        alignSelf:'center'
    },
    text16500: {
        alignSelf:'center',
        fontSize: 16,
        fontWeight: "500",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular,
       
    },
    resendEmailAgainContainer:{
        alignSelf:'center',
        marginTop: constants.vh(152)
    },
    text14normal:{
        fontSize: 14,
        fontFamily: constants.Fonts.K2D_Regular,
        fontStyle:'normal',
        fontWeight:'normal',
        textDecorationLine: "underline",
        color: constants.Colors.white
        
        
    }


})