import React from 'react';
import {
    TouchableOpacity,
    Text,
    View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';

import constants from '../../constants';
import { styles } from './styles';

export const PrimaryButton = ({
    borderColor,
    backgroundColor,
    title,
    onPress,
    paddingVertical,
    borderRadius,
    textColor,
    multipleClickDisabled
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            disabled={multipleClickDisabled ? multipleClickDisabled : false}
            style={[
                styles.primaryButtonContainer,
                {
                    borderColor: borderColor ? borderColor : "transparent",
                    backgroundColor: backgroundColor ? backgroundColor : constants.Colors.color_FF3062,
                    paddingVertical: paddingVertical ? paddingVertical : constants.vh(16),
                    borderRadius: borderRadius ? borderRadius : 10
                }
            ]}>
            <Text style={[styles.text16600, { color: textColor ? textColor : "#fff" }]}>{title}</Text>

        </TouchableOpacity>
    )
}
export const PrimaryButtonWithMerchCount = ({
    borderColor,
    backgroundColor,
    title,
    onPress,
    paddingVertical,
    borderRadius,
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={[
                styles.primaryButtonContainer,
                {
                    borderColor: borderColor ? borderColor : "transparent",
                    backgroundColor: backgroundColor ? backgroundColor : constants.Colors.color_FF3062,
                    paddingVertical: paddingVertical ? paddingVertical : constants.vh(16),
                    borderRadius: borderRadius ? borderRadius : 10
                }
            ]}>
            <Text style={styles.text70011}>{title}</Text>

        </TouchableOpacity>
    )
}

export const PrimaryButtonWithCount = ({
    borderColor,
    backgroundColor,
    title,
    onPress,
    paddingVertical,
    paddingHorizontal,
    borderRadius,
    count,
    textColor,
    countBackGroundColor
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={[
                styles.primaryButtonContainer,
                {
                    borderColor: borderColor ? borderColor : "transparent",
                    backgroundColor: backgroundColor ? backgroundColor : constants.Colors.color_FF3062,
                    paddingVertical: paddingVertical ? paddingVertical : constants.vh(16),
                    borderRadius: borderRadius ? borderRadius : 10,
                    justifyContent: "space-between",
                    paddingHorizontal: paddingHorizontal ? paddingHorizontal : constants.vw(20)
                }
            ]}>
            <Text style={styles.text16600}>{title}</Text>

            <View style={[styles.countContainer, {
                backgroundColor: countBackGroundColor ? countBackGroundColor : constants.Colors.white
            }]}>
                <Text style={[styles.text11bold, {
                    color: textColor ? textColor : constants.Colors.color_FF005C
                }]}>{count}</Text>
            </View>

        </TouchableOpacity>
    )
}

export const CalendarButton = ({
    onPress,
    date,
    showLock,
    onPressLock
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={styles.calendarButtonContainer}>
            <View style={{ width: "11%" }}>
                <AntDesign
                    name="calendar"
                    size={20}
                    color={constants.Colors.color_B9B9B9}
                />
            </View>

            <View style={styles.dobAndArrowContainer}>
                <View>
                    <Text style={styles.text13normal}>{constants.ConstStrings.dateOfBirth} <Text>(Optional)</Text></Text>
                    <Text style={styles.text16normal}>{date}</Text>
                </View>
                <View>
                    {
                        showLock ?
                            <SimpleLineIcons
                                name={"lock"}
                                color={"#fff"}
                                size={constants.vw(20)}
                                onPress={onPressLock}
                            />
                            :
                            <AntDesign
                                name="down"
                                size={20}
                                color={constants.Colors.color_B9B9B9}
                            />
                    }

                </View>
            </View>
        </TouchableOpacity>
    )
}

export const OrderCalendar = ({
    onPress,
    startDate,
    endDate
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={styles.orderCalendarContainer}
        >
            <View>
                <Text style={styles.text18bold}>{startDate}-{endDate}</Text>
            </View>
            <Feather
                name="calendar"
                size={30}
                color={constants.Colors.white}
            />
        </TouchableOpacity>
    )
}