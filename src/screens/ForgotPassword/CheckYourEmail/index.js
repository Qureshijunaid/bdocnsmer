import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import constants from '../../../constants';
import * as NavigationService from '../../../navigation/NavigationService';
import Components from '../../../components';
import { styles } from './styles';

import { forgetPassword } from '../../../actions/registration'
const CheckYourEmail = (props) => {
    const [state, setState] = useState({
        activeButton: false,
    })

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, [])
    const backAction = () => {
        return true;
    };

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={[styles.container]}>
                <View style={styles.dataContainer}>
                    <View style={styles.aboutYouContainer}>
                        <Text style={styles.text30bold}>{constants.ConstStrings.checkYourEmail}</Text>
                        <Text style={[styles.text16500, { marginTop: constants.vh(25) }]}>{constants.ConstStrings.weSentyouPassword}</Text>
                        <Text style={styles.text16500}>{constants.ConstStrings.pleaseMakeSuretocheckYourSpamFOlder}</Text>
                    </View>
                    <TouchableOpacity

                        onPress={() => props.dispatch(forgetPassword())}
                        style={styles.resendEmailAgainContainer}>
                        <Text style={styles.text14normal}>{constants.ConstStrings.resendEmailAgain}</Text>
                    </TouchableOpacity>

                </View>
                <View style={{
                    paddingHorizontal: 15,
                    marginTop: constants.vh(50),
                    width: '100%',
                }}>
                    <Components.PrimaryButton
                        title={constants.ConstStrings.done}
                        onPress={() => {
                            NavigationService.navigate(constants.ScreensName.Welcome.name, null)
                        }}
                        backgroundColor=
                        // {state.activeButton ?
                        {constants.Colors.color_FF3062}
                    //  :
                    //     constants.Colors.rgb_126_39_60
                    // }
                    />
                </View>
                <Components.ProgressView
                    isProgress={props.registration.isLoading}
                    title={constants.AppConstant.Bando}
                />
            </SafeAreaView>
        </>
    )
}

function mapStateToProps(state) {
    const { login,registration } = state
    return {
        login,registration

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
)(CheckYourEmail);