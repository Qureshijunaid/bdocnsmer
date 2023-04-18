import React from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import constants from '../constants';
import * as NavigationService from '../navigation/NavigationService';

import HomeFeed from '../screens/Home/Feed';
import { connect } from 'react-redux';
import ArtistDetails from '../screens/Home/ArtistDetails';
import {
    getSubcribedArtistList,
    getSubcribedArtistChatList,
} from '../actions/chat';

//Notification
import PostAudio from '../screens/Notifications/Audio';
import PostVideo from '../screens/Notifications/Video';
import PostImage from '../screens/Notifications/Image';
import MerchNotification from '../screens/Notifications/Merch'
import ReplyNotification from '../screens/Notifications/Reply';

//User Profile
import UserProfile from '../screens/UserProfile';
/***********************************OLD***********************/

//Artist Details
// import ArtistDetails from '../screens/EditArtistProfile/ArtistDetails';
import ImageList from '../screens/EditArtistProfile/ImageList';
import AudioList from '../screens/EditArtistProfile/AudioList';
import VideoList from '../screens/EditArtistProfile/VideoList';
import EditProfile from '../screens/EditArtistProfile/ApplicationForm';


//Shipping Details
import EditShippingDetails from '../screens/EditArtistProfile/EditShippingDetails';

//PaymentSetting
import PaymentSetting from '../screens/PaymentSetting';

import EditConsumerGenre from '../screens/EditArtistProfile/EditConsumerGenre';

//Search
import Search from '../screens/Search';

//Merch
import Merch from '../screens/Merch';

//Statistics
import Statistics from '../screens/Statistics';

//Settings
import Settings from '../screens/Settings';
import TermsAndCondition from '../screens/TermsAndCondition';
import PrivacyPolicy from '../screens/PrivacyPolicy';


//Chat
import ArtistList from '../screens/Chat/ArtistList';
import SearchArtistList from '../screens/Chat/SearchArtistList'
import Chatting from '../screens/Chat/Chatting';


export function getTabBarVisibility(route) {

    let index = true
    if (route.name === "ChatTab") {
        index = route.state ? route.state.index < 2 : false;

        // if (index) {
        return true;
        // }
        // return false;
    }
    else {
        index = route.state ? route.state.index > 0 : false;
        if (index) {
            return false;
        }
        return true;
    }
}

const styles = StyleSheet.create({
    tabImage: {
        width: constants.vw(20),
        height: constants.vw(20),
        resizeMode: "contain"
    },
    tabContainer: {
        flexDirection: "column",
        alignItems: "center"
    }
})


const Tab = createBottomTabNavigator();
const ChatStack = createStackNavigator();

const MyTabs = (props) => {

    const handleGetSubcribed = () => {
        let payload = {
            "pageNumber": 1
        }
        props.dispatch(getSubcribedArtistChatList(payload))
        props.dispatch(getSubcribedArtistList(payload))

    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarVisible: getTabBarVisibility(route),
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName
                    let title
                    let titleColor
                    if (route.name === constants.ScreensName.Homepage.name) {
                        iconName = focused
                            ? constants.Images.HomeTabFill
                            : constants.Images.HomeTab
                        title = "Home"
                        titleColor = focused
                            ? constants.Colors.color_FF3062
                            : constants.Colors.color_B0B0B0

                    }
                    else if (route.name === constants.ScreensName.Search.name) {
                        iconName = focused
                            ? constants.Images.SearchTabFill
                            : constants.Images.SearchTab
                        title = "Search"
                        titleColor = focused
                            ? constants.Colors.color_FF3062
                            : constants.Colors.color_B0B0B0
                    }
                    else if (route.name === constants.ScreensName.Merch.name) {
                        iconName = focused
                            ? constants.Images.MerchTabFill
                            : constants.Images.MerchTab
                        title = "Merch"
                        titleColor = focused
                            ? constants.Colors.color_FF3062
                            : constants.Colors.color_B0B0B0
                    }
                    else if (route.name === "ChatTab") {
                        iconName = focused
                            ? constants.Images.ChatFocus
                            : constants.Images.ChatUnFocus
                        title = "Chat"
                        titleColor = focused
                            ? constants.Colors.color_FF3062
                            : constants.Colors.color_B0B0B0
                    }
                    return (
                        <View style={styles.tabContainer}>
                            <Image
                                source={iconName}
                                resizeMode={'cover'}
                                style={styles.tabImage}
                            />
                            <Text style={{
                                fontSize: 16,
                                fontFamily: constants.Fonts.K2D_Regular,
                                color: titleColor
                            }}>{title}</Text>
                        </View>

                    )
                }

            })}
            tabBarOptions={{
                showLabel: false,
                style: {
                    height: constants.vh(70),
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: Platform.OS === "ios" ? constants.vh(15) : constants.vh(0),
                    backgroundColor: constants.Colors.black,
                    borderTopColor: constants.Colors.black,
                }
            }}
        >
            <Tab.Screen
                name={constants.ScreensName.Homepage.name}
                component={HomeFeed}
            />
            <Tab.Screen
                name={constants.ScreensName.Search.name}
                component={Search} />


            <Tab.Screen
                name={"ChatTab"}
                component={ChatTab}

                listeners={{
                    tabPress: e => {
                        handleGetSubcribed()
                        NavigationService.navigate(ChatTab, null)
                    }
                }}

            />

        </Tab.Navigator>
    );
}

function mapStateToProps(state) {
    const { profile, app, home, chat } = state
    return {
        profile, home, chat

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
)(MyTabs)


const ChatTab = () => {
    return (
        <ChatStack.Navigator
            headerMode="none"
        >

            <ChatStack.Screen
                component={ArtistList}
                name={constants.ScreensName.ArtistList.name}
                options={{
                    gestureEnabled: false
                }}
            />
            {/* <ChatStack.Screen
                component={SearchArtistList}
                name={constants.ScreensName.SearchArtistList.name}
                options={{
                    gestureEnabled: false
                }}
            /> */}

        </ChatStack.Navigator>
    )
}