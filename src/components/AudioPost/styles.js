
import React from 'react';
import {
    StyleSheet,
    Platform
} from 'react-native';

import constants from '../../constants';
export const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: constants.vh(361),
        borderRadius: 10,
        borderWidth: 1,
        borderColor: constants.Colors.color_333333,
        backgroundColor: constants.Colors.color_333333
    },
    audioImage: {
        height: constants.vh(361),
        borderRadius: 10,
        width: "100%",
    },
    dataContainer: {
        position: "absolute",
        //bottom: constants.vh(1),
        paddingStart: constants.vw(20),
        paddingEnd: constants.vw(25),
        width: "100%",
        height: constants.vh(361),
        flexDirection: "column",
        justifyContent: "space-between",
    },
    secondryDataContainer: {
        paddingBottom: constants.vh(15),
        flexDirection: "row",
        alignItems: "center",
        //marginTop: Platform.OS === "ios" ? constants.vh(130) : constants.vh(130),
    },
    buttonsContainer: {
        width: "30%",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        alignContent: "flex-end",
    },
    descriptionContainer: {
        width: "70%",
        alignSelf: "flex-end"
    },
    profileImage: {
        width: constants.vw(33),
        height: constants.vw(33),
        borderRadius: constants.vw(33 / 2),
        resizeMode: "cover",
    },
    artistProfileContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    artistFirstNameContainer: {
        marginStart: constants.vw(9)
    },
    artistLastNameContainer: {
        marginStart: constants.vw(42),
        marginTop: Platform.OS === "ios" ? constants.vh(0) : constants.vh(-20)
    },
    messageImage: {
        width: constants.vw(25),
        height: constants.vw(25)
    },
    likeButtonContainer: {
        alignSelf: "flex-end",
        marginTop: Platform.OS === "ios" ? constants.vh(0) : constants.vh(-10),
        flexDirection: "column",
        alignItems: "center",
    },
    commentContainer: {
        alignSelf: "flex-end",
        //marginTop: constants.vh(17),
        flexDirection: "column",
        alignItems: "center",
        marginTop: Platform.OS === "ios" ? constants.vh(20) : constants.vh(0),
    },
    text10bold: {
        fontSize: 10,
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "bold",
        color: constants.Colors.white
    },
    text16900: {
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "900",
        color: constants.Colors.white
    },
    text14600: {
        fontSize: 14,
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "600",
        color: constants.Colors.white
    },
    text12600: {
        fontSize: 12,
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "600",
        color: constants.Colors.white
    },
    text30800: {
        fontSize: 20,
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "800",
        color: constants.Colors.white,
        // textTransform: 'capitalize'
    },
    text18800: {
        fontSize: 18,
        fontFamily: constants.Fonts.K2D_Regular,
        fontWeight: "800",
        color: constants.Colors.white,
        // textTransform: 'capitalize'
    }
})