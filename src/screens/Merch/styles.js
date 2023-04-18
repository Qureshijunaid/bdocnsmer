import {
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';

import constants from '../../constants';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.Colors.color_232323
    },
    countMerchContainer: {
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "center",
        width: "60%",

        // marginStart:constants.vw(5),
        //  backgroundColor:'red'
    },
    countContainer: {
        width: constants.vw(35),
        // paddingHorizontal:5,
        // paddingVertical:5,
        // height: constants.vh(18),
        justifyContent: "center",
        alignItems: "center",
        marginStart: constants.vw(15),
        marginTop: constants.vh(5)
        // backgroundColor:'blue'
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
    dataContainer: {
        flex: 1,
        paddingHorizontal: 20
    },
    newPostContainer: {
        zIndex: 99,
        position: "absolute",
        bottom: constants.vh(20),
        backgroundColor: constants.Colors.color_17B933,
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal: constants.vw(15),
        paddingVertical: constants.vh(8),
        borderRadius: constants.vw(30),
        shadowColor: constants.Colors.color_17B933,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,

        elevation: 11,

    },
    newPostTextContainer: {
        width: constants.vw(80),
        marginStart: constants.vw(10)
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
    merchandiseImageContainer: {
        marginTop: constants.vh(10)
    },
    titleContainer: {
        marginTop: constants.vh(33)
    },
    editContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    mechandiseCardContainer: {
        width: "49%",
        paddingHorizontal: constants.vw(5),
        paddingVertical: constants.vh(10)
    },
    text35bold: {
        fontSize: 35,
        fontWeight: "bold",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    text14600: {
        fontSize: 14,
        fontWeight: "600",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    text14600: {
        fontSize: 14,
        fontWeight: "600",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    text18500: {
        fontSize: 35,
        fontWeight: "700",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    text16bold: {
        fontSize: 16,
        fontWeight: "bold",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    text12bold: {
        fontSize: 12,
        fontWeight: "bold",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    text23800: {
        fontSize: 23,
        fontWeight: "800",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    text16600: {
        fontSize: 16,
        fontWeight: "400",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular,

    },
    text16normal: {
        fontSize: 16,
        fontWeight: "normal",
        color: constants.Colors.color_B9B9B9,
        fontFamily: constants.Fonts.K2D_Regular
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

    downloadCSVContainer: {
        marginTop: constants.vh(30),
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center"
    },

    //Modal
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
    text16C4C4C4: {
        fontSize: 16,
        fontWeight: "600",
        color: "#C4C4C4"
    },
    text23white: {
        fontSize: 23,
        fontWeight: "bold",
        color: "#fff"
    },
    text16white: {
        fontSize: 16,
        color: "#fff",
        fontFamily: constants.Fonts.K2D_Regular
    },
    modalButton: {
        width: "49%",
        paddingVertical: constants.vh(13),
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
        marginTop: constants.vh(80),
        backgroundColor: constants.Colors.color_333333,
        borderRadius: 10,
        paddingHorizontal: constants.vw(20),
        paddingVertical: constants.vh(25),
        flex: 1
    },
    modalDataCalendarContainer: {
        width: "100%",
        height: "100%",
        marginTop: constants.vh(250),
        backgroundColor: constants.Colors.color_333333,
        borderRadius: 10,
        paddingHorizontal: constants.vw(20),
        paddingVertical: constants.vh(15),
        flex: 1
    },
    modalHeaderContainer: {

        justifyContent: "flex-end",
        width: "100%",
        backgroundColor: 'red'
    },
    modalMerchandisingContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        //width: "46%"
    },
    modalCrossContainer: {
        backgroundColor: constants.Colors.rgba_194_194_29,
        width: constants.vw(25),
        height: constants.vw(25),
        borderRadius: constants.vw(25) / 2,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "flex-end"
    },
    modalEditDisableContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: constants.vh(24),
    },
    modalAnalyticsButtonContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: constants.vh(24)
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
        //bottom:constants.vh(60)
    },
    headerCrossContainerSubscriptionThanks: {
        padding: 5,
        borderRadius: 50,
        backgroundColor: "rgba(255,255,255,0.4)",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        marginRight: constants.vw(12),
        marginTop: constants.vw(12),
        bottom: constants.vh(60)
    },
    text40700: {
        fontSize: constants.vw(40),
        fontWeight: "700",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    text16400: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "400",
        fontStyle: "normal",
        fontSize: constants.vw(16),
        color: constants.Colors.white
    },

})