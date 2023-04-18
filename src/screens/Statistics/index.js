import React, { useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    FlatList,
    ScrollView,
    Modal,
    TouchableOpacity
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';

import * as NavigationServices from '../../navigation/NavigationService';
import constants from '../../constants';
import Components from '../../components';
import { styles } from './styles';
const Statistics = (props) => {
    const [state, setState] = React.useState({
        showStats: true,
        showAnalyticsType: false,
        selectedAnalyticsType: "Most Merchandise Purchased",
        analyticsTypeArray: [
            { title: "Most Merchandise Purchased" },
            { title: "Months Subscribed" },
            { title: "Posts Liked" },
            { title: "Comments Made" },
            { title: "Posts Shared" },
        ],
        analyticsArray: [
            { title: "John Smith", count: `£658.75` },
            { title: "Michael Arthur", count: `£548.55` },
            { title: "Alice Dewsburry", count: `£329.45` },
            { title: "Jane Smith", count: `£215.25` },
            { title: "Steve Jones", count: `£205.64` },
            { title: "Bob Smith", count: `£154.35` },
            { title: "Alice Jones", count: `£126.95` },
            { title: "Michael Smith", count: `£115.75` },
            { title: "Jana Arthur", count: `£95.75` },
        ],
        statsArray: [
            { title: "Blueprint Hoodle", price: "£8,865.75" },
            { title: "The Blueprint", price: "£7,865.75" },
            { title: "1 Min Personal Message", price: "£2,865.75" },
            { title: "Other", price: "£3,865.75" },
        ]

    })

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('blur', () => {
            setState({
                ...state,
                showAnalyticsType: false,
            })
        });
        return () => {
            unsubscribe;
        };
    }, []);
    const toggleShowStats = (value) => {
        setState({
            ...state,
            showStats: value
        })
    }
    const renderStats = ({ item, index }) => {
        return (
            <View style={{ marginVertical: constants.vw(6) }}>
                <Components.SubscriptionCard
                    showSubTitle={true}
                    subTitle={item.title}
                    subTitleCount={item.price}
                    backgroundColor={constants.Colors.color_333333}
                    paddingVertical={constants.vh(15)}
                />
            </View>
        )
    }
    const renderAnalyticsType = ({ item, index }) => {
        return (
            <View style={{ marginVertical: 5 }}>
                <Components.SubscriptionCard
                    showTitle={true}
                    title={item.title}
                    textAlign={"left"}
                    paddingVertical={constants.vh(10)}
                    backgroundColor={constants.Colors.color_232323}
                    borderRadius={10}
                    titleTextColor={
                        item.title === state.selectedAnalyticsType
                            ? constants.Colors.color_FF3062
                            : constants.Colors.white}
                    onPress={() => {
                        setState({
                            ...state,
                            showAnalyticsType: false,
                            selectedAnalyticsType: item.title
                        })
                    }}
                />
            </View>
        )
    }
    const handleShowAnalyticsType = (value) => {
        setState({
            ...state,
            showAnalyticsType: value
        })
    }

    const renderAnalytics = ({ item, index }) => {
        return (
            <View style={{ marginVertical: 2 }}>
                <Components.SubscriptionCard
                    onPress={() => NavigationServices.navigate(constants.ScreensName.UserProfile.name, null)}
                    showSubTitle={true}
                    subTitle={item.title}
                    subTitleCount={item.count}
                    paddingVertical={constants.vh(10)}
                    backgroundColor={constants.Colors.color_333333}
                    borderRadius={10}
                />
            </View>
        )
    }
    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                <View style={styles.dataContainer}>
                    <Text style={styles.text35bold}>{constants.ConstStrings.Statistics}</Text>

                    <View style={styles.statsButtonContainer}>
                        <View style={{
                            width: "50%",
                        }}>
                            <Components.PrimaryButton
                                onPress={() => toggleShowStats(true)}
                                borderRadius={100}
                                paddingVertical={constants.vh(10)}
                                title={constants.ConstStrings.Stats}
                                backgroundColor={state.showStats ? constants.Colors.color_FF3062 : constants.Colors.color_2F2F2F}
                            />
                        </View>

                        <View style={{
                            width: "50%"
                        }}>
                            <Components.PrimaryButton
                                onPress={() => toggleShowStats(false)}
                                borderRadius={100}
                                paddingVertical={constants.vh(10)}
                                title={constants.ConstStrings.Analytics}
                                backgroundColor={!state.showStats ? constants.Colors.color_FF3062 : constants.Colors.color_2F2F2F}
                            />
                        </View>
                    </View>

                    {
                        state.showStats ?
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                style={{ flex: 1 }}>
                                <View style={styles.marginTop26}>
                                    <Text style={styles.text18500}>{constants.ConstStrings.Subscriptions}</Text>
                                </View>
                                <View style={styles.marginTop11}>
                                    <Components.SubscriptionCard
                                        showDivider={true}
                                        showTitle={true}
                                        showSubTitle={true}
                                        showTitleCount={true}
                                        titleCount={`17,284`}
                                        subTitleCount={`£155,383.16`}
                                        title={constants.ConstStrings.currentSubscribers}
                                        subTitle={constants.ConstStrings.subscriptionRevenue}
                                    />
                                </View>
                                <View style={styles.marginTop26}>
                                    <Text style={styles.text18500}>{constants.ConstStrings.merchandising}</Text>
                                </View>
                                <View style={styles.marginTop11}>
                                    <Components.SubscriptionCard
                                        title={constants.ConstStrings.merchandiseRevenue}
                                        titleCount={`£22,865.75`}
                                        backgroundColor={constants.Colors.color_672EE0}
                                        fontSize={23}
                                        showTitle={true}
                                        showTitleCount={true}
                                    />
                                </View>

                                <View style={{
                                    marginTop: constants.vh(25),
                                    flex: 1
                                }}>
                                    <FlatList
                                        data={state.statsArray}
                                        renderItem={renderStats}
                                        showsVerticalScrollIndicator={false}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
                            </ScrollView>
                            :
                            <View style={{ flex: 1 }}>
                                <View style={{ marginTop: constants.vh(17) }}>
                                    <Components.DropdownCard
                                        onPress={() => handleShowAnalyticsType(true)}
                                        title={state.selectedAnalyticsType}
                                        paddingVertical={constants.vh(12)}
                                    />
                                </View>

                                <View style={{
                                    marginTop: constants.vh(20),
                                    flex: 1
                                }}>
                                    <FlatList
                                        data={state.analyticsArray}
                                        renderItem={renderAnalytics}
                                        keyExtractor={(item, index) => index.toString()}
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
                            </View>
                    }

                </View>
            </SafeAreaView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={state.showAnalyticsType}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => { handleShowAnalyticsType(false) }}
                    style={styles.modalContainer}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.modalDataContainer}
                    >
                        <View style={{ flex: 1 }}>
                            <View style={styles.modalHeaderContainer}>
                                <View
                                    style={styles.modalMerchandisingContainer}
                                >
                                    <TouchableOpacity>
                                        <AntDesign
                                            name="left"
                                            size={constants.vw(30)}
                                            color={constants.Colors.white}
                                        />
                                    </TouchableOpacity>
                                    <Text style={styles.text18500}>Analytics</Text>

                                </View>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => { handleShowAnalyticsType(false) }}
                                    style={styles.modalCrossContainer}
                                >
                                    <Entypo
                                        name="cross"
                                        size={constants.vw(25)}
                                        color={constants.Colors.white}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalFlatlistContainer}>
                                <FlatList
                                    data={state.analyticsTypeArray}
                                    renderItem={renderAnalyticsType}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
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
)(Statistics)