import { StyleSheet, Platform, Dimensions } from 'react-native';

import constants from '../../../constants';

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.Colors.color_232323,
    },
    dataContainer: {
        //marginTop: Platform.OS === "ios" ? constants.vh(360) : constants.vh(320),
    },
    paddingHorizontal20: {

    },
    portionContainer: {
        marginTop: constants.vh(26),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 20
    },
    text20bold: {
        fontSize: 20,
        fontWeight: "bold",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    descriptionContainer: {
        //width: "100%",
        marginHorizontal: 20
    },
    text16normal: {
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    text14500: {
        fontSize: 14,
        fontWeight: "500",
        color: constants.Colors.color_B9B9B9,
        fontFamily: constants.Fonts.K2D_Regular
    },
    text18500: {
        fontSize: 18,
        fontWeight: "500",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    text35700: {
        fontSize: 35,
        fontWeight: "700",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    merchandiseContainer: {
        marginTop: constants.vh(28),
        //marginHorizontal: 20
    },
    titleAndCountContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "50%"
    },
    countContainer: {
        width: "21%",
        marginStart: constants.vw(15)
    },
    hitSlop: {
        top: 5,
        left: 5,
        right: 5,
        bottom: 5
    },
    noDataContainer: {
        width: "90%",
        marginTop: constants.vh(28),
        alignSelf: 'center'

    },
    noDataText: {
        fontSize: constants.vw(16),
        color: constants.Colors.white,
        fontWeight: "normal"
    },
    text35bold: {
        fontSize: 35,
        fontWeight: "bold",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    text15500: {
        fontSize: 15,
        fontWeight: "500",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    helperTextContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: constants.vh(10)
    },

    subscriptionModalContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: constants.vw(50),
        // marginTop: constants.vh(51),
        // backgroundColor: "red",
        backgroundColor: "rgba(0, 0, 0, 0.53)",

        // backgroundColor: "rgba(0,0,0,0.3)"
    },
    carPaymentModal: {
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.4)'

    },
    backGroundImageSubscription: {
        // height: constants.vh(705),
        height: "100%",
        width: "100%",
        borderRadius: 15
    },
    dataContainerSubscription: {
        paddingHorizontal: constants.vw(21),
        paddingVertical: constants.vh(16),
        position: "absolute",
        height: Dimensions.get('window').height,
        backgroundColor: "rgba(0,0,0,0.4)",
        // backgroundColor:'red',
        width: "100%"
    },
    headerContainerSubscription: {
        marginTop: constants.vh(12),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    headerCrossContainerSubscription: {
        padding: 5,
        borderRadius: 50,
        backgroundColor: "rgba(255,255,255,0.4)",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        right: constants.vw(12),
        bottom: constants.vh(50)
    },
    headerCrossContainerSubscriptionBox: {
        padding: 5,
        borderRadius: 50,
        backgroundColor: "rgba(255,255,255,0.4)",
        justifyContent: "center",
        alignItems: "center",
        //position:"relative",
        marginRight: constants.vw(10),
        marginTop: constants.vw(10),
        //bottom:constants.vh(60)
    },
    headerCrossContainerSubscriptionSubrcibe: {
        borderRadius: constants.vw(50),
        backgroundColor: constants.Colors.color_B9B9B9,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
    },

    //audio modal

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
    timerContainer: {
        width: Platform.OS == 'ios' ? "100%" : "90%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    text700Normal: {
        fontFamily: constants.Fonts.SF_ProText,
        fontWeight: "700",
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
        color: constants.Colors.white,

    },
    merchandiseContainerModal: {
        marginTop: constants.vh(29),
        flexDirection: "row",
        alignItems: "center",
        width: "43%",
        justifyContent: "space-between",
    },
    text18500AudioModal: {
        fontSize: 18,
        fontWeight: "500",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    merchandiseSliderContainer: {
        // width: "100%",

        marginTop: constants.vh(23),
        // marginBottom: constants.vh(30)
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


    // images

    modalContainer: {
        position: "absolute",
        // backgroundColor: constants.Colors.color_232323,
        backgroundColor: "#000000",
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        flex: 1
    },
    modalDataContainer: {
        width: "100%",
        height: "100%",
        marginTop: constants.vh(90),
        backgroundColor: constants.Colors.color_232323,
        //backgroundColor: "#000000",
        borderRadius: 10,
        //paddingHorizontal: constants.vw(20),
        paddingVertical: constants.vh(25),
        flex: 1
    },
    modalHeaderContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "98%"
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
    text18500Images: {
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
        width: '98%',
        alignSelf: 'center',
        alignItems: 'center',
    },
    text16400Image: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "400",
        fontStyle: "normal",
        fontSize: constants.vw(16),
        color: constants.Colors.white,

    },
    merchandiseSliderContainerImages: {
        width: "100%",
        height: constants.vh(450),
        marginTop: constants.vh(23),
        marginBottom: constants.vh(30)
    },
    modalTitleHeartContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "95%",
        alignSelf: "center",
        marginTop: constants.vh(19)
    },
    merchandiseContainerImages: {
        marginTop: constants.vh(29),
        flexDirection: "row",
        //justifyContent: "space-between",
        width: "95%",
        alignSelf: 'center',
        alignItems: "center",
        //paddingLeft:constants.vw(10)
    },
    Container23Text: {
        width: "50%",
    },
    sizeContainer: {
        marginEnd: constants.vw(16),
        backgroundColor: constants.Colors.color_2F2F2F,
        borderWidth: 1,
        borderRadius: 5,
        //width: constants.vw(50),
        //height: constants.vw(42),
        padding: constants.vh(5),
        justifyContent: "center",
        alignItems: "center",
        //padding: constants.vw(1)
    },
    text23800: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "800",
        fontStyle: "normal",
        fontSize: constants.vw(23),
        color: constants.Colors.white,

    },
    text16600: {
        fontSize: 16,
        fontWeight: "400",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular,

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
    headerCrossContainerSubscriptionThanks: {
        padding: 5,
        borderRadius: 50,
        backgroundColor: "rgba(255,255,255,0.4)",
        justifyContent: "center",
        alignItems: "center",
        // position: "relative",
        // marginTop: constants.vw(12),
        // bottom: constants.vh(60)
    },
    text24bold: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "bold",
        fontSize: constants.vw(24),
        color: constants.Colors.white
    },
    readMoreText: {
        color: constants.Colors.white,
        marginTop: 5,
        textDecorationLine: "underline"
    },
    profileLinkText: {
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.color_FF005C,
        textDecorationLine: "underline"
    },
    emptyMediaContainer: {
        alignSelf: "center",
        width: "100%",
        alignItems: "center",
        marginVertical: constants.vh(10)
    },
    postActionButton: {
        position: "absolute",
        top: constants.vh(10),
        alignSelf: "flex-end",
        marginTop: 10
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
    profileModalContainer: {
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: constants.Colors.color_232323,
        justifyContent: "center",
        alignItems: "center"
    },
    fullProfileImageContainer: {
    },
    fullProfileImage: {
        width: WIDTH * 0.9,
        height: WIDTH * 0.9,
        borderRadius: WIDTH * 0.8
    }
})