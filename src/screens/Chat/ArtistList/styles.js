import {
    StyleSheet,
    Platform,
    Dimensions
} from 'react-native';
import constants from '../../../constants';

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
    dataContainer: {
        flex: 1,
        paddingHorizontal: 20,
        //marginTop: constants.vh(33)
    },

    horizontalImage: {
        width: constants.vh(60),
        borderRadius: constants.vh(30),
        height: constants.vh(60)
    },
    horizontalText: {
        fontWeight: "400",
        fontFamily: constants.Fonts.SF_ProText,
        fontSize: constants.vw(12),
        color: constants.Colors.color_B0B0B0,
        fontStyle: "normal",
        marginTop: constants.vh(10),
        alignSelf: 'center',
        textTransform:"capitalize"

        // backgroundColor:'red',
        // width:"100%",
    },
    headerContainer: {
        width: "90%",
        alignSelf: 'center',
        alignItems: "flex-end",
        marginTop: constants.vh(15)
    },
    chatSearchContainer: {
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf:"center",
        alignItems: "center",
        marginTop: constants.vh(35)
    },
    titleText:{
       fontFamily:constants.Fonts.K2D_Regular,
       fontWeight:"700",
       fontSize:constants.vw(35),
       fontStyle:"normal",
       color:constants.Colors.white 
    }
})