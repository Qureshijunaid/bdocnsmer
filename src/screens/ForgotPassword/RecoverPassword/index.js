import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Platform,
    StatusBar,
    FlatList,
    Image,
    TouchableOpacity,
    ScrollView,
    TextInput
} from 'react-native';
import { connect } from 'react-redux';
import * as NavigationService from '../../../navigation/NavigationService';
import constants from '../../../constants';
import Components from '../../../components';
import * as EmailValidator from 'email-validator';
import Toast from 'react-native-toast-message';
import { styles } from './styles';
import {
    forgetPassword, setEmail
    , clearForgetPassword
} from '../../../actions/registration';
const RecoverPassword = (props) => {
    const [state, setState] = useState({
        activeButton: false,
        email: ''
    })

    const handleNext = () => {
        if (state.email.length === 0) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter your email address",
                type: "error",
                position: "top"
            });
            return 1;
        }
        if (!EmailValidator.validate(state.email.toLowerCase())) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter valid email address",
                type: "error",
                position: "top"
            });
            return 1;
        }
        const payload = {
            "email": state.email.toLowerCase(),
        }

        props.dispatch(setEmail(payload))

        props.dispatch(forgetPassword(payload))
    }
    const handleGoBack = () => {
        let payload = {
            "email": null
        }
        props.dispatch(clearForgetPassword(payload))
        // props.dispatch(setEmail(payload))
        props.navigation.goBack()
    }
    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={[styles.container]}>
                <ScrollView style={styles.dataContainer}>
                    <Components.HeaderWithProgressForgetPassword
                        title="Recover Password"
                        presentCount={1}
                        totalCount={3}
                        onPress={() => {
                            handleGoBack()
                        }}
                    />
                    <View style={styles.aboutYouContainer}>
                        <Text style={styles.text30bold}>{constants.ConstStrings.recoverYour}</Text>
                        <Text style={styles.text30bold}>{constants.ConstStrings.password}</Text>
                        <Text style={[styles.text16500, { marginTop: 10 }]}>{constants.ConstStrings.enterYourEmailBelowDescription}</Text>
                        <Text style={styles.text16500}>{constants.ConstStrings.linkToResetYourPassword}</Text>
                    </View>

                    {props.registration.forgetPasswordFailResponse === null ?

                        <View style={styles.emailContainer}>
                            <Components.PrimaryInput
                                placeholder={constants.ConstStrings.email}
                                placeholderTextColor={constants.Colors.color_B9B9B9}
                                onChangeText={(email) => {
                                    setState({
                                        ...state,
                                        email: email,
                                        activeButton: true
                                    })
                                }}
                            />
                        </View>

                        :
                        <View style={styles.emailContainer}>
                            <Text style={styles.text13normal}>{constants.ConstStrings.email}</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholderTextColor={constants.Colors.color_B9B9B9}
                                    placeholder={constants.ConstStrings.email}
                                    style={styles.input}
                                    autoCapitalize="none"
                                    onChangeText={(email) => {
                                        setState({
                                            ...state,
                                            email: email,
                                        })
                                    }}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[styles.text13normal, { color: constants.Colors.color_FFF500, fontWeight: "normal" }]}>{constants.ConstStrings.emailNotFound}</Text>
                                <Text style={[styles.text13normal, { color: constants.Colors.color_FFF500, fontWeight: "normal" }]}>{constants.ConstStrings.useAnotherEmail}</Text>
                            </View>

                        </View>

                    }


                </ScrollView>
                <View style={{ paddingHorizontal: 15, marginBottom: 15 }}>
                    <Components.PrimaryButton
                        title={constants.ConstStrings.next}
                        onPress={() => {
                            state.email ?
                                handleNext()
                                : null

                        }}
                        backgroundColor=
                        {state.email ?
                            constants.Colors.color_FF3062 :
                            constants.Colors.rgb_126_39_60
                        }
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
    const { login, registration } = state
    return {
        login, registration

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
)(RecoverPassword);