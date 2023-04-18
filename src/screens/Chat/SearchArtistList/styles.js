import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import constants from '../../../constants';
const WIDTH = Dimensions.get("window").width;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.Colors.color_232323,

    },
    headerImage: {
        height: constants.vh(33),
        width: constants.vh(33),
        borderRadius: constants.vh(33 / 2)

    },
    headerContainer: {
        width: "90%",
        alignSelf: 'center',
        alignItems: "flex-end",
        marginTop: constants.vh(15)
    },
    searchBlackContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: constants.Colors.color_636363,
        borderRadius: constants.vw(8),
        width: "90%",
        alignSelf: "center",
        marginTop: constants.vh(35)
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F4F4F4',
        borderRadius: 10
    },

    searchField: {
        //backgroundColor: '#F4F4F4',
        width: WIDTH - 95,

        padding: 12,
        //paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
        fontSize: constants.vw(16),
        height: 50,
        alignItems: 'center',
         color:constants.Colors.white,
        //  color: constants.Colors.color_636363,
        fontFamily: constants.Fonts.K2D_Regular
    },
    searchIcon: {
        backgroundColor: '#F4F4F4',
        width: 35,
        alignItems: 'center',
        //spaddingLeft: 10,
        //paddingRight: 20,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    closeIcon: {
        //backgroundColor: 'red',
        width: 25,
        alignItems: 'center',
        marginEnd: constants.vw(19)
        //spaddingLeft: 10,
        //paddingRight: 20,
    },
    text23white: {
        fontSize: 18,
        fontWeight: "700",
        color: "#fff",
        fontFamily: constants.Fonts.K2D_Regular
    },
})