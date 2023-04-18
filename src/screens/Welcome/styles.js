import { StyleSheet, Platform, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';

import constants from '../../constants';

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export const styles = StyleSheet.create({
    iosStatusBar: {
        height: DeviceInfo.hasNotch() ? 44 : 20,
        backgroundColor: "black",
    },
    container: {
        flex: 1
    },
    secondryContainer: {
        position: "absolute",
        top: 0,
        width: '100%',
        height: '100%',
        alignItems: "center"
    },
    welcomeTextContainer: {
        position: "absolute",
        top: Platform.OS === "ios" ? constants.vh(490) : constants.vh(440)
    },
    buttonContainer: {
        marginTop: constants.vh(73),
        width: WIDTH - 40,
    },
    text25bold: {
        fontSize: 25,
        fontWeight: "bold",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        textAlign: "center"
    },
    text16500: {
        fontSize: 16,
        fontWeight: "500",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.color_B9B9B9,
        textAlign: "center"
    },
    signinUPContainer: {
        marginTop: constants.vh(70)
    },
    imageStyle: {
        height: constants.vh(25),
        width: constants.vw(23),
    },
    socialMediaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        position: "absolute",
        bottom: Platform.OS === "ios" ? constants.vh(60) : constants.vh(70)
    },
    buttonContainer: {
        backgroundColor: "white",
        padding: constants.vw(10),
        borderRadius: constants.vw(38),
        alignItems: 'center',
        justifyContent: 'center',
        margin: constants.vw(15)
    }
})