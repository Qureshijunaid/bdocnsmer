import React, { useState, useEffect } from 'react';
import {
    StatusBar,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Modal,
    Image,
    SafeAreaView
} from 'react-native';
import { connect } from 'react-redux';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';

import { paymentSuccess } from '../../../actions/home';
import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import * as NavigationService from '../../../navigation/NavigationService';

const MerchNotification = (props) => {
    const [showPopUp, setShowPopUp] = useState(true)
    const [state, setState] = React.useState({
        isNotificationData: props.route.params.notificationData,
        isAudioLiked: false,
        paymentCardModal: false,
        thankModalState: true,
        showMerchModal: true,
        onItemSelect: JSON.parse(props.route.params.notificationData.images)[0],
        buyMerchDetail: props.route.params.notificationData,
        selectSize: 0,
        handleNavigationToHome: 0
    })
    useEffect(() => {
        const subscribeOnFocus = props.navigation.addListener('focus', () => {
            setState({
                ...state,
                handleNavigationToHome: state.handleNavigationToHome++
            })
            setShowPopUp(true)
        });
        const unsubscribeOnBlur = props.navigation.addListener('blur', () => {
            setShowPopUp(false)
            setState({
                ...state,
                handleNavigationToHome: 0
            })
        });
        return () => {
            subscribeOnFocus;
            unsubscribeOnBlur;
        }
    }, [])

    const handleNavigationAfterBuyToHome = () => {
        if (state.handleNavigationToHome > 0) {
            NavigationService.navigate(constants.ScreensName.Homepage.name)
        }
    }

    const handleCrossImageModal = () => {
        setState({ ...state, showMerchModal: false })
        props.navigation.goBack()
    }

    const handleMerchBuy = () => {
        props.dispatch(paymentSuccess(true, false, false))
        state.showMerchModal = false
        setState({
            ...state,

        })
        let merch = {
            _id: state.buyMerchDetail._id,
            price_details: JSON.parse(state.buyMerchDetail.price_details),
            merch_details: JSON.parse(state.buyMerchDetail.merch_details)
        }
        NavigationService.navigate(constants.ScreensName.Cards.name, {
            merch: merch,
            selectedSize: state.selectSize
        })
    }

    const handleImageSelectionInModal = (data) => {
        state.onItemSelect = data
        setState({
            ...state,
        })

    }

    const buyNowContent = () => {
        return (
            <View style={{
                marginTop:
                    JSON.parse(state.isNotificationData.merch_details)[0].merchType !== "Unique Product" ?
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

    const renderMerchandiseImages = ({ item, index }) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    marginEnd: constants.vw(20)
                }}
                onPress={() => handleImageSelectionInModal(item)}
            >
                <Image
                    source={{ uri: item }}
                    style={{
                        width: constants.vw(67),
                        height: constants.vw(67),
                        borderRadius: 10
                    }}
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
                    backgroundColor: (item?.inStock === "0" ? constants.Colors.soldOut : "transparent")
                }]}
                onPress={() => {
                    setState({
                        ...state,
                        selectSize: index,
                        selectedQuantityPrice: item.price,
                        selectedMerchQuantity: item.quantity
                    })
                }}
            >
                <Text style={styles.text16normal}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    const soldOut = () => {
        return (
            <View style={{
                marginTop: constants.vh(30)
            }}>
                <Components.PrimaryButton
                    backgroundColor={constants.Colors.color_FF005C}
                    title={constants.ConstStrings.soldOut}
                />
            </View>
        )
    }

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>

                <Components.ProgressView
                    isProgress={props.profile.isLoading}
                    title={constants.AppConstant.Bando}
                />
            </SafeAreaView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showPopUp}
                onShow={() => handleNavigationAfterBuyToHome()}

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
                            onPress={() => { handleCrossImageModal() }}
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
                            <Text style={styles.text18500}>{JSON.parse(state.isNotificationData?.merch_details)[0].merchName}</Text>
                        </View>


                        <TouchableOpacity
                            activeOpacity={1} style={styles.merchandiseImageContainer}>
                            <Image
                                source={{ uri: state.onItemSelect }}
                                style={{
                                    width: constants.vw(340),
                                    height: constants.vh(280),
                                    borderRadius: 10
                                }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{ flex: 1, marginTop: 20 }}>
                            <FlatList
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={JSON.parse(state.isNotificationData?.images)}
                                renderItem={renderMerchandiseImages}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </TouchableOpacity>



                        <TouchableOpacity
                            activeOpacity={1}
                            style={{ flex: 1, marginTop: 20 }}>
                            <Text style={styles.text23800}>£{
                                JSON.parse(state.isNotificationData.merch_details)[0].merchType !== "Bulk Product" ? JSON.parse(state.isNotificationData.price_details)[0].price.toFixed(2) : JSON.parse(state.isNotificationData.price_details)[0].variations[0].price.toFixed(2)
                            }</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{ flex: 1, marginTop: constants.vh(20) }}>
                            <Text style={styles.text16600}>{JSON.parse(state.isNotificationData?.merch_details)[0].description}</Text>
                        </TouchableOpacity>


                        {

                            JSON.parse(state.isNotificationData?.merch_details)[0].merchType !== "Unique Product" &&
                            <View>
                                <Text style={[styles.text23800, { marginTop: constants.vh(18) }]}>{constants.ConstStrings.varitations}</Text>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={{ flex: 1, marginTop: 20 }}>
                                    <FlatList
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        data={JSON.parse(state.isNotificationData?.price_details)[0].variations}
                                        renderItem={renderSizeArray}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </TouchableOpacity>
                            </View>
                        }


                        {JSON.parse(state.isNotificationData?.price_details)[0].variations.length > 0 ?
                            JSON.parse(state.isNotificationData?.price_details)[0].variations[state.selectSize].inStock === "1" ?
                                buyNowContent() : soldOut()
                            : JSON.parse(state.isNotificationData?.price_details)[0].inStock === "1" ? buyNowContent() : soldOut()
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

        </>
    )
}
function mapStateToProps(state) {
    const { auth, post, profile, home } = state
    return {
        auth,
        post,
        profile,
        home
    }
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps)
    (MerchNotification);
