import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import constants from '../../../constants';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.Colors.color_232323,
        // paddingTop:constants.vh(10)

    },
    headerImage: {
        height: constants.vh(33),
        width: constants.vh(33),
        borderRadius: constants.vh(33 / 2)

    },
    headerContainer: {
        width: "100%",
        height: constants.vh(90),
        justifyContent: "center",
        paddingTop: Platform.OS === "ios" ? constants.vh(20) : constants.vh(2),
        alignSelf: 'center',
        paddingHorizontal: constants.vw(15),
        // paddingBottom:constants.vw(24),
        borderBottomWidth: 1,
        backgroundColor: '#242424',
        borderBottomColor: '#242424',
        shadowOffset: {
            width: constants.vw(0),
            height: constants.vh(1),
        },
        shadowOpacity: constants.vw(0.29),
        shadowRadius: constants.vw(2.22),
        elevation: constants.vh(3),
    },
    text70018: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "700",
        fontStyle: "normal",
        fontSize: constants.vw(18),
        color: constants.Colors.white
    },
    text60012: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "600",
        fontStyle: "normal",
        fontSize: constants.vw(12),
        color: constants.Colors.white,
        lineHeight: constants.vh(18)
    },
    primaryButtonContainer: {
        // width: "100%",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: constants.Colors.color_FF3062,
        borderColor: "transparent",
        borderRadius: constants.vw(10),
        paddingHorizontal: constants.vw(35),
        paddingVertical: constants.vh(14),
        marginTop: constants.vh(29)
    },
    text16600: {
        fontSize: 16,
        fontWeight: "600",
        color: constants.Colors.white
    },
})