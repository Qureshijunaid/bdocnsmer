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
    statsButtonContainer: {
        marginTop: constants.vh(20),
        width: "100%",
        backgroundColor: constants.Colors.color_2F2F2F,
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 100,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    text30bold: {
        fontSize: 30,
        fontWeight: "bold",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    text12bold: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#EEECF1",
        fontFamily: constants.Fonts.K2D_Regular
    },
    text16500: {
        fontSize: 16,
        fontWeight: "500",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    // modalContainer: {
    //     position: "absolute",
    //     top: 0,
    //     bottom: 0,
    //     right: 0, 
    //     left: 0,
    //     //backgroundColor: "rgba(0, 0, 0, 0.66)",
    //     backgroundColor: "rgba(0,0,0,0.35)",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     flex: 1,
    // },
    // modalDataContainer: {
    //     paddingHorizontal: constants.vw(24),
    //     paddingTop: constants.vw(24),
    //     backgroundColor: "#333333",
    //     borderRadius: constants.vw(14),
    //     alignItems: "center",
    //     width: "70%"
    // },
    // modalOkContainer: {
    //     paddingVertical: constants.vh(9),
    //     width: constants.vw(268),
    //     justifyContent: "center",
    //     alignItems: "center"
    // },
    // text13normal: {
    //     fontSize: 13,
    //     //fontWeight: "normal",
    //     color: constants.Colors.white,
    //     fontFamily: constants.Fonts.K2D_Regular,
    //     marginTop: 8
    // },
    // text18bold: {
    //     fontSize: 18,
    //     fontWeight: "bold",
    //     color: constants.Colors.white,
    //     fontFamily: constants.Fonts.K2D_Regular,
    // },
    // text14600: {
    //     fontSize: 14,
    //     fontFamily: constants.Fonts.K2D_Regular,
    //     color: "#C4C4C4",
    //     fontWeight: "600",
    //     textAlign: "center"
    // },
    // divider: {
    //     width: "100%",
    //     height: 2,
    //     backgroundColor: "rgba(60,60,67,0.29)"
    // },
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
    divider: {
        width: "100%",
        height: 2,
        backgroundColor: "rgba(60,60,67,0.29)"
    },
    modalOkButtonContainer: {
        paddingVertical: constants.vh(9),
        width: constants.vw(268),
        justifyContent: "center",
        alignItems: "center"
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
    text16white: {
        fontSize: 16,
        color: "#fff",
        fontFamily: constants.Fonts.K2D_Regular
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