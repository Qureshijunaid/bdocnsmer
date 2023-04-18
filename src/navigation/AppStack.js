import React from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import constants from '../constants';

import HomeFeed from '../screens/Home/Feed';
import ArtistDetails from '../screens/Home/ArtistDetails';

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

//Payment
import Cards from '../screens/Stripe/Cards';
import CardSubscription from '../screens/Stripe/CardSubscription';

//VideoPlayer
import VideoPlayer from '../screens/VideoPlayer';

//Collection
import Collection from "../screens/Collection";

import MyTabs from './Tab';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const ChatStack = createStackNavigator();

const AppStack = () => {
    return (
        <Stack.Navigator
            headerMode="none"
        >
            <Stack.Screen
                component={MyTabs}
                name={"Tabs"}

            />
            <Stack.Screen
                component={ArtistDetails}
                name={constants.ScreensName.ArtistDetails.name}

            />


            <Stack.Screen
                component={PostVideo}
                name={constants.ScreensName.PostVideo.name}

            />
            <Stack.Screen
                component={PostAudio}
                name={constants.ScreensName.PostAudio.name}

            />
            <Stack.Screen
                component={PostImage}
                name={constants.ScreensName.PostImage.name}

            />
            <Stack.Screen
                component={MerchNotification}
                name={constants.ScreensName.MerchNotification.name}

            />

            <Stack.Screen
                component={ImageList}
                name={constants.ScreensName.ImageList.name}

            />
            <Stack.Screen
                component={Merch}
                name={constants.ScreensName.Merch.name}

            />
            <Stack.Screen
                component={AudioList}
                name={constants.ScreensName.AudioList.name}

            />
            <Stack.Screen
                component={VideoList}
                name={constants.ScreensName.VideoList.name}

            />
            <Stack.Screen
                component={EditProfile}
                name={constants.ScreensName.EditProfile.name}

            />
            <Stack.Screen
                component={TermsAndCondition}
                name={constants.ScreensName.TermsAndCondition.name}

            />
            <Stack.Screen
                component={PrivacyPolicy}
                name={constants.ScreensName.PrivacyPolicy.name}

            />

            <Stack.Screen
                component={UserProfile}
                name={constants.ScreensName.UserProfile.name}

            />
            <Stack.Screen
                component={Settings}
                name={constants.ScreensName.Settings.name}

            />


            <Stack.Screen
                component={EditShippingDetails}
                name={constants.ScreensName.EditShippingDetails.name}

            />
            <Stack.Screen
                component={PaymentSetting}
                name={constants.ScreensName.PaymentSetting.name}

            />
            <Stack.Screen
                component={EditConsumerGenre}
                name={constants.ScreensName.EditConsumerGenre.name}

            />
            <Stack.Screen
                component={ReplyNotification}
                name={constants.ScreensName.ReplyNotification.name}

            />

            <Stack.Screen
                component={Chatting}
                name={constants.ScreensName.Chatting.name}

            />
            <Stack.Screen
                component={SearchArtistList}
                name={constants.ScreensName.SearchArtistList.name}

            />
            <Stack.Screen
                component={Cards}
                name={constants.ScreensName.Cards.name}

            />
            <Stack.Screen
                component={CardSubscription}
                name={constants.ScreensName.CardSubscription.name}

            />
            <Stack.Screen
                component={VideoPlayer}
                name={constants.ScreensName.VideoPlayer.name}

            />
            <Stack.Screen
                component={Collection}
                name={constants.ScreensName.Collection.name}
            />
        </Stack.Navigator >
    )
}

export default AppStack;