import React, { useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Image,
    Text,
    StatusBar,
    StyleSheet,
    Animated,
    Easing,
    ImageBackground
} from 'react-native';
import { connect } from 'react-redux';

import constants from '../../constants';
import Components from '../../components';

const SplashScreen = (props) => {
    useEffect(() => {
        startSpining()
    }, [])
    const spinValue = new Animated.Value(0);
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })
    const startSpining = () => {
        Animated.loop(
            Animated.timing(
                spinValue,
                {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: true
                }
            )
        ).start();
    }
    return (
        <>
            <StatusBar backgroundColor={constants.Colors.black} barStyle="light-content" />
            {/* <SafeAreaView style={styles.container}> */}
                <ImageBackground
                source={constants.Images.PinkEllipses}
                style={styles.container}
            >
                <Image
                    resizeMode="contain"
                    style={styles.splashImage}
                    source={constants.Images.PinkLogo}
                />
                <Animated.Image
                    style={[{ transform: [{ rotate: spin }] }, styles.loaderDark]}
                    source={constants.Images.loaderDark}
                />
                </ImageBackground>
            {/* </SafeAreaView> */}
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
        alignSelf: "center"
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