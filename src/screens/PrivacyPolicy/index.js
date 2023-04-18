import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    FlatList,
    Image,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { WebView } from 'react-native-webview';
import constants from '../../constants';
import Components from '../../components';
import getConfig from '../../utils/config';

const PrivacyPolicy = (props) => {
    const [visible, setVisiblity] = useState(true);
    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: constants.Colors.color_232323
            }}>
                <View style={{
                    paddingHorizontal: 20,
                    marginVertical: 10
                }}>
                    <Components.HeaderWithTitle
                        onPress={() => props.navigation.goBack()}
                        title="Privacy Policy"
                    />

                </View>
                <WebView
                    onLoad={() => setVisiblity(false)}
                    source={{ uri: `${constants.AppConstant.bandoTnCbaseUrl}privacy-policy` }}
                />
                {visible && (
                    <Components.ProgressView
                        isProgress={true}
                        title={constants.AppConstant.Bando}
                    />
                )}
            </SafeAreaView>
        </>
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
)(PrivacyPolicy)
