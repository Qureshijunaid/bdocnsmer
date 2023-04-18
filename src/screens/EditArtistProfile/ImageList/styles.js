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
        paddingHorizontal: 10,
        marginTop: constants.vh(13)
    },
    titleContainer: {
        marginTop: constants.vh(33)
    },
    listContainer: {
        marginTop: constants.vh(25),
        flex: 1,
        // alignSelf:'center'
    },
    text35bold: {
        fontSize: 35,
        fontWeight: "bold",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
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
    text16white: {
        fontSize: 16,
        color: "#fff",
        fontFamily: constants.Fonts.K2D_Regular
    },
    modalContainer: {
        position: "absolute",
        // backgroundColor: constants.Colors.color_232323,
        //backgroundColor: "transparent",
        bottom: 0,
        top: -20,
        left: 0,
        right: 0,
        flex: 1,
    },
    modalDataContainer: {
        width: "98%",
        height: "100%",
        marginTop: constants.vh(90),
        backgroundColor: constants.Colors.color_232323,
        //backgroundColor:"#000000",
        borderRadius: 10,
        //padding: constants.vw(20),
        paddingVertical: constants.vh(25),
        flex: 1,
        alignSelf: 'center'
    },
    modalHeaderContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: constants.vw(10)
    },
    modalMerchandisingContainer: {
        flexDirection: "row",
        //justifyContent: "space-between",
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
    modalProfileImageContainer: {
        height: constants.vw(33),
        width: constants.vw(33),
        borderRadius: constants.vw(33) / 2,
    },
    merchandiseImageContainer: {
        marginTop: constants.vh(30),
        alignSelf: 'center'
    },
    text16400: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "400",
        fontStyle: "normal",
        fontSize: constants.vw(16),
        color: constants.Colors.white,

    },
    merchandiseSliderContainer: {
        width: "100%",
        //height: constants.vh(650),
        marginTop: constants.vh(23),
        marginBottom: constants.vh(30),
        paddingHorizontal: constants.vh(10)
    },
    modalTitleHeartContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        alignSelf: "center",
        marginTop: constants.vh(19),
        paddingHorizontal: constants.vh(10)
    },
    merchandiseContainer: {
        marginTop: constants.vh(29),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "40%",
        paddingHorizontal: constants.vh(10)

    },
    Container23Text: {
        width: "50%",
    },
    text23800: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "800",
        fontStyle: "normal",
        fontSize: constants.vw(23),
        color: constants.Colors.white
    },
    carPaymentModal: {
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.4)'

    },
    headerCrossContainerSubscription: {
        padding: 5,
        borderRadius: 50,
        backgroundColor: "rgba(255,255,255,0.4)",
        justifyContent: "center",
        alignItems: "center",
        //position:"relative",
        marginRight: constants.vw(12),
        marginTop: constants.vw(12),
        marginBottom: constants.vh(12)
    },
    text40700: {
        fontSize: constants.vw(40),
        fontWeight: "700",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    hitSlop: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
    },
    postImageActionButton: {
        position: "absolute",
        top: constants.vh(70),
        right: constants.vw(30),
        alignSelf: "flex-end",
        marginTop: 10
    },

    //COMMENT MODAL
    modalCommentMain: {
        flex: 1,
        position: "absolute",
        top: -20,
        left: -20,
        right: -20,
        bottom: -20,
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