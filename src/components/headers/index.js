import React from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Text
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FastImage from 'react-native-fast-image';

import constants from '../../constants';
import { styles } from './styles';

export const HeaderWithLogo = ({ onPress }) => {
    return (
        <View style={styles.headerWithLogoContainer}>
            <TouchableOpacity
                activeOpacity={1}
                hitSlop={styles.hitSlop}
                onPress={onPress}
                style={styles.headerWithLogoIconContainer}
            >
                <AntDesign
                    name="arrowleft"
                    size={30}
                    color={"#fff"}
                />
            </TouchableOpacity>
            <View style={styles.headerWithLogoImageContainer}>
                <Image
                    style={styles.headerWithLogoImage}
                    source={constants.Images.headerLogo}
                    priority={FastImage.priority.high}
                    resizeMode={FastImage.resizeMode.cover}
                    onLoadStart={() => { }}
                    onProgress={(e) => { }}
                    onLoad={(e) => { }}
                />
            </View>
        </View>
    )
}

export const HeaderWithProgress = ({
    onPress,
    presentCount,
    totalCount,
    title
}) => {
    var countNow;
    if (presentCount <= totalCount) {
        countNow = presentCount
    } else {
        countNow = totalCount
    }
    const totalWidth = 177;
    const completedWidth = ((countNow / totalCount) * totalWidth)
    const uncompletedWidth = (totalWidth - completedWidth)
    return (
        <View style={styles.headerWithProgressContainer}>
            <TouchableOpacity
                activeOpacity={1}
                hitSlop={styles.hitSlop}
                onPress={onPress}
            >
                <AntDesign
                    name="arrowleft"
                    size={30}
                    color={"#fff"}

                />
            </TouchableOpacity>

            {presentCount && <View>

                {title ?
                    <Text style={styles.text12500}>Step {presentCount} of {totalCount}:
                        New Post
                    </Text>
                    :
                    <Text style={styles.text12500}>Step {presentCount} of {totalCount}:
                        Creating account
                    </Text>}
                <View style={{
                    width: totalWidth,
                    height: 3,
                    flexDirection: "row",
                    marginTop: 4
                }}>
                    <View style={{
                        width: completedWidth,
                        backgroundColor: constants.Colors.color_FF3062
                    }} />
                    <View style={{
                        width: uncompletedWidth,
                        backgroundColor: constants.Colors.white
                    }} />
                </View>
            </View>}

        </View>
    )
}

export const HeaderWithNotification = ({
    title1,
    title2,
    onPress,
    count,
    image,
    showNotification,
    onPressProfile,
    showCount,
    showLogo
}) => {
    return (
        <>
            <View style={styles.headerWithNotificationContainer}>
                <View style={styles.headerWithNotificationTitleContainer}>
                    {
                        showLogo ?
                            <Image
                                source={constants.Images.HomeLogo}
                                style={{ width: constants.vw(100), height: constants.vh(60) }}
                                resizeMode="contain"
                            />
                            :
                            <Text style={styles.headerWithNotificationTitle}>{title1}</Text>
                    }
                </View>
                <View style={styles.headerWithNotificationProfileContainer}>
                    {
                        showNotification &&
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={onPress}
                            style={styles.headerWithNotificationIconContainer}>
                            <Fontisto
                                name="bell"
                                size={constants.vw(25)}
                                color="#fff"
                            />
                            {showCount &&

                                <View style={{
                                    position: "absolute",
                                    bottom: constants.vh(11),
                                    right: constants.vw(26),
                                    width: constants.vw(18),
                                    height: constants.vw(18),
                                    borderRadius: constants.vw(9),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: constants.Colors.color_FF3062
                                }}>
                                    <Text style={{
                                        fontSize: 11,
                                        color: constants.Colors.white,
                                        fontFamily: constants.Fonts.SF_ProText
                                    }}>{count > 9 ? "9+" : count}</Text>
                                </View>
                            }

                        </TouchableOpacity>
                    }

                    {
                        image &&
                        <TouchableOpacity
                            activeOpacity={1}
                            hitSlop={{
                                top: 10,
                                bottom: 10,
                                right: 10,
                                left: 5
                            }}
                            onPress={onPressProfile}
                            style={[styles.headerWithNotificationIconContainer, {
                                height: constants.vw(33),
                                width: constants.vw(33),
                                borderRadius: constants.vw(33 / 2),
                                justifyContent: "center",
                                alignItems: "center",
                            }]}>
                            <FastImage
                                source={image}
                                style={{
                                    height: constants.vw(33),
                                    width: constants.vw(33),
                                    borderRadius: constants.vw(33 / 2),
                                }}
                                priority={FastImage.priority.high}
                                resizeMode={FastImage.resizeMode.cover}
                                onLoadStart={() => { }}
                                onProgress={(e) => { }}
                                onLoad={(e) => { }}
                            />
                        </TouchableOpacity>
                    }
                </View>

            </View>

            {
                !!title2 &&
                <Text style={styles.headerWithNotificationTitle}>{title2}</Text>
            }

        </>
    )
}

export const HeaderWithTitle = ({
    title,
    onPress
}) => {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center"
            }}
        >
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={1}
                hitSlop={{
                    top: 5,
                    left: 5,
                    right: 5,
                    bottom: 5
                }}
            >
                <AntDesign
                    name="arrowleft"
                    size={30}
                    color={constants.Colors.white}
                />
            </TouchableOpacity>

            <View style={{
                width: "80%",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Text style={{
                    fontSize: 23,
                    fontWeight: "800",
                    fontFamily: constants.Fonts.K2D_Regular,
                    color: constants.Colors.white
                }}>{title}</Text>
            </View>
        </View>
    )
}

export const HeaderWithProgressForgetPassword = ({
    onPress,
    presentCount,
    totalCount,
    title
}) => {
    var countNow;
    if (presentCount <= totalCount) {
        countNow = presentCount
    } else {
        countNow = totalCount
    }
    const totalWidth = 177;
    const completedWidth = ((countNow / totalCount) * totalWidth)
    const uncompletedWidth = (totalWidth - completedWidth)
    return (
        <View style={styles.headerWithProgressContainer}>
            <TouchableOpacity
                activeOpacity={1}
                hitSlop={styles.hitSlop}
                onPress={onPress}
            >
                <AntDesign
                    name="arrowleft"
                    size={30}
                    color={"#fff"}

                />
            </TouchableOpacity>

            {presentCount && <View>


                <Text style={styles.text12500}>Step {presentCount} of {totalCount}: {title}
                </Text>

                <View style={{
                    width: totalWidth,
                    height: 3,
                    flexDirection: "row",
                    marginTop: 4
                }}>
                    <View style={{
                        width: completedWidth,
                        backgroundColor: constants.Colors.color_FF3062
                    }} />
                    <View style={{
                        width: uncompletedWidth,
                        backgroundColor: constants.Colors.white
                    }} />
                </View>
            </View>}

        </View>
    )
}

export const HeaderWithRightIcon = ({ onPress }) => {
    return (
        <View style={styles.headerWithLogoContainer}>
            <TouchableOpacity
                activeOpacity={1}
                hitSlop={styles.hitSlop}
                onPress={onPress}
                style={styles.headerWithLogoIconContainer}
            >
                <AntDesign
                    name="arrowleft"
                    size={30}
                    color={"#fff"}
                />
            </TouchableOpacity>
            <View style={styles.headerWithLogoImageContainer}>
                <FastImage
                    style={styles.headerWithLogoImage}
                    source={constants.Images.headerLogo}
                    priority={FastImage.priority.high}
                    resizeMode={FastImage.resizeMode.cover}
                    onLoadStart={() => { }}
                    onProgress={(e) => { }}
                    onLoad={(e) => { }}
                />
            </View>
        </View>
    )
}

export const ChattingHeader = ({ onPress, artistImage, artistName, onArtistProfile }) => {
    return (
        <View style={styles.chattingHeaderContainer}>
            <View style={styles.innerChattingHeaderContainer}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onPress}
                >
                    <AntDesign
                        name="left"
                        color={constants.Colors.white}
                        size={30}
                    />

                </TouchableOpacity>
                <TouchableOpacity onPress={onArtistProfile}>
                    <View style={{ marginStart: constants.vw(10) }}>
                        <FastImage
                            style={styles.artistImage}
                            source={{
                                uri: artistImage,
                            }}
                            priority={FastImage.priority.high}
                            resizeMode={FastImage.resizeMode.cover}
                            onLoadStart={() => { }}
                            onProgress={(e) => { }}
                            onLoad={(e) => { }}
                        />
                    </View>
                </TouchableOpacity>
                <View style={{ marginStart: constants.vw(20) }}>
                    <Text style={[styles.artistName]}  >{artistName}</Text>
                </View>
            </View>
        </View >
    )
}

export const CollectionHeader = ({ onPressBack, onPressDelete }) => {
    return (
        <TouchableOpacity
            onPress={onPressBack}
            style={{ width: "10%" }}
            activeOpacity={1}
            hitSlop={{
                top: 10,
                left: 10,
                right: 10,
                bottom: 10
            }}
        >
            <FontAwesome
                name="chevron-left"
                size={20}
                color={constants.Colors.white}
            />
        </TouchableOpacity>
    )
}