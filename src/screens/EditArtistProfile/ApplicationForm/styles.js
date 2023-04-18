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
        //marginTop: constants.vh(33)
    },
    headerContainer: {
        //flexDirection: "row",
        //justifyContent: "flex-start",
        //alignItems: "center",
        marginStart: 8
    },
    text30bold: {
        fontSize: 30,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        fontWeight: "bold",
        marginStart: 8
    },
    text16500: {
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        fontWeight: "500",
    },
    editYourProfileContainer: {
        marginTop: constants.vh(20)
    },
    profilePicContainer: {
        marginTop: constants.vh(22),
        alignSelf: "center"
    },
    changePicContainer: {
        marginTop: constants.vh(10),
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        alignSelf: "center"
    },
    text14500: {
        fontSize: 14,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        fontWeight: "500",
    },
    hitSlop: {
        top: 5,
        left: 5,
        bottom: 5,
        right: 5
    },
    inputContainer: {
        marginTop: constants.vh(10)
    },
    text18bold: {
        fontSize: 18,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        fontWeight: "bold",
    },
    text14600: {
        fontSize: 14,
        fontFamily: constants.Fonts.K2D_Regular,
        color: "#C4C4C4",
        fontWeight: "600",
        textAlign: "center"
    },
    modalSorryMain: {
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
    modalSorrySecondry: {
        backgroundColor: constants.Colors.color_333333,
        width: constants.vw(268),
        borderRadius: 20,
        justifyContent: "center",
        alignSelf: "center",
        alignItems: "center"
    },
    divider: {
        width: "100%",
        height: 2,
        backgroundColor: "rgba(60,60,67,0.29)"
    },
    modalContainer: {
        position: "absolute",
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        flex: 1,
        paddingHorizontal: 15,
        backgroundColor: "rgba(0,0,0,0.2)"
    },
    modalDataContainer: {
        width: "100%",
        height: "100%",
        marginTop: constants.vh(530),
        backgroundColor: constants.Colors.color_333333,
        borderRadius: 10,
        paddingTop: constants.vh(5),
        flex: 1,
    },
    modalHeaderContainerSpaceBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 10
    },
    modalHeaderContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 10
    },
    modalOkButtonContainer: {
        paddingVertical: constants.vh(9),
        width: constants.vw(268),
        justifyContent: "center",
        alignItems: "center"
    },
    modalFlatlistContainer: {
        marginBottom: Platform.OS === "ios" ? constants.vh(50) : constants.vh(75)
    },
    modalItemContainer: {
        paddingVertical: Platform.OS === "ios" ? constants.vh(17) : constants.vh(10),
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: constants.Colors.color_3A3A3A
    },
    text16normal: {
        fontSize: 16,
        color: constants.Colors.color_B9B9B9,
        fontFamily: constants.Fonts.K2D_Regular
    },
    genreDropDownContainer: {
        marginTop: constants.vh(28)
    },
    text40016: {
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "400",
        fontStyle: "normal",
        fontSize: constants.vw(14),
        color: constants.Colors.white
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

})