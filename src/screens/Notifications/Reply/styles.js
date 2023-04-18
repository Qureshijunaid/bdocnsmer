import { StyleSheet } from "react-native";
import constants from '../../../constants';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: constants.Colors.color_232323,
        flex: 1,
    },
    dataContainer: {
        flex: 1,
        paddingHorizontal: 25
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
        height: constants.vh(609),
        backgroundColor: constants.Colors.color_333333,
        width: "100%",
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingVertical: constants.vh(10),
        paddingHorizontal: constants.vw(20),
        marginTop: constants.vh(193)
    },
    crossIconContainer: {
        width: constants.vw(30),
        height: constants.vw(30),
        borderRadius: constants.vw(30 / 2),
        backgroundColor: "rgba(194, 194, 194, 0.29)",
        justifyContent: "center",
        alignItems: "center"
    },
})