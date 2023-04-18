import { StyleSheet, Platform, Dimensions } from 'react-native';
import constants from '../../constants';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: constants.Colors.color_232323,
        flex: 1,
    },
    dataContainer: {
        flex: 1,
        paddingHorizontal: 10
    },
    postDivider: {
        marginBottom: constants.vh(10),
        marginTop: constants.vh(10),
    },
    statsButtonContainer: {
        marginTop: constants.vh(16),
        width: "100%",
        backgroundColor: constants.Colors.color_2F2F2F,
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 100,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    modalCommentMain: {
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalCommentSecondry: {
        // position: "absolute",
        // height: 600,
        height: constants.vh(609),
        backgroundColor: constants.Colors.color_333333,
        width: "100%",
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingVertical: constants.vh(10),
        paddingHorizontal: constants.vw(20),
    },
    crossIconContainer: {
        width: constants.vw(30),
        height: constants.vw(30),
        borderRadius: constants.vw(30 / 2),
        backgroundColor: "rgba(194, 194, 194, 0.29)",
        justifyContent: "center",
        alignItems: "center"
    },

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
        marginTop: constants.vh(140),
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
        //width: "46%"
    },
    modalCrossContainer: {
        backgroundColor: constants.Colors.rgba_255_255_255_3,
        width: constants.vw(25),
        height: constants.vw(25),
        borderRadius: constants.vw(25) / 2,
        justifyContent: "center",
        alignItems: "center"
    },
    text18500: {
        fontSize: 18,
        fontWeight: "500",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    mainContainer: {
        paddingVertical: constants.vh(7),
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    text16normal: {
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        marginEnd: constants.vw(20)
    },
    text25bold: {
        fontSize: 25,
        fontWeight: "bold",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        marginStart: constants.vw(20)
    },
    text35700: {
        fontSize: 35,
        fontWeight: "700",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        marginStart: constants.vw(20)
    },
    hitSlop: {
        top: 5,
        left: 5,
        right: 5,
        bottom: 5
    },
    modalMain: {
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalMainReportCancel: {
        flex: 1,
        position: "absolute",
        // top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalSecondry: {
        paddingVertical: constants.vh(17),
        backgroundColor: constants.Colors.color_232323,
        //paddingHorizontal: constants.vw(23),
        width: "80%",
        borderTopRightRadius: 14,
        borderTopLeftRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(84, 84, 88, 0.65)"
    },
    text23white: {
        fontSize: 23,
        fontWeight: "bold",
        color: "#fff"
    },
    text16C4C4C4: {
        fontSize: 16,
        fontWeight: "600",
        color: "#C4C4C4"
    },
    modalButtonContainer: {
        width: "80%",
        borderBottomRightRadius: 14,
        borderBottomLeftRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: constants.Colors.color_232323,
        flexDirection: "row",
        alignItems: "center"
    },
    modalButton: {
        width: "49%",
        paddingVertical: constants.vh(13),
        justifyContent: "center",
        alignItems: "center"
    },
    text16white: {
        fontSize: 16,
        color: "#fff",
        fontFamily: constants.Fonts.K2D_Regular
    },
})