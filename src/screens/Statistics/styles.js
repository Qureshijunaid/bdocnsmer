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
        paddingHorizontal: 20
    },
    text35bold: {
        fontSize: 35,
        fontWeight: "bold",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    text18500: {
        fontSize: 18,
        fontWeight: "500",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        textAlign: "center"
    },
    statsButtonContainer: {
        marginTop: constants.vh(23),
        width: "100%",
        backgroundColor: constants.Colors.color_2F2F2F,
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 100,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    marginTop26: {
        marginTop: constants.vh(26),
    },
    marginTop11: {
        marginTop: constants.vh(11)
    },
    //Modal
    modalContainer: {
        position: "absolute",
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        flex: 1
    },
    modalDataContainer: {
        width: "100%",
        height: "100%",
        marginTop: constants.vh(440),
        backgroundColor: constants.Colors.color_333333,
        borderRadius: 10,
        paddingHorizontal: constants.vw(20),
        paddingVertical: constants.vh(25),
        flex: 1
    },
    modalHeaderContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
    },
    modalMerchandisingContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "46%"
    },
    modalCrossContainer: {
        backgroundColor: constants.Colors.rgba_255_255_255_3,
        width: constants.vw(25),
        height: constants.vw(25),
        borderRadius: constants.vw(25) / 2,
        justifyContent: "center",
        alignItems: "center"
    },
    modalFlatlistContainer: {
        marginTop: constants.vh(23),
        marginBottom: Platform.OS === "ios" ? constants.vh(50) : constants.vh(75)
    },
    modalCountCardContainer: {
        marginStart: constants.vw(15),
        marginTop: constants.vh(5)
    },
})