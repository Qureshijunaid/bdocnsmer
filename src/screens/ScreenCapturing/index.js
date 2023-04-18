import React, { useEffect } from "react";
import { SafeAreaView, Text, Alert } from "react-native";
import RNExitApp from 'react-native-exit-app';
import { connect } from "react-redux";

import { screenShotTaken } from "../../actions/screenshot";

const ScreenCapturing = (props) => {
    useEffect(() => {
        // if (props.auth.userRegistered?.accessToken) {
        //     props.dispatch(screenShotTaken())
        // }
        Alert.alert(
            "Bando",
            props.recordingMsg,
            [
                { text: "OK", onPress: () => RNExitApp.exitApp() }

            ],
            { cancelable: false });
        return true;
    }, [])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <Text></Text>
        </SafeAreaView>
    )
}

function mapStateToProps(state) {
    const { auth } = state
    return {
        auth
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
)(ScreenCapturing)