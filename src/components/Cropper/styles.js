import React from 'react';
import { StyleSheet } from 'react-native';

import constants from '../../constants';

export const styles = StyleSheet.create({
    cropView: {
        flex: 1,
        backgroundColor: "transparent",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15
    },
    hitSlop: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
    },
    text: {
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    modalContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        top: 0,
        right: 0
    },
    modalDataContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        backgroundColor: constants.Colors.color_232323,
        borderRadius: 10,
        marginBottom: constants.vh(80),
        marginLeft: constants.vw(30),
    }
})