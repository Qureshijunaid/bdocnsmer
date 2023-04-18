import React from 'react';
import { Image, TouchableNativeFeedback, View, Platform, TouchableOpacity, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from './CountryTheme';
import { CountryText } from './CountryText';
import constants from '../../../constants';

const styles = StyleSheet.create({
    container: {
        height: 48,
        width: '100%',
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between",
        alignSelf: "flex-end",
        paddingHorizontal: 15
    },
    imageStyle: {
        height: 25,
        width: 25,
        resizeMode: 'contain',

    },
    text18500: {
        fontSize: 18,
        fontWeight: "500",
        fontFamily: constants.Fonts.K2D_Regular
    }
});
const textSelect = "Select your country"
const CloseButtonAndroid = (props) => {
    let closeImage = require('./assets/images/close.android.png');
    if (props.image) {
        closeImage = props.image;
    }
    const { onBackgroundTextColor } = useTheme();
    return (React.createElement(View, { style: [styles.container, props.style] },
        React.createElement(CountryText, { style: [styles.text18500] }, textSelect),
        React.createElement(TouchableNativeFeedback, {
            background: Platform.Version < 21
                ? TouchableNativeFeedback.SelectableBackground()
                : TouchableNativeFeedback.SelectableBackgroundBorderless(), onPress: props.onPress
        },
            React.createElement(View, null,
                React.createElement(Image, {
                    source: closeImage, style: [
                        styles.imageStyle,
                        props.imageStyle,
                        { tintColor: onBackgroundTextColor }
                    ]
                })))));
};
const CloseButtonIOS = (props) => {
    let closeImage = require('./assets/images/close.ios.png');
    if (props.image) {
        closeImage = props.image;
    }
    const { onBackgroundTextColor } = useTheme();
    return (React.createElement(View, { style: [styles.container, props.style] },
        React.createElement(CountryText, { style: [styles.text18500] }, textSelect),
        React.createElement(TouchableOpacity, { onPress: props.onPress },
            React.createElement(Image, {
                source: closeImage, style: [
                    styles.imageStyle,
                    props.imageStyle,
                    { tintColor: onBackgroundTextColor }
                ]
            }))));
};
const propTypes = {
    onPress: PropTypes.func,
    image: PropTypes.any
};
CloseButtonIOS.prototype = propTypes;
CloseButtonAndroid.prototype = propTypes;
export default Platform.select({
    ios: CloseButtonIOS,
    android: CloseButtonAndroid,
    web: CloseButtonIOS
});
//# sourceMappingURL=CloseButton.js.map