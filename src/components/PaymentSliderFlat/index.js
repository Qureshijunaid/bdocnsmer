import React, { useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
    Text,
    Platform,
    FlatList
} from "react-native";
import PropTypes from "prop-types";
import { CreditCardInput } from "react-native-credit-card-input";

import constants from '../../constants';
import Components from '../../components';
import { setAudioPlayingState } from "../../actions/audioMinimize";

const DEVICE_WIDTH = Dimensions.get("window").width;
const PaymentSliderFlatList = ({ cardList, handlePayment }) => {
    let paramsList = useRef();
    const [state, setState] = useState({
        cardDetails: null,
        selectedIndex: 0,
        selectedCardId: ""
    })
    const handleScrollToLastIndex = (item) => {
        state.selectedCardId = item.id
        setState({
            ...state
        })
        requestPayment()
    }
    const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 })

    const onViewRef = React.useRef((info) => {
        setState({
            ...state,
            selectedIndex: info.changed[0].index
        })
    })

    const requestPayment = () => {
        handlePayment(state.cardDetails, state.selectedCardId)
    }

    const renderCards = ({ item, index }) => {
        if (item?.last4.length > 0) {
            let exp_month = ""
            if (item.exp_month < 10) {
                exp_month = `0${item.exp_month}`
            } else {
                exp_month = item.exp_month
            }
            return (
                <>
                    <View style={{
                        width: DEVICE_WIDTH - 30,
                        marginHorizontal: 15
                    }}>
                        <Components.PaymentCard
                            cardType={item.funding}
                            last4Digit={item.last4}
                            expiry={`${exp_month}/${JSON.stringify(item.exp_year).slice(-2)}`}
                            onPress={() => handleScrollToLastIndex(item)}
                        />
                    </View>

                </>
            )
        } else {
            return (
                <View>
                    <CreditCardInput
                        onChange={(cardDetails) => {
                            setState({
                                cardDetails: cardDetails.values,
                                selectedCardId: ""
                            })
                        }}
                        inputContainerStyle={{
                            borderBottomColor: 'white',
                            borderBottomWidth: 1,

                        }}
                        inputStyle={{ color: 'white' }}
                        validColor={"green"}
                        invalidColor={"red"}
                        labelStyle={{ color: "white" }}
                        additionalInputsProps={
                            {
                                "number": {
                                    maxLength: 19,
                                    returnKeyType: "done"
                                },
                                "expiry": {
                                    maxLength: 5,
                                    returnKeyType: "done"
                                },
                                "cvc": {
                                    maxLength: 3,
                                    returnKeyType: "done"
                                }
                            }
                        }
                    />

                </View>
            )
        }
    }

    return (
        <View>
            <FlatList
                data={cardList}
                renderItem={renderCards}
                horizontal
                ref={paramsList}
                initialScrollIndex={0}
                onViewableItemsChanged={onViewRef.current}
                viewabilityConfig={viewConfigRef.current}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                alignSelf: "center",
                marginTop: constants.vh(20)
            }}>
                {
                    cardList.map((item, index) => (
                        <View
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: 10,
                                backgroundColor: state.selectedIndex === index ?
                                    constants.Colors.color_FF3062 : constants.Colors.white,
                                marginHorizontal: 5,
                                borderWidth: 1,
                                borderColor: state.selectedIndex === index ?
                                    constants.Colors.color_FF3062 : constants.Colors.white
                            }}
                        />
                    ))
                }
            </View>

            <View style={{
                width: "90%",
                alignSelf: "center",
                marginTop: constants.vh(120)
            }}>
                <Components.PrimaryButton
                    title={"Pay"}
                    backgroundColor={constants.Colors.color_FF3062}
                    onPress={() => requestPayment()}
                />
            </View>

        </View>
    )
}

export default PaymentSliderFlatList;