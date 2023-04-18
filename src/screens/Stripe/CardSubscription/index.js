import React, { useEffect, useState, useRef } from 'react';
import {
    SafeAreaView,
    StatusBar,
    View,
    Text,
    Modal,
    FlatList,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
    Image
} from 'react-native';
import { connect } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image'
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import stripe from 'tipsi-stripe';
import Toast from 'react-native-toast-message';
import { CreditCardInput } from "react-native-credit-card-input";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import { subcribeArtistIntent, paymentSuccess, handlePaymentLoader } from '../../../actions/home';
import {
    getPaymentCardsList,
} from '../../../actions/auth';
import {
    getArtistDetail
} from '../../../actions/profile';

const DEVICE_WIDTH = Dimensions.get("window").width;

const CardSubscription = (props) => {


    let paramsList = useRef();
    useEffect(() => {
        props.dispatch(getPaymentCardsList())


    }, [])
    const [state, setState] = useState({
        thankYouModal: false,
        cardNumber: "",
        expiry: "",
        cvv: "",
        editable: true,
        cardDetails: null,
        selectedIndex: 0,
        selectedCardId: "",
        isAddingCard: false,
        price: props.route.params.price,
        duration: props.route.params.duration,
        fingerPrint: "",
        cardId: "",
        usingSavedCard: false,
        multipleClickDisabled: false
    })
    const createPaymentMethod = async () => {
        // state.multipleClickDisabled = true
        // setState({
        //     ...state
        // })
        props.dispatch(handlePaymentLoader(true))
        if (state.cardNumber.length < 1) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter your card number",
                type: "error",
                position: "top"
            });
            props.dispatch(handlePaymentLoader(false))
            return 1;
        }
        // if (state.cardNumber.length < 19) {
        //     Toast.show({
        //         text1: constants.AppConstant.Bando,
        //         text2: "Please enter valid card number.",
        //         type: "error",
        //         position: "top"
        //     });
        //     props.dispatch(handlePaymentLoader(false))
        //     return 1;
        // }
        if (state.expiry.length < 1) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter your card expiry date",
                type: "error",
                position: "top"
            });
            props.dispatch(handlePaymentLoader(false))
            return 1;
        }
        var today, someday;
        var exMonth = parseInt(state.expiry.split("/")[0]);
        var exYear = parseInt(state.expiry.split("/")[1]);
        today = new Date();
        someday = new Date();
        someday.setFullYear(`20${exYear}`, exMonth, 1);
        if (someday < today) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "The expiry date is before today's date. Please select a valid expiry date",
                type: "error",
                position: "top"
            });
            props.dispatch(handlePaymentLoader(false))
            return 1;
        }
        if (state.cvv.length < 3) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter valid cvv/cvc.",
                type: "error",
                position: "top"
            });
            props.dispatch(handlePaymentLoader(false))
            return 1;
        }
        let expireMonth = parseInt(state.expiry.split("/")[0]);
        let expireYear = parseInt(state.expiry.split("/")[1]);
        stripe.createPaymentMethod({
            type: "card",
            card: {
                number: state.cardNumber,
                expMonth: expireMonth,
                expYear: expireYear,
                cvc: state.cvv,
                last4: state.cardNumber,
            }
        }).then((result) => {
            makePayment(result.id, "")
        }).catch((err) => {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: JSON.stringify(err.message),
                type: "error",
                position: "top"
            });
        })


    }

    const makePayment = async (tokenId, cardId) => {
        // state.multipleClickDisabled = true
        // setState({
        //     ...state
        // })
        props.dispatch(handlePaymentLoader(true))
        if (state.cardNumber.length < 1) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter your card number",
                type: "error",
                position: "top"
            });
            props.dispatch(handlePaymentLoader(false))
            return 1;
        }
        // if (state.cardNumber.length < 19) {
        //     Toast.show({
        //         text1: constants.AppConstant.Bando,
        //         text2: "Please enter valid card number.",
        //         type: "error",
        //         position: "top"
        //     });
        //     props.dispatch(handlePaymentLoader(false))
        //     return 1;
        // }
        if (state.expiry.length < 1) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter your card expiry date",
                type: "error",
                position: "top"
            });
            props.dispatch(handlePaymentLoader(false))
            return 1;
        }
        if (state.cvv.length < 3) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter valid cvv/cvc.",
                type: "error",
                position: "top"
            });
            props.dispatch(handlePaymentLoader(false))
            return 1;
        }
        let payload = {
            id: tokenId,
            price: state.price,
            duration: state.duration,
            cardId: cardId,
            cvv: state.cvv
        }

        await props.dispatch(subcribeArtistIntent(payload))

    }

    const renderCardsList = ({ item, index }) => {
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
                        margin: 15
                    }}>
                        <Components.PaymentCard
                            cardType={item.funding}
                            last4Digit={item.last4}
                            expiry={`${exp_month}/${JSON.stringify(item.exp_year).slice(-2)}`}
                            onPress={() => {
                                setState({
                                    ...state,
                                    editable: false,
                                    cardNumber: item.last4,
                                    expiry: `${exp_month}/${JSON.stringify(item.exp_year).slice(-2)}`,
                                    isAddingCard: true,
                                    fingerPrint: item.fingerprint,
                                    cardId: item.id,
                                    usingSavedCard: true
                                })
                            }}
                        />
                    </View>

                </>
            )
        } else {
            return (
                <TouchableOpacity
                    style={{
                        width: DEVICE_WIDTH - 30,
                        height: constants.vh(100),
                        borderWidth: 1,
                        borderStyle: "dashed",
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "center",
                        borderColor: constants.Colors.color_333333
                    }}
                    onPress={() => {
                        setState({
                            ...state,
                            editable: true,
                            cardNumber: "",
                            expiry: "",
                            isAddingCard: true,
                            usingSavedCard: false
                        })
                    }}
                >
                    <Text style={{ color: "#fff" }}>Add Card</Text>
                </TouchableOpacity>

            )
        }
    }

    const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 })

    const onViewRef = React.useRef((info) => {
        setState({
            ...state,
            selectedIndex: info.changed[0].index
        })
    })


    const handleChangeCvv = () => {

    }

    const handleClose = () => {
        console.log("propsssssssss");

        props.dispatch(getArtistDetail())
        props.navigation.goBack()
    }

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={{ flex: 1, backgroundColor: constants.Colors.color_232323 }}>
                {!state.isAddingCard &&
                    <TouchableOpacity
                        onPress={() => props.navigation.goBack()}
                        hitSlop={{
                            top: 5,
                            bottom: 5,
                            right: 5,
                            left: 5
                        }}
                        style={{
                            marginHorizontal: 15
                        }}
                    >
                        <FontAwesome
                            name="chevron-left"
                            size={25}
                            color={constants.Colors.white}
                        />
                    </TouchableOpacity>

                }

                {
                    !state.isAddingCard ?
                        <>
                            <View style={{
                                marginTop: constants.vh(40),

                            }}>
                                <FlatList
                                    data={props.auth.purchaseCardList}
                                    renderItem={renderCardsList}
                                    //horizontal={true}
                                    keyExtractor={(item, index) => index.toString()}
                                    ref={paramsList}
                                    initialScrollIndex={0}
                                    onViewableItemsChanged={onViewRef.current}
                                    viewabilityConfig={viewConfigRef.current}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                />
                                {/* <View style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    alignSelf: "center",
                                    marginTop: constants.vh(20)
                                }}>
                                    {
                                        props.auth.purchaseCardList.map((item, index) => (
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
                                </View> */}

                            </View>
                        </>
                        :
                        <>
                            <KeyboardAwareScrollView
                                keyboardShouldPersistTaps="handled"
                                //style={styles.dataContainer}
                                enableOnAndroid={true}
                                extraHeight={10}
                            >
                                <View style={[styles.headerCrossContainerSubscription, {
                                    backgroundColor: "rgba(255,255,255,0.51)",
                                    alignSelf: "flex-end",

                                }]}>

                                    <AntDesign
                                        name="close"
                                        color={constants.Colors.white}
                                        size={18}
                                        onPress={() => {
                                            setState({
                                                ...state,
                                                isAddingCard: false
                                            })
                                        }}
                                    />

                                </View>
                                <View style={{
                                    marginTop: constants.vh(30),
                                    paddingHorizontal: 15
                                }}>
                                    <View style={{
                                        marginVertical: constants.vh(15)
                                    }}>
                                        <Components.PrimaryMaskedInput
                                            type="custom"
                                            options={{
                                                mask: state.editable ? '9999 9999 9999 9999' : '**** **** **** 9999'
                                            }}
                                            title="Card Number"
                                            placeholder="Card Number"
                                            maxLength={19}
                                            editable={state.editable}
                                            value={state.editable ? `${state.cardNumber}` : `XXXXXXXXXXXX${state.cardNumber}`}
                                            keyboardType="number-pad"
                                            placeholderTextColor={"#fff"}
                                            onChangeText={(cardNumber) => {
                                                // if (cardNumber.length < 20) {
                                                setState({
                                                    ...state,
                                                    cardNumber: cardNumber
                                                })
                                                // }
                                            }}
                                        />
                                    </View>

                                    <View style={{
                                        marginVertical: constants.vh(15)
                                    }}>
                                        <Components.PrimaryMaskedInput
                                            type="datetime"
                                            options={{
                                                format: 'MM/YYYY'
                                            }}
                                            title="Expiry"
                                            placeholder="Expiry"
                                            maxLength={5}
                                            editable={state.editable}
                                            value={state.expiry}
                                            keyboardType="number-pad"
                                            placeholderTextColor={"#fff"}
                                            onChangeText={(expiry) => {
                                                // if (expiry.length < 6) {
                                                setState({
                                                    ...state,
                                                    expiry: expiry
                                                })
                                                // }

                                            }}
                                        />
                                    </View>

                                    <View style={{
                                        marginTop: constants.vh(15),

                                    }}>
                                        <Components.PrimaryInput
                                            title="CVV/CVC"
                                            placeholder="CVV/CVC"
                                            maxLength={4}
                                            returnKeyType="done"

                                            value={state.cvv}
                                            keyboardType="number-pad"
                                            placeholderTextColor={"#fff"}
                                            onChangeText={(cvv) => {
                                                // if (cvv.length < 5) {
                                                setState({
                                                    ...state,
                                                    cvv: cvv
                                                })
                                                // }
                                            }}
                                        />
                                    </View>

                                </View>

                            </KeyboardAwareScrollView>
                            <View style={{
                                width: "90%",
                                alignSelf: "center",
                                position: "absolute",
                                bottom: constants.vh(50)
                            }}>
                                <Components.PrimaryButton
                                    title={"Pay"}
                                    backgroundColor={constants.Colors.color_FF3062}

                                    onPress={() => state.usingSavedCard ? makePayment("", state.cardId) : createPaymentMethod()}
                                    multipleClickDisabled={props.home.multipleClickDisabled}
                                />
                            </View>
                        </>
                }

            </SafeAreaView>


            {/* payment success modal */}
            <Modal
                visible={props.home.thankModal}
                animationType="slide"
                transparent={true}
            >
                <LinearGradient
                    colors={['rgb(47,46,48)', 'rgb(20,20,35)']}
                    style={{
                        flex: 1,
                        marginTop: constants.vh(300),
                        height: "50%",
                        borderRadius: 10,
                    }}
                >
                    <View
                    >

                        <View style={{

                            borderRadius: 15,
                            position: "absolute",
                            width: "100%"
                        }}>

                            <ImageBackground
                                source={constants.Images.BlueEllipses}
                                style={{
                                    width: "100%",
                                    // height:constants.vh(200),
                                    height: constants.vh(400),
                                    // marginTop: constants.vh(50),
                                    justifyContent: 'center',
                                    resizeMode: "stretch",
                                    alignSelf: "center",
                                }}
                            >
                                <TouchableOpacity style={[styles.headerCrossContainerSubscriptionThanks, {
                                    backgroundColor: "rgba(255,255,255,0.51)",
                                    alignSelf: "flex-end",
                                }]}
                                    activeOpacity={1}
                                    onPress={() =>
                                        handleClose()
                                    }
                                >

                                    <AntDesign
                                        name="close"
                                        color={constants.Colors.white}
                                        size={18}
                                        onPress={() =>
                                            handleClose()
                                        }
                                    />

                                </TouchableOpacity>
                                <View style={{ alignSelf: "center" }}>
                                    <Image
                                        source={constants.Images.paymentThankLogo}
                                        resizeMode={"contain"}
                                    />

                                </View>
                                <View style={{ alignSelf: "center", marginTop: constants.vh(31) }}>
                                    <Text style={styles.text40700}>Thank you</Text>


                                </View>
                                <View style={{ alignSelf: "center" }}>
                                    <Text style={styles.text16400}>{constants.ConstStrings.paymentSuccess}</Text>
                                </View>

                            </ImageBackground>


                            <View style={{
                                width: "90%", alignSelf: "center",
                                // marginTop:constants.vh(111)
                            }}>
                                <Components.PrimaryButton
                                    title="Close"
                                    backgroundColor={constants.Colors.color_FF3062}
                                    onPress={() =>
                                        handleClose()
                                    }
                                />
                            </View>
                        </View>

                    </View>
                </LinearGradient>

            </Modal>
            <Components.ProgressView
                isProgress={props.home.isLoading}
                title={constants.AppConstant.Bando}
            />
        </>
    )
}

function mapStateToProps(state) {
    const { auth, home } = state
    return {
        auth, home
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
)(CardSubscription)