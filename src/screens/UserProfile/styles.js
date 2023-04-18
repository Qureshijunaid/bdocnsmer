import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';

import constants from '../../constants';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.Colors.color_232323,
    },
    dataContainer: {
        flex: 1,
        marginTop: constants.vh(5)
    },
    profileImageContainer: {
        alignItems: "center"
    },
    text30800: {
        fontSize: 25,
        fontWeight: "800",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
    },
    text28bold: {
        fontSize: 28,
        fontWeight: "bold",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    text23bold: {
        fontSize: 23,
        fontWeight: "bold",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    text16normal: {
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    headerContainer: {
        width: "90%",
        alignSelf: "center",
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor:'red'
    },
    slide: {
        // backgroundColor: "red",
        // borderRadius: 10
    }

})