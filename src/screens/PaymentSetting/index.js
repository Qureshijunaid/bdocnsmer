import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    FlatList,
    SectionList,
    Modal,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import FastImage from 'react-native-fast-image';

import { styles } from './styles';
import Components from '../../components';
import constants from '../../constants';
import {
    getPurchasesList,
    getSubscriptionList,
    unsubscribeArtist,
    getPaymentCardsList,
    deletePaymentCard
} from '../../actions/auth';
const HEIGHT = Dimensions.get("window").height
const PaymentSetting = (props) => {


    const [state, setState] = useState({
        subscriptions: true,
        purchases: false,
        showCardDetails: false,
        showInfoMsg: false,
        showDeleteCardModal: false,
        deleteCardId: null,
        showCancel: false,
        subscriptionCancelId: null,
        cancelArtistId: null
    })


    useEffect(() => {
        props.dispatch(getPurchasesList())
        props.dispatch(getSubscriptionList())
        props.dispatch(getPaymentCardsList())
        const unsubscribe = props.navigation.addListener('blur', () => {
            setState({
                ...state,
                showCancel: false,
                showDeleteCardModal: false,
                showInfoMsg: false,
            })
        });
        return () => {
            unsubscribe;
        }
    }, [])
    const handleShowMsg = (value) => {
        setState({
            ...state,
            showInfoMsg: value
        })
    }

    const handleToggleTopTab = (subscriptions, purchases, showCardDetails) => {
        // state.subscriptions = subscriptions,
        //     state.purchases = purchases,
        //     state.showCardDetails = showCardDetails
        setState({
            ...state,
            subscriptions: subscriptions,
            purchases: purchases,
            showCardDetails: showCardDetails
        })
    }

    const renderSubscription = ({ item, index }) => {
        let subscriptionType = ""
        if (item.subscriptions.duration === "1") {
            subscriptionType = "Monthly"
        }
        if (item.subscriptions.duration === "3") {
            subscriptionType = "Quarterly"
        }
        if (item.subscriptions.duration === "6") {
            subscriptionType = "Half yearly"
        }

        return (
            <View style={{
                marginVertical: constants.vh(10)
            }}>
                {
                    item.subscriptions.status === 1 ?
                        <Components.PaymentActiveSubscriptionCard
                            artistImage={item.artistDetails[0]?.profileImage ?
                                {
                                    uri: item.artistDetails[0]?.profileImage,
                                    priority: FastImage.priority.high
                                } :
                                {
                                    uri: constants.AppConstant.bandoLogo,
                                    priority: FastImage.priority.high
                                }}
                            artistName={item.artistDetails[0]?.artistName ? item.artistDetails[0]?.artistName : `${item.artistDetails[0]?.firstName} ${item.artistDetails[0]?.lastName}`}
                            subscriptionPrice={`£ ${item.subscriptions.price / 100}`}
                            subscriptionType={subscriptionType}
                            nextPayDate={moment(item.subscriptions.nextPaymentDate).format("DD/MM/YYYY")}
                            subscribedSince={moment(item.subscriptions.createdAt).format("DD/MM/YYYY")}
                            onPressCancel={() =>
                                setState({
                                    ...state,
                                    showCancel: true,
                                    subscriptionCancelId: item.subscriptions._id,
                                    cancelArtistId: item.artistDetails[0]._id
                                })
                            }
                        />
                        :
                        <Components.PaymentCancelledSubscriptionCard
                            artistImage={item.artistDetails[0]?.profileImage ? { uri: item.artistDetails[0]?.profileImage } : { uri: constants.AppConstant.bandoLogo }}
                            artistName={item.artistDetails[0]?.artistName ? item.artistDetails[0]?.artistName : `${item.artistDetails[0]?.firstName} ${item.artistDetails[0]?.lastName}`}
                            subscriptionPrice={`£ ${item.subscriptions.price / 100}`}
                            subscriptionType={subscriptionType}
                            subscriptionStartDate={moment(item.subscriptions.createdAt).format("DD/MM/YYYY")}
                            subscriptionEndDate={moment(item.subscriptions.nextPaymentDate).format("DD/MM/YYYY")}
                        />
                }
            </View>

        )
    }

    const renderOrders = ({ item, index }) => {
        let price = 0;
        let currency = "GBP"
        if (item.merchId.merch_details[0].merchType === "Unique Product") {
            price = item.merchId.price_details[0].price
            currency = item.merchId.price_details[0].currency
        } else {
            price = item.merchId.price_details[0].variations[0].price
            currency = item.merchId.price_details[0].variations[0].currency
        }

        return (
            <View
                style={{
                    marginVertical: 4
                }}
            >
                <Components.PaymentPurchaseCard
                    artistName={item.ArtistId.artistName ? item.ArtistId.artistName : `${item.ArtistId.firstName} ${item.ArtistId.lastName}`}
                    productName={item.merchId.merch_details[0].merchName}
                    price={`£ ${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                />
            </View>
        )
    }

    const hanldeUnsubscribeArtist = (id) => {
        const payload = {
            subscriptionId: state.subscriptionCancelId,
            artistId: state.cancelArtistId
        }
        props.dispatch(unsubscribeArtist(payload))
        setState({
            ...state,
            showCancel: false
        })
    }

    const handleDeleteCardModal = (id) => {
        state.showDeleteCardModal = true
        state.deleteCardId = id
        setState({
            ...state,
        })
        // handleDeleteCard(id)
    }

    const renderCardList = ({ item, index }) => {
        if (item.last4.length > 0) {
            let exp_month = ""
            if (item.exp_month < 10) {
                exp_month = `0${item.exp_month}`
            } else {
                exp_month = item.exp_month
            }
            return (
                <View style={{ marginTop: 10 }}>
                    <Components.PaymentCard
                        showDelete
                        last4Digit={item.last4}
                        expiry={`${exp_month}/${JSON.stringify(item.exp_year).slice(-2)}`}
                        cardType={item.funding}
                        onPressDelete={() => handleDeleteCardModal(item.id)}
                    />
                </View>
            )
        }
    }

    const handleDeleteCard = () => {
        state.showDeleteCardModal = false
        setState({
            ...state,
        })
        const payload = {
            cardId: state.deleteCardId
        }
        props.dispatch(deletePaymentCard(payload))
    }

    const renderEmptyCardList = () => {
        return (
            <View style={{
                flex: 1,
                alignItems: "center",
                paddingTop: constants.vh(100),
            }}>
                <MaterialCommunityIcons
                    name="credit-card-off-outline"
                    size={80}
                    color={constants.Colors.color_333333}
                />
                <Text style={{
                    fontWeight: "700",
                    fontStyle: "normal",
                    fontSize: constants.vw(25),
                    // fontSize: 30,
                    color: constants.Colors.color_333333,
                    fontFamily: constants.Fonts.K2D_Regular
                }}>No Card found.</Text>
            </View>
            // <View style={{
            //     flex: 1,
            //     justifyContent: "center",
            //     alignItems: "center",
            //     marginTop: HEIGHT * 0.25,
            // }}>
            //     <Components.NoPostFound
            //         title="No Card found."
            //     />
            // </View>
        )
    }

    const renderEmptyPurchase = () => {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: constants.vh(55)
            }}>
                <MaterialCommunityIcons
                    name="cart-outline"
                    size={80}
                    color={constants.Colors.color_333333}
                />
                <Text style={{

                    fontWeight: "700",
                    fontStyle: "normal",
                    fontSize: constants.vw(25),
                    // fontSize: 30,
                    color: constants.Colors.color_333333,
                    fontFamily: constants.Fonts.K2D_Regular
                }}>No Purchase found.</Text>
            </View>
            // <View style={{
            //     flex: 1,
            //     justifyContent: "center",
            //     alignItems: "center",
            //     marginTop: HEIGHT * 0.25,
            // }}>
            //     <Components.NoPostFound
            //         title="No Purchase found."
            //     />
            // </View>

        )
    }

    const renderEmptySubscription = () => {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: constants.vh(100)
            }}>
                <MaterialCommunityIcons
                    name="email-outline"
                    size={80}
                    color={constants.Colors.color_333333}
                />
                <Text style={{
                    fontWeight: "700",
                    fontStyle: "normal",
                    fontSize: constants.vw(25),
                    // fontSize: 30,
                    color: constants.Colors.color_333333,
                    fontFamily: constants.Fonts.K2D_Regular
                }}>No Subscription found.</Text>
            </View>
            // <View style={{
            //     flex: 1,
            //     justifyContent: "center",
            //     alignItems: "center",
            //     marginTop: HEIGHT * 0.25,
            // }}>
            //     <Components.NoPostFound
            //         title="No Subscription found."
            //     />
            // </View>
        )
    }

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                <View style={{
                    flex: 1,
                    paddingHorizontal: 15
                }}>
                    <View style={{
                        marginTop: 10,
                        marginBottom: 10,
                    }}>
                        <Components.HeaderWithTitle
                            onPress={() => props.navigation.goBack()}
                        />
                    </View>
                    <View style={{ paddingHorizontal: 15 }}>
                        <Text style={styles.text30bold}>{constants.ConstStrings.payment_Settings}</Text>
                    </View>
                    <View style={{ marginTop: constants.vh(20) }}>
                        <Text style={styles.text16500}>{constants.ConstStrings.viewAndManageYourSubscriptionsViewYourPurchases}</Text>
                    </View>

                    <View style={styles.statsButtonContainer}>
                        <View style={{
                            width: "33%",
                        }}>
                            <Components.PrimaryButton
                                onPress={() => handleToggleTopTab(true, false, false)}
                                borderRadius={100}
                                paddingVertical={constants.vh(7)}
                                title={"Subscriptions"}
                                backgroundColor={state.subscriptions ? constants.Colors.color_FF3062 : constants.Colors.color_2F2F2F}
                            />
                        </View>
                        <View style={{
                            width: "33%",
                        }}>
                            <Components.PrimaryButton
                                onPress={() => handleToggleTopTab(false, true, false)}
                                borderRadius={100}
                                paddingVertical={constants.vh(7)}
                                title={"Purchases"}
                                backgroundColor={state.purchases ? constants.Colors.color_FF3062 : constants.Colors.color_2F2F2F}
                            />
                        </View>

                        <View style={{
                            width: "33%"
                        }}>
                            <Components.PrimaryButton
                                onPress={() => handleToggleTopTab(false, false, true)}
                                borderRadius={100}
                                paddingVertical={constants.vh(7)}
                                title={"Card Details"}
                                backgroundColor={state.showCardDetails ? constants.Colors.color_FF3062 : constants.Colors.color_2F2F2F}
                            />
                        </View>
                    </View>
                    {
                        state.subscriptions &&
                        <>
                            <View style={{
                                flex: 1,
                            }}>
                                <FlatList
                                    data={props.auth.subscriptionList}
                                    renderItem={renderSubscription}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                    ListEmptyComponent={renderEmptySubscription}
                                />

                            </View>
                        </>
                    }

                    {
                        state.purchases &&
                        <>
                            <View style={{ alignSelf: "flex-end", marginTop: constants.vh(14) }}>
                                <SimpleLineIcons
                                    onPress={() => handleShowMsg(true)}
                                    name="question"
                                    size={22}
                                    color="#DADADA"
                                />
                            </View>
                            <View style={{
                                flex: 1,
                                marginTop: constants.vh(10)
                            }}>
                                <SectionList
                                    sections={props.auth.purchasesList}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={renderOrders}
                                    renderSectionHeader={({ section: { title } }) => (
                                        <Text style={[styles.text12bold, { paddingVertical: constants.vh(5), backgroundColor: constants.Colors.color_232323 }]}>{moment(title).format("DD/MM/YYYY")}</Text>
                                    )}
                                    showsVerticalScrollIndicator={false}
                                    ListEmptyComponent={renderEmptyPurchase}
                                />
                            </View>
                        </>
                    }

                    {
                        state.showCardDetails ?

                            (props.auth.cardList.length > 1 ?
                                <View style={{
                                    flex: 1,
                                    marginTop: constants.vh(20)
                                }}>
                                    <FlatList
                                        data={props.auth.cardList}
                                        renderItem={renderCardList}
                                        keyExtractor={(item, index) => index.toString()}
                                        showsVerticalScrollIndicator={false}
                                        ListEmptyComponent={renderEmptyCardList}
                                    />
                                </View>
                                :
                                renderEmptyCardList()
                            )
                            :
                            null


                    }

                </View>
            </SafeAreaView>
            <Components.ProgressView
                isProgress={props.auth.isLoading}
                title={constants.AppConstant.Bando}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={state.showInfoMsg}
            >
                <TouchableOpacity
                    onPress={() => handleShowMsg(false)}
                    activeOpacity={1}
                    style={styles.modalSorryMain}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.modalSorrySecondry}>
                        <View style={{
                            paddingVertical: constants.vh(20),
                            paddingHorizontal: constants.vw(20),
                        }}>
                            <Text style={[styles.text18bold, { textAlign: "center", marginBottom: constants.vh(10) }]}>{constants.ConstStrings.settingModalData1}</Text>
                            <View >
                                <Text style={styles.text14600}>{constants.ConstStrings.settingModalData2}</Text>
                                <Text style={styles.text14600}>{constants.ConstStrings.settingModalData3}</Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => handleShowMsg(false)}
                            style={styles.modalOkButtonContainer}>
                            <Text style={styles.text16500}>Ok</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>

                </TouchableOpacity>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={state.showDeleteCardModal}
            >
                <View
                    style={styles.modalMain}
                >
                    <View style={styles.modalSecondry}>
                        <Text style={styles.text23white}>Delete?</Text>
                        <Text
                            style={styles.text16C4C4C4}
                        >You sure you want to</Text>
                        <Text
                            style={styles.text16C4C4C4}
                        >delete?</Text>

                    </View>
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={handleDeleteCard}
                            style={styles.modalButton}
                        >
                            <Text
                                style={[styles.text16white, {
                                    color: "#FF4F4F",
                                }]}
                            >Yes, Delete</Text>
                        </TouchableOpacity>
                        <View
                            style={{
                                paddingVertical: constants.vh(28),
                                width: 2,
                                backgroundColor: "rgba(84, 84, 88, 0.65)"
                            }}
                        />
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                setState({
                                    ...state,
                                    showDeleteCardModal: false
                                })
                            }}
                            style={styles.modalButton}
                        >
                            <Text
                                style={styles.text16white}
                            >Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={state.showCancel}
            >
                <View
                    style={styles.modalMain}
                >
                    <View style={styles.modalSecondry}>
                        <Text style={styles.text23white}>Cancel subscription?</Text>
                        <Text
                            style={styles.text16C4C4C4}
                        >You sure you want to</Text>
                        <Text
                            style={styles.text16C4C4C4}
                        >unsubscribe?</Text>

                    </View>
                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={hanldeUnsubscribeArtist}
                            style={styles.modalButton}
                        >
                            <Text
                                style={[styles.text16white, {
                                    color: "#FF4F4F",
                                }]}
                            >Yes</Text>
                        </TouchableOpacity>
                        <View
                            style={{
                                paddingVertical: constants.vh(28),
                                width: 2,
                                backgroundColor: "rgba(84, 84, 88, 0.65)"
                            }}
                        />
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => {
                                setState({
                                    ...state,
                                    showCancel: false
                                })
                            }}
                            style={styles.modalButton}
                        >
                            <Text
                                style={styles.text16white}
                            >Cancel</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>

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
)(PaymentSetting)