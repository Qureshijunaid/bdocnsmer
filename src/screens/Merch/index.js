import React, { useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    Image,
    ScrollView,
    Modal,
    Dimensions,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FastImage from 'react-native-fast-image'
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import stripe from 'tipsi-stripe';
import { connect } from 'react-redux';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import * as NavigationService from '../../navigation/NavigationService';
import { buyMerch, paymentSuccess } from '../../actions/home';
import constants from '../../constants';
import Components from '../../components';
import { styles } from './styles';
import { getMerchList } from '../../actions/merch';
import {
    getPaymentCardsList,
} from '../../actions/auth';

const WIDTH = Dimensions.get("window").width;

const Merch = (props) => {
    const [state, setState] = React.useState({
        toggleMerchOrder: true,
        showMerchDetails: false,
        startDate: null,
        endDate: null,
        showCalendar: false,
        merchandiseArray: [],
        selectedMerch: null,
        selectSize: 0,
        enableMechandiseModal: false,
        confirmEnableMerch: false,
        selectedMerchQuantity: null,
        selectedQuantityPrice: null,
        onItemSelect: null,
        paymentCardModal: false,
        thankModalState: true,
        buyMerchDetail: null,
        pageNumber: 1,
        selectedMerchVariationId: null
    })
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            let payload = {
                "pageNumber": state.pageNumber
            }
            props.dispatch(getMerchList(payload))
            props.dispatch(getPaymentCardsList())
        });
        const unsubscribeOnBlur = props.navigation.addListener('blur', () => {
            setState({
                ...state,
                showMerchDetails: false,
                paymentCardModal: false,
            })
        });
        return () => {
            unsubscribe;
            unsubscribeOnBlur;
        }
    }, [])

    const handleShowMerchDetails = (value) => {
        setState({
            ...state,
            showMerchDetails: value
        })
    }

    const renderMerchandise = ({ item, index }) => {
        return (
            <View style={styles.mechandiseCardContainer}>
                <Components.MerchandiseListCard
                    image={item.images[0]}
                    title={item.merch_details[0].merchName}
                    price={`£ ${item.price_details[0].variations.length > 0 ? item.price_details[0].variations[0].price.toFixed(2)
                        : item.price_details[0].price.toFixed(2)}`}
                    // isSold={item?.price_details[0].variations.length > 0 ?
                    //     item?.price_details[0].variations[0].inStock === "1" ?
                    //         false : true
                    //     : item?.price_details[0].inStock === "1" ? false : true
                    // }
                    isSold={
                        item?.price_details[0].inStock === "1" ? false : true
                    }
                    onPress={() => {
                        props.dispatch(getMerchList())
                        setState({
                            ...state,
                            showMerchDetails: true,
                            selectedMerch: item,
                            onItemSelect: item.images[0],
                            selectedQuantityPrice: item.merch_details[0].merchType !== "Bulk Product" ? item.price_details[0].price : item.price_details[0].variations[0].price
                        })
                    }}
                />
            </View>

        )
    }

    const handleImageSelectionInModal = (data) => {
        state.onItemSelect = data
        setState({
            ...state,
        })

    }

    const renderMerchandiseImages = ({ item, index }) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    marginEnd: constants.vw(20)
                }}
                onPress={() => handleImageSelectionInModal(item)}
            >
                <FastImage
                    style={{
                        width: constants.vw(67),
                        height: constants.vw(67),
                        borderRadius: 10,
                        backgroundColor: "rgba(60,60,67,0.29)"
                    }}
                    source={{
                        uri: item,
                        priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </TouchableOpacity>
        )
    }

    const renderSizeArray = ({ item, index }) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.sizeContainer, {
                    borderColor: (index === state.selectSize ? constants.Colors.white : constants.Colors.color_2F2F2F),
                    backgroundColor: (item.inStock === "0" ? constants.Colors.soldOut : "transparent")
                }]}
                onPress={() => {
                    setState({
                        ...state,
                        selectSize: index,
                        selectedQuantityPrice: item.price,
                        selectedMerchQuantity: item.quantity,
                    })
                }}
            >
                <Text style={styles.text16normal}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    const renderListEmptyComponent = () => {
        return (
            <View style={{
                flex: 1,
                marginTop: constants.vh(180)
            }}>
                <Components.NoPostFound
                    title="There are no merch to show."
                // subtitle="Please add some."
                />
            </View>

        )
    }

    const handleMerchBuy = () => {
        setState({
            ...state,
            showMerchDetails: false
        })
        NavigationService.navigate(constants.ScreensName.Cards.name, {
            merch: state.selectedMerch,
            selectedSize: state.selectSize
        })
    }

    const makePayment = (tokenId, cardId) => {
        let payload = {
            tokenId: tokenId,
            merchId: state.selectedMerch._id,
            price: state.selectedMerch.price_details[0].variations.length > 0 ?
                state.selectedMerch.price_details[0].variations[0].price :
                state.selectedMerch.price_details[0].price,

            currency:
                state.selectedMerch.price_details[0].variations.length > 0 ?
                    state.selectedMerch.price_details[0].variations[0].currency :
                    state.selectedMerch.price_details[0].currency,

            variation: state.selectedMerch.price_details[0].variations.length > 0 ?
                state.selectedMerch.price_details[0].variations[state.selectSize]._id :
                null,

            cardId: cardId
        }

        props.dispatch(buyMerch(payload))
    }

    const requestPayment = (cardDetails, cardId) => {
        if (cardDetails) {
            if (cardDetails.number == "") {
                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: "Please enter your card number",
                    type: "error",
                    position: "top"
                });
                return 1;
            }

            if (cardDetails.expiry == "") {
                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: "Please enter your card expiry date",
                    type: "error",
                    position: "top"
                });
                return 1;
            }

            if (cardDetails.cvc == "") {
                Toast.show({
                    text1: constants.AppConstant.Bando,
                    text2: "Please enter cvc/cvv",
                    type: "error",
                    position: "top"
                });
                return 1;
            }
            let expireMonth = parseInt(cardDetails.expiry.split("/")[0]);
            let expireYear = parseInt(cardDetails.expiry.split("/")[1]);

            stripe
                .createTokenWithCard({
                    number: cardDetails.number,
                    expMonth: expireMonth,
                    expYear: expireYear,
                    cvc: cardDetails.cvc
                })
                .then(stripeTokenInfo => {
                    makePayment(stripeTokenInfo.tokenId, "")
                })
                .catch(error => {
                    Toast.show({
                        text1: constants.AppConstant.Bando,
                        text2: error.message,
                        type: "error",
                        position: "top"
                    });
                })
                .finally(() => {
                });

        } else if (cardId) {
            makePayment("", cardId)

        } else {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please enter your card details",
                type: "error",
                position: "top"
            });
            return 1;
        }
    }

    const buyNowContent = () => {
        return (
            <View style={{
                marginTop:
                    state.selectedMerch?.merch_details[0].merchType !== "Unique Product" ?


                        constants.vh(30) : constants.vh(30)
            }}>
                <Components.PrimaryButton
                    backgroundColor={constants.Colors.color_17B933}
                    title={constants.ConstStrings.buyNow}
                    onPress={() => handleMerchBuy()}
                />
            </View>
        )
    }

    const soldOut = () => {
        return (
            <View style={{
                marginTop:
                    state.selectedMerch?.merch_details[0].merchType !== "Unique Product" ?


                        constants.vh(30) : constants.vh(30)
            }}>
                <Components.PrimaryButton
                    backgroundColor={constants.Colors.color_FF005C}
                    title={constants.ConstStrings.soldOut}
                />
            </View>
        )
    }

    const handleOnReached = async () => {
        if (props.merch.totalCount > props.merch.merchList.length) {
            state.pageNumber = state.pageNumber + 1
            setState({
                ...state
            })
            let payload = {
                "pageNumber": state.pageNumber
            }
            props.dispatch(getMerchList(payload))
        }
    }

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={[styles.container]}>
                <View style={styles.dataContainer}>
                    <View style={styles.headerWithICon}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => props.navigation.goBack()}
                        >
                            <FontAwesome
                                name="chevron-left"
                                size={25}
                                color={constants.Colors.white}
                            />

                        </TouchableOpacity>
                        <View style={[styles.headerImageConainer, { borderRadius: constants.vh(33) / 2 }]}>
                            <FastImage

                                style={styles.headerImageConainer}
                                source={props.auth?.userRegistered?.profileImage != null ?
                                    {
                                        uri: props.auth?.userRegistered?.profileImage,
                                        priority: FastImage.priority.high
                                    } :
                                    {
                                        uri: constants.AppConstant.bandoLogo,
                                        priority: FastImage.priority.high
                                    }}
                                resizeMode={FastImage.resizeMode.cover}
                                onLoadStart={() => { }}
                                onProgress={(e) => { }}
                                onLoad={(e) => { }}
                            />
                        </View>

                    </View>
                    <View style={styles.titleContainer}>
                        {/* <Text style={{ ...styles.text35bold, textTransform: 'capitalize' }}>{ */}
                        <Text style={{ ...styles.text35bold }}>{
                            props.profile.artistDetail[0].artistDeatils.artistName != "" ?
                                props.profile.artistDetail[0].artistDeatils.artistName : `${props.profile.artistDetail[0].artistDeatils.firstName}${' '}${props.profile.artistDetail[0].artistDeatils.lastName}`
                        }</Text>

                    </View>
                    <View style={styles.countMerchContainer}>
                        <Text style={{ ...styles.text35bold }}>{props.profile.artistDetail[1].merchDetails.length > 1 ? "Merches" : constants.ConstStrings.Merch}</Text>
                        <View style={styles.countContainer}>
                            <Components.PrimaryButton
                                title={props.profile.artistDetail != null ?
                                    props.profile.artistDetail[1].merchCount : 0
                                }
                                paddingVertical={1}
                                borderRadius={20}
                            />
                        </View>
                    </View>
                    <View style={{
                        flex: 1
                    }}>
                        <FlatList
                            data={props.merch.merchList}
                            extraData={props.merch.merchList}
                            renderItem={renderMerchandise}
                            horizontal={false}
                            numColumns={2}
                            ListEmptyComponent={renderListEmptyComponent}
                            keyExtractor={(item, index) => index.toString()}
                            onEndReached={handleOnReached}
                            onEndReachedThreshold={0.5}
                        />
                    </View>
                </View>

                {
                    state.selectedMerch ?
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={state.showMerchDetails}

                        >

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                }}>
                                <LinearGradient
                                    colors={[constants.Colors.color_333333, constants.Colors.color_232323,]}
                                    style={{
                                        flex: 1,
                                        marginTop: constants.vh(90),
                                        height: "100%",
                                        borderRadius: 10,
                                        paddingHorizontal: constants.vw(20),
                                        paddingTop: constants.vh(15),
                                        // alignItems: "center"
                                    }}>
                                    <Image
                                        source={constants.Images.HomeIndicator}
                                        style={{ alignSelf: "center" }}
                                    />
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => { handleShowMerchDetails(false) }}
                                        style={styles.modalCrossContainer}
                                    >
                                        <Entypo
                                            name="cross"
                                            size={constants.vw(25)}
                                            color={constants.Colors.white}
                                        />
                                    </TouchableOpacity>
                                    <View
                                        style={styles.modalMerchandisingContainer}
                                    >
                                        <Text style={{ ...styles.text18500 }}>{state.selectedMerch?.merch_details[0].merchName}</Text>
                                    </View>

                                    <TouchableOpacity
                                        activeOpacity={1} style={styles.merchandiseImageContainer}>

                                        <FastImage
                                            style={{
                                                width: constants.vw(340),
                                                height: constants.vh(340),
                                                borderRadius: 10,
                                                alignSelf: "center"
                                            }}
                                            source={{
                                                uri: state.onItemSelect,
                                                // headers: { Authorization: 'someAuthToken' },
                                                priority: FastImage.priority.high,
                                            }}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />

                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={{ flex: 1, marginTop: 20 }}>
                                        <FlatList
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            data={state.selectedMerch?.images}
                                            renderItem={renderMerchandiseImages}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={{ flex: 1, marginTop: 20 }}>
                                        <Text style={styles.text23800}>£{state.selectedQuantityPrice.toFixed(2)}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={{ flex: 1, marginTop: constants.vh(20) }}>
                                        <Text style={styles.text16600}>{state.selectedMerch?.merch_details[0].description}</Text>
                                    </TouchableOpacity>

                                    {
                                        state.selectedMerch?.merch_details[0].merchType !== "Unique Product" &&
                                        <View>
                                            <Text style={[styles.text23800, { marginTop: constants.vh(18) }]}>{constants.ConstStrings.varitations}</Text>
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={{ flex: 1, marginTop: 20 }}>
                                                <FlatList
                                                    horizontal={true}
                                                    showsHorizontalScrollIndicator={false}
                                                    data={state.selectedMerch?.price_details[0].variations}
                                                    renderItem={renderSizeArray}
                                                    keyExtractor={(item, index) => index.toString()}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    }


                                    {state.selectedMerch?.price_details[0].variations.length > 0 ?
                                        state.selectedMerch?.price_details[0].variations[state.selectSize].inStock === "1" ?
                                            buyNowContent() : soldOut()
                                        : state.selectedMerch?.price_details[0].inStock === "1" ? buyNowContent() : soldOut()
                                    }
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={{
                                            marginBottom: constants.vh(50)
                                        }}
                                    >
                                    </TouchableOpacity>
                                </LinearGradient>
                            </ScrollView>
                        </Modal>
                        :
                        null
                }

                <Components.ProgressView
                    isProgress={props.merch.isLoading}
                    title={constants.AppConstant.Bando}
                />
                <Components.AudioMinimize />
            </SafeAreaView>
            {/* card Modal */}

            <Modal
                visible={state.paymentCardModal && props.home.cardModal}
                animationType="slide"
                transparent={true}
            >
                <View style={[styles.carPaymentModal, {
                }]}>
                    <KeyboardAwareScrollView
                        extraHeight={-100}
                        keyboardOpeningTime={10}
                        style={{ flex: 1, width: "100%" }}
                    >
                        <View style={{

                            borderRadius: 15,
                            //position: "absolute",
                            width: "100%",
                            height: constants.vh(610),
                            backgroundColor: 'black',
                            marginTop: constants.vh(200),
                        }}>
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
                                            paymentCardModal: false
                                        })
                                    }}
                                />

                            </View>
                            <View style={{
                                width: WIDTH,
                                alignSelf: "center",
                                marginTop: 10
                            }}>
                                <Components.PaymentSliderFlatList
                                    cardList={props.auth.purchaseCardList}
                                    handlePayment={(cardDetails, cardId) => requestPayment(cardDetails, cardId)}
                                />
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View>
                <Components.ProgressView
                    isProgress={props.home.isLoading}
                    title={constants.AppConstant.Bando}
                />
            </Modal>

            {/* payment success modal */}
            {props.home.buyMerch != null ? <Modal
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
                                <View style={[styles.headerCrossContainerSubscriptionThanks, {
                                    backgroundColor: "rgba(255,255,255,0.51)",
                                    alignSelf: "flex-end",
                                }]}>

                                    <AntDesign
                                        name="close"
                                        color={constants.Colors.white}
                                        size={18}
                                        onPress={() => {
                                            props.dispatch(paymentSuccess(false, false, true))
                                        }}
                                    />

                                </View>
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
                            }}>
                                <Components.PrimaryButton
                                    title="Close"
                                    backgroundColor={constants.Colors.color_FF3062}
                                    onPress={() => {
                                        props.dispatch(paymentSuccess(false, false, true))
                                    }}
                                />
                            </View>

                        </View>

                    </View>
                </LinearGradient>
            </Modal> : null}
        </>
    )
}
function mapStateToProps(state) {
    const { login, newPost, merch, profile, home, auth } = state
    return {
        login, newPost, merch, profile, home, auth

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
)(Merch)