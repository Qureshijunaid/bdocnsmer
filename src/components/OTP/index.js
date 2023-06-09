import React, { Component } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    Dimensions,
    Keyboard,
    Platform,
    Text
} from "react-native";
import PropTypes from "prop-types";
import constants from '../../constants';

const WIDTH = Dimensions.get('window').width;

const majorVersionIOS = parseInt(`${Platform.Version}`, 10);
const isOTPSupported = Platform.OS === 'ios' && majorVersionIOS >= 12;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    textInput: {
        height: 50,
        width: 50,
        //borderBottomWidth: 2,
        margin: 5,
        textAlign: "center",
        fontSize: 22,
        fontWeight: "500",
        color: "#000000",
    },
    text13normal: {
        fontSize: 13,
        color: constants.Colors.white,
        fontFamily: constants.Fonts.K2D_Regular,
    }
});

const getOTPTextChucks = (inputCount, inputCellLength, text) => {
    let otpText =
        text.match(new RegExp(".{1," + inputCellLength + "}", "g")) || [];

    otpText = otpText.slice(0, inputCount);

    return otpText;
};

class OTPTextView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            focusedInput: 0,
            otpText: getOTPTextChucks(
                props.inputCount,
                props.inputCellLength,
                props.defaultValue
            ),
        };

        this.inputs = [];
    }

    basicValidation = (text) => {

        const validText = /^[0-9a-zA-Z]+$/;
        return text.match(validText);
    };

    onTextChange = (text, i) => {
        const { inputCellLength, inputCount, handleTextChange } = this.props;

        if (text && !this.basicValidation(text)) {
            return;
        }

        this.setState(
            (prevState) => {
                let { otpText } = prevState;
                otpText[i] = text;
                return {
                    otpText,
                };
            },
            () => {
                handleTextChange(this.state.otpText.join(""));
                if (text.length === inputCellLength && i !== inputCount - 1) {
                    this.inputs[i + 1].focus();
                }
                if (i === inputCount - 1 && this.state.otpText[i].length > 0) {
                    Keyboard.dismiss()
                }
            }
        );

    };

    onInputFocus = (i) => {
        const { otpText } = this.state;

        const prevIndex = i - 1;

        if (prevIndex > -1 && !otpText[prevIndex] && !otpText.join("")) {
            this.inputs[prevIndex].focus();
            return;
        }

        this.setState({ focusedInput: i });
    };

    onKeyPress = (e, i) => {
        const { inputCellLength, inputCount, handleTextChange } = this.props;
        const val = this.state.otpText[i] || "";
        if (e.nativeEvent.key === "Backspace" && i !== 0 && !(val.length - 1)) {
            this.inputs[i - 1].focus();
        }
        if (e.nativeEvent.key === "Backspace" && i !== 0 && (val.length - 1)) {
            this.setState(
                (prevState) => {
                    let { otpText } = prevState;
                    otpText[i - 1] = '';

                    return {
                        otpText,
                    };
                },
                () => {
                    handleTextChange(this.state.otpText.join(""));
                    this.inputs[i - 1].focus();

                }
            );
        }
    };

    clear = () => {
        this.setState(
            {
                otpText: [],
            },
            () => {
                this.inputs[0].focus();
            }
        );
    };

    setValue = (value) => {
        const { inputCount, inputCellLength } = this.props;
        this.setState(
            {
                otpText: getOTPTextChucks(inputCount, inputCellLength, value),
            },
            () => {
                this.props.handleTextChange(value);
            }
        );
    };

    handleResend = () => {
        this.setState(
            {
                otpText: [],
            },
            () => {
                this.inputs[0].focus();
            }
        );
        this.props.handleResendOtp()
    }

    render() {
        const {
            inputCount,
            offTintColor,
            tintColor,
            defaultValue,
            inputCellLength,
            containerStyle,
            textInputStyle,
            keyboardType,
            ...textInputProps
        } = this.props;

        const { focusedInput, otpText } = this.state;

        const TextInputs = [];

        for (let i = 0; i < inputCount; i += 1) {
            const inputStyle = [
                styles.textInput,
                textInputStyle,
                { borderColor: offTintColor },
            ];

            if (focusedInput === i) {
                inputStyle.push({ borderColor: tintColor });
            }

            TextInputs.push(
                <TextInput
                    ref={(e) => {
                        this.inputs[i] = e;
                    }}
                    key={i}
                    autoCorrect={false}
                    keyboardType={keyboardType}
                    autoFocus={false}
                    value={otpText[i] || ""}
                    style={inputStyle}
                    maxLength={this.props.inputCellLength}
                    onFocus={() => this.onInputFocus(i)}
                    onChangeText={(text) => this.onTextChange(text, i)}
                    multiline={false}
                    onKeyPress={(e) => this.onKeyPress(e, i)}
                    textContentType={isOTPSupported ? 'oneTimeCode' : 'none'}
                    {...textInputProps}
                />
            );
        }

        return <View>
            <View style={[styles.container, containerStyle]}>
                {TextInputs}
            </View>
            <Text
                onPress={() => this.handleResend()}
                style={[styles.text13normal, {
                    marginTop: constants.vh(25),
                    textDecorationLine: "underline"
                }]}>{constants.ConstStrings.resendCodeAgain}</Text>
        </View>
    }
}

OTPTextView.propTypes = {
    defaultValue: PropTypes.string,
    inputCount: PropTypes.number,
    containerStyle: PropTypes.any,
    textInputStyle: PropTypes.any,
    inputCellLength: PropTypes.number,
    tintColor: PropTypes.string,
    offTintColor: PropTypes.string,
    handleTextChange: PropTypes.func,
    inputType: PropTypes.string,
    keyboardType: PropTypes.string,
};

OTPTextView.defaultProps = {
    defaultValue: "",
    inputCount: 4,
    tintColor: "#3CB371",
    offTintColor: "#DCDCDC",
    inputCellLength: 1,
    containerStyle: {},
    textInputStyle: {},
    handleTextChange: () => { },
    keyboardType: "numeric",
};

export default OTPTextView;
