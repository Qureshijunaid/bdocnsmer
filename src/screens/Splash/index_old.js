import React from 'react';
import {
    SafeAreaView,
    View,
    Image,
    Text,
    StatusBar,
    StyleSheet
} from 'react-native';
import { connect } from 'react-redux';

import constants from '../../constants';
import Components from '../../components';

const SplashScreen = (props) => {
    return (
        <>
            <StatusBar backgroundColor={constants.Colors.black} barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                <Image
                    resizeMode="contain"
                    style={styles.splashImage}
                    source={constants.Images.Splash}
                />
                <Image
                    resizeMode="contain"
                    style={styles.loaderDark}
                    source={constants.Images.loaderDark}
                />
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: constants.Colors.black,
        justifyContent: "center",
        alignItems: "center"
    },
    splashImage: {
        width: constants.vw(85),
        height: constants.vh(103),
    },
    loaderDark: {
        marginTop: constants.vh(36),
        width: constants.vw(19),
        height: constants.vh(21),
    }
})

function mapStateToProps(state) {
    const { login } = state
    return {
        login

    }
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SplashScreen);