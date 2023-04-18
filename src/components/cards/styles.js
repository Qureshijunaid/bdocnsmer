import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import constants from '../../constants';
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const { height, width } = Dimensions.get('window');

export const isIPhoneX = () => Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
    ? width === X_WIDTH && height === X_HEIGHT || width === XSMAX_WIDTH && height === XSMAX_HEIGHT
    : false;
//const iPhoneX = Dimensions.get('window').height >= 812

export const STATUSBAR_HEIGHT = Platform.select({
    ios: isIPhoneX() ? 20 : 44,  //44 & 20
    android: 0,   //StatusBar.currentHeight
    default: 0
})



export const styles = StyleSheet.create({
    BandoUseForCardContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: constants.vw(14),
        paddingVertical: constants.vh(14),
        backgroundColor: constants.Colors.color_333333,
        marginTop: constants.vh(14),
        borderRadius: constants.vw(10)
    },
    PasswordRegexMatchContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: constants.vh(23)
    },
    priceBandCardContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: constants.vh(3),
    },
    poundAmountContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    postCardContainer: {
        width: "90%",
        alignSelf: 'center',
        height: constants.vh(180),
        justifyContent: "center",
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 10,
        backgroundColor: constants.Colors.rgba_255_255_255_1,
        borderColor: constants.Colors.rgba_255_255_255_2,
    },
    dropdownCardContainer: {
        width: "100%",
        paddingHorizontal: constants.vw(20),

        backgroundColor: constants.Colors.color_333333,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    text16bold: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    merchandiseCardContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: constants.vw(14),
        paddingVertical: constants.vh(14),
        backgroundColor: constants.Colors.color_2F2F2F,
        marginTop: constants.vh(14),
        borderRadius: constants.vw(10)
    },
    merchandiseImage: {
        width: constants.vw(50),
        height: constants.vw(50),
        borderRadius: 5
    },
    merchandiseTextContainer: {
        marginHorizontal: constants.vw(14),
        position: "relative",
        bottom: constants.vh(9)
    },
    countCardContainer: {
        width: constants.vw(25),
        height: constants.vw(19),
        borderRadius: constants.vw(10),
        backgroundColor: constants.Colors.color_FF3062,
        justifyContent: "center",
        alignItems: "center"
    },
    text16normal: {
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.color_B9B9B9,
    },
    text14normal: {
        fontSize: 14,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
    },
    text14500: {
        fontSize: 14,
        fontWeight: "600",
        fontFamily: constants.Fonts.K2D_Regular,
    },
    text14bold: {
        fontSize: 14,
        fontWeight: "bold",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    text12bold: {
        fontSize: 12,
        fontWeight: "bold",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    text11bold: {
        fontSize: 11,
        fontWeight: "bold",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    genreContainer: {
        height: constants.vh(80),
        width: constants.vw(150),
        borderRadius: constants.vw(15),
        borderWidth: 1,
        justifyContent: 'center',
        alignSelf: 'center'

    },
    genreNameContainer: {
        position: 'absolute',
        top: 10,
        left: 10
    },
    text18700: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "700",
        fontStyle: "normal",
        fontSize: constants.vw(18),
        color: constants.Colors.white
    },
    text18bold: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "bold",
        fontSize: constants.vw(18),
        color: constants.Colors.white
    },
    checkBoxContainer: {
        alignSelf: 'flex-end',
        marginTop: constants.vh(20)
    },
    commentCardContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: constants.vw(20),
        borderWidth: 1,
        borderColor: "#404040",
        borderRadius: 10
    },
    artistDetailProfileContainer: {
        width: "100%",
        borderRadius: constants.vw(5)
        // borderBottomLeftRadius: 20,
        // borderBottomRightRadius: 20
    },
    backGroundImageArtistDetails: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: Platform.OS === "ios" ? constants.vh(360) : constants.vh(320),
        flex: 1
        // borderRadius: 50
        // borderBottomLeftRadius: 20,
        // borderBottomRightRadius: 20
    },
    artistDetailProfileDataContainer: {
        marginTop: getStatusBarHeight(),
        paddingHorizontal: 20
    },
    backArrowContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingVertical: 5,
        marginTop: constants.vh(2)
    },
    profileDataArtistDetailsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: constants.vh(175)
    },
    profileDataImage: {
        width: constants.vw(33),
        height: constants.vw(33),
        borderRadius: constants.vw(33 / 2),
        resizeMode: "cover"
    },
    text30800: {
        fontSize: 25,
        fontWeight: "800",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    text35bold: {
        fontSize: 35,
        fontWeight: "bold",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    hitSlop: {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
    },
    merchandiseArtistDetailCardContainer: {
        flexDirection: "column",
        alignItems: "flex-start"
    },
    text10bold: {
        fontSize: 11,
        fontWeight: "bold",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    videoCardArtistDetailsContainer: {

    },
    merchandiseImageArtistDetails: {
        width: constants.vw(121),
        height: constants.vw(121),
        borderRadius: 10
    },
    audioCardArtistDetailContainer: {
        paddingVertical: constants.vh(11),
        paddingHorizontal: constants.vw(20),
        backgroundColor: constants.Colors.color_2F2F2F,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        //width: "100%",
        marginHorizontal: 20
    },
    imageListCardContainer: {
        flexDirection: "column",
        alignItems: "flex-start",
    },
    imageListContainer: {
        width: constants.vw(154),
        height: constants.vh(174),
        backgroundColor: constants.Colors.color_0F0F0F,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8
    },
    imageListCard: {
        width: constants.vw(154),
        height: constants.vh(174),
        resizeMode: "contain",
        borderRadius: 8
    },
    videoListCardContainer: {
        width: "100%",
    },
    videoListCardThumbNail: {
        width: "100%",
        height: constants.vh(182),
        resizeMode: "stretch"
    },
    durationContainer: {
        paddingHorizontal: 5,
        backgroundColor: constants.Colors.black,
        position: "absolute",
        top: constants.vh(140),
        left: constants.vw(13),
        borderRadius: 5
    },
    text13500: {
        fontSize: 13,
        fontWeight: "500",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    audioListCardContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingVertical: 5,
    },
    subscriptionCardContainer: {
        paddingVertical: constants.vh(22),
        paddingHorizontal: constants.vw(29),

    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "#DA155C"
    },
    revenueContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 5
    },
    merchandiseListCardContainer: {
        height: Platform.OS === "ios" ? constants.vh(275) : constants.vh(270),
        width: constants.vw(158),
        borderWidth: 1,
        borderRadius: constants.vw(10),
        borderColor: constants.Colors.color_404040,
        backgroundColor: constants.Colors.color_2F2F2F,
        flexDirection: "column",
        justifyContent: "space-between",
        paddingVertical: constants.vh(13)
    },
    buyNowMerchContainer: {
        marginTop: constants.vh(5),
        // marginStart: constants.vw(14),
        flexDirection: "row",
        width: "80%",
        alignSelf: 'center',
        justifyContent: "space-between",
        alignItems: "center",

    },
    text40011: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "400",
        fontSize: constants.vw(11),
        fontStyle: "normal",
        color: constants.Colors.color_B9B9B9
    },
    buyNowContainer: {
        width: constants.vw(63),
        padding: constants.vh(4),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: constants.Colors.color_17B933,
        borderRadius: constants.vw(5),

    },
    text40011: {
        fontWeight: "400",
        fontSize: constants.vw(11),
        fontStyle: "normal",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular,

    },
    notificationCardContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: constants.Colors.color_404040,
        padding: constants.vw(20),
        borderRadius: 10
    },
    buttonsContainer: {
        width: "30%",
        // flexDirection: "column",
        // justifyContent: "flex-start",
        // alignItems: "center",
        // alignContent: "flex-end",
        position: "absolute",
        right: constants.vh(10),
        bottom: constants.vh(0),
        alignSelf: "flex-end"
    },
    likeButtonContainer: {
        alignSelf: "flex-end",
        marginTop: Platform.OS === "ios" ? constants.vh(0) : constants.vh(-10),
        flexDirection: "column",
        alignItems: "center"
    },
    commentContainer: {
        alignSelf: "flex-end",
        //marginTop: constants.vh(17),
        flexDirection: "column",
        alignItems: "center",
        marginTop: Platform.OS === "ios" ? constants.vh(17) : constants.vh(0),
    },
    text14600: {
        fontSize: 14,
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "600",
        color: constants.Colors.white
    },
    text23800: {
        fontSize: 23,
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "800",
        color: constants.Colors.white
    },
    PaymentSubscriptionCardContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: constants.vw(14),
        paddingVertical: constants.vh(14),
        backgroundColor: "rgba(255,255,255,0.25)",
        marginTop: constants.vh(14),
        borderRadius: constants.vw(10)
    },
    lockContainer: {
        width: constants.vw(20),
        height: constants.vw(20),
        borderRadius: constants.vw(10),
        backgroundColor: "rgba(255,255,255,0.19)",
        alignItems: "center",
        justifyContent: "center",
        marginStart: constants.vw(7)
    },
    text18boldBlack: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "bold",
        fontSize: constants.vw(18),
    },
    paymentCardDetailsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    paymentCardContainer: {
        paddingHorizontal: constants.vw(25),
        paddingVertical: constants.vw(15),
        position: "absolute",
        width: "100%",
        //backgroundColor: constants.Colors.white
    },
    alreadyChatArtistListContainer: {
        width: "100%",
        // alignSelf: "center",
        // alignItems: "center"


    },
    artistImage: {
        height: constants.vh(50),
        width: constants.vh(50),
        borderRadius: constants.vh(25)
    },
    nameChatContainer: {
        marginStart: constants.vw(15),
        width: "70%",
    },
    chatContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        //  backgroundColor:'red'
    },
    imageMessageContainer: {
        // flexDirection: "row",
        alignItems: "center",
        width: "20%",



    },
    text600normal: {
        fontFamily: constants.Fonts.K2D_Bold,
        fontWeight: "600",
        fontSize: constants.vw(14),
        fontStyle: "normal",
        color: constants.Colors.white
    },
    text10700: {
        fontFamily: constants.Fonts.K2D_Bold,
        fontWeight: "700",
        fontStyle: "normal",
        fontSize: constants.vw(10),
        color: constants.Colors.color_B9B9B9
    },
    hitSlop: {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10
    }
})