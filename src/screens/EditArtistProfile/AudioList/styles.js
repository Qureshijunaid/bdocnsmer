import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import constants from '../../../constants';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.Colors.color_232323
    },
    dataContainer: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: constants.vh(13)
    },
    titleContainer: {
        marginTop: constants.vh(33)
    },
    listContainer: {
        marginTop: constants.vh(25),
        flex: 1,
    },
    text35bold: {
        fontSize: 35,
        fontWeight: "bold",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    headerWithICon: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    headerImageConainer: {
        height: constants.vh(33),
        width: constants.vh(33),
        borderRadius: constants.vh(33) / 2
    },
    card: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
    },
    cover: {
        width: constants.vw(150),
        height: constants.vh(150),
        // marginTop: constants.vw(33),
        borderRadius: constants.vw(22.5405),
        alignSelf: 'center'
    },
    audioTitle: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "800",
        fontStyle: "normal",
        fontSize: constants.vw(23),
        color: constants.Colors.white,

        // marginTop:constants.vh(27)
    },
    albumText: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "600",
        fontStyle: "normal",
        fontSize: constants.vw(14),
        color: constants.Colors.color_B9B9B9,

        //   marginTop: constants.vh(12)   
    },
    timerContainer: {
        width: Platform.OS == 'ios' ? "100%" : "90%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    text700Normal: {
        fontFamily: constants.Fonts.SF_ProText,
        fontWeight: "600",
        fontStyle: "normal",
        fontSize: 12,
        color: constants.Colors.white
    },
    controls: {
        marginTop: 20,
        width: "60%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    toggleButtonContainer: {
        width: constants.vw(68),
        height: constants.vw(68),
        borderRadius: constants.vw(68 / 2),
        backgroundColor: constants.Colors.color_FF3062,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        width: constants.vw(42),
        height: constants.vw(42),
        backgroundColor: constants.Colors.white,
        borderRadius: constants.vw(42) / 2,
        alignItems: "center",
        justifyContent: "center"
    },
    text16400: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "400",
        fontStyle: "normal",
        fontSize: constants.vw(16),
        color: constants.Colors.white
    },
    merchandiseContainerModal: {
        marginTop: constants.vh(29),
        flexDirection: "row",
        alignItems: "center",
        width: "43%",
        justifyContent: "space-between",
    },
    text18500: {
        fontSize: 18,
        fontWeight: "500",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    merchandiseSliderContainer: {
        marginTop: constants.vh(23),
    },
    carPaymentModal: {
        position: 'absolute',
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    headerCrossContainerSubscription: {
        padding: 5,
        borderRadius: 50,
        backgroundColor: "rgba(255,255,255,0.4)",
        justifyContent: "center",
        alignItems: "center",
        //position: "relative",
        marginRight: constants.vw(10),
        marginTop: constants.vw(10),
        marginBottom: constants.vh(10)
    },
    text40700: {
        fontSize: constants.vw(40),
        fontWeight: "700",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    hitSlop: {
        top: 5,
        left: 5,
        right: 5,
        bottom: 5
    },
    postActionButton: {
        position: "absolute",
        top: constants.vh(10),
        alignSelf: "flex-end",
        marginTop: 10
    },

    //COMMENT MODAL
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
    text25bold: {
        fontSize: 25,
        fontWeight: "bold",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        marginStart: constants.vw(20)
    },
    //MODAL DELETE REPORT 
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
    text16C4C4C4: {
        fontSize: 16,
        fontWeight: "600",
        color: "#C4C4C4"
    },
    text16white: {
        fontSize: 16,
        color: "#fff",
        fontFamily: constants.Fonts.K2D_Regular
    },
    text23white: {
        fontSize: 23,
        fontWeight: "bold",
        color: "#fff"
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
})