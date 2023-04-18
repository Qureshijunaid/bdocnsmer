import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Platform,
    StatusBar,
    Image,
    BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Feather';


import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import * as NavigationService from '../../../navigation/NavigationService';
import { switchRoute } from '../../../actions/auth';

const ThankYou = (props) => {
    const handleGoToHomepage = () => {
        // props.dispatch(switchRoute())
        NavigationService.navigate(constants.ScreensName.BandoPlan.name, null)
    }

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
            <SafeAreaView style={styles.container}>
                <View style={styles.dataContainer}>
                    <Image
                        source={constants.Images.ThanksForApplying}
                        style={styles.image}
                    />
                    <View style={styles.tickContainer}>
                        <Entypo
                            name="check"
                            color={constants.Colors.white}
                            size={constants.vw(40)}
                        />
                    </View>
                    <View style={styles.thankForApplyingTextContainer}>
                        <Text style={styles.text30normal}>{constants.ConstStrings.thankYou}</Text>
                        <Text style={styles.text16normal}>{constants.ConstStrings.yourAccountCreatedSuccessfully}</Text>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 15, marginBottom: 15 }}>
                    <Components.PrimaryButton
                        title={constants.ConstStrings.done}
                        onPress={() => handleGoToHomepage()}
                        backgroundColor={constants.Colors.color_FF3062}
                    />
                </View>
            </SafeAreaView>
        </>
    )
}

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
)(ThankYou)