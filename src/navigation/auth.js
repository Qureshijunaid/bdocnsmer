import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import constants from '../constants';
//Welcome
import Welcome from '../screens/Welcome';

//Login
import LogIn from '../screens/login';

//Creating Account
import PersonalDetails from '../screens/CreatingAccount/PersonalDetails';
import AddEmailPassword from '../screens/CreatingAccount/AddYourEmailPassword';
import PhoneNumber from '../screens/CreatingAccount/AddPhoneNumber';
import ShippingDetails from '../screens/CreatingAccount/ShippingDetails';
import ProfilePicture from '../screens/CreatingAccount/ProfilePicture';
import SelectGenre from '../screens/CreatingAccount/SelectGenre';
import YourOtp from '../screens/CreatingAccount/YourOtp';
import Notifications from '../screens/CreatingAccount/Notifications';
import ThankYou from '../screens/CreatingAccount/ThankYou';
import BandoPlan from '../screens/CreatingAccount/BandoPlan';

//Forgot Password
import RecoverPassword from '../screens/ForgotPassword/RecoverPassword';
import CheckYourEmail from '../screens/ForgotPassword/CheckYourEmail';
import ResetPassword from '../screens/ForgotPassword/ResetPassword'

//privacy policy and Term & Conditions
import TermsAndCondition from '../screens/TermsAndCondition';
import PrivacyPolicy from '../screens/PrivacyPolicy';

const AuthStack = createStackNavigator();
const AuthStackFunc = () => {
    return (
        <AuthStack.Navigator
            headerMode={"none"}

        >
            <AuthStack.Screen
                component={Welcome}
                name={constants.ScreensName.Welcome.name}

            />
            <AuthStack.Screen
                component={LogIn}
                name={constants.ScreensName.LogIn.name}

            />
            <AuthStack.Screen
                component={PersonalDetails}
                name={constants.ScreensName.PersonalDetails.name}

            />
            <AuthStack.Screen
                component={AddEmailPassword}
                name={constants.ScreensName.AddEmailPassword.name}

            />
            <AuthStack.Screen
                component={PhoneNumber}
                name={constants.ScreensName.PhoneNumber.name}

            />
            <AuthStack.Screen
                component={YourOtp}
                name={constants.ScreensName.YourOtp.name}

            />
            <AuthStack.Screen
                component={ProfilePicture}
                name={constants.ScreensName.ProfilePicture.name}

            />
            <AuthStack.Screen
                component={ShippingDetails}
                name={constants.ScreensName.ShippingDetails.name}

            />
            <AuthStack.Screen
                component={SelectGenre}
                name={constants.ScreensName.SelectGenre.name}

            />

            <AuthStack.Screen
                component={Notifications}
                name={constants.ScreensName.Notifications.name}

            />
            <AuthStack.Screen
                component={ThankYou}
                name={constants.ScreensName.ThankYou.name}
                options={{ gestureEnabled: false }}
            />

            <AuthStack.Screen
                component={BandoPlan}
                name={constants.ScreensName.BandoPlan.name}
                options={{ gestureEnabled: false }}
            />

            <AuthStack.Screen
                component={RecoverPassword}
                name={constants.ScreensName.RecoverPassword.name}

            />
            <AuthStack.Screen
                component={CheckYourEmail}
                name={constants.ScreensName.CheckYourEmail.name}

            />

            <AuthStack.Screen
                component={ResetPassword}
                name={constants.ScreensName.ResetPassword.name}
            // name={"ResetPassword"}

            />

            <AuthStack.Screen
                component={TermsAndCondition}
                name={constants.ScreensName.TermsAndCondition.name}

            />

            <AuthStack.Screen
                component={PrivacyPolicy}
                name={constants.ScreensName.PrivacyPolicy.name}

            />


        </AuthStack.Navigator>
    )
}

export default AuthStackFunc;