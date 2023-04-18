import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import constants from '../../constants';
const WIDTH = Dimensions.get("window").width;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.Colors.color_232323
    },
    searchBlackContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: constants.Colors.rgba_255_255_255_1,
        borderRadius: 10
    },
    searchField: {
        width: WIDTH - 95,
        padding: Platform.OS === "ios" ? 12 : 10,
        paddingRight: 20,
        borderRadius: 10,
        fontSize: 18,
        //height: 50,
        alignItems: 'center',
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    searchIcon: {
        backgroundColor: '#F4F4F4',
        width: constants.vw(35),
        alignItems: 'center',
        //spaddingLeft: 10,
        //paddingRight: 20,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F4F4F4',
        borderRadius: 10
    },
    closeIcon: {
        //backgroundColor: 'red',
        width: constants.vw(25),
        alignItems: 'center',
        //spaddingLeft: 10,
        //paddingRight: 20,
    },
    text20bold: {
        fontSize: 20,
        fontWeight: "bold",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
    },
    text16bold: {
        textAlign: 'center',
        fontSize: 16,
        //fontWeight: "bold",
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular
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
        marginTop: constants.vh(140),
        backgroundColor: constants.Colors.color_333333,
        borderRadius: 10,
        paddingHorizontal: constants.vw(20),
        paddingVertical: constants.vh(25),
        flex: 1
    },
    modalHeaderContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
    },
    modalMerchandisingContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
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
    listFooterLayout: {
        height: constants.vh(10)
    },
    mainContainer: {
        paddingVertical: constants.vh(7),
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    text16normal: {
        fontSize: 16,
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white,
        marginEnd: constants.vw(20)
    },
});