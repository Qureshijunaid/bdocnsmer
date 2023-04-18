import React, { useState } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    ImageBackground,
    Animated
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

import constants from '../../constants';
import { styles } from './styles';
import Icon from 'react-native-vector-icons/AntDesign';
import { PrimaryButton } from '../buttons';
import { vh, vw } from '../../constants/Dimension';

export const BandoUseForCard = ({
    title,
    isSelected,
    onPress
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={styles.BandoUseForCardContainer}
        >
            <Text style={styles.text16bold}>{title}</Text>
            <View style={{
                height: 30,
                width: 30,
                backgroundColor: isSelected ? constants.Colors.color_FF3062 : constants.Colors.transparent,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: !isSelected ? constants.Colors.rgba_255_255_255_3 : constants.Colors.transparent
            }}>
                {
                    isSelected ?
                        <Feather
                            name="check"
                            size={20}
                            color={constants.Colors.white}
                        />
                        :
                        null
                }

            </View>
        </TouchableOpacity>
    )
}

export const PasswordRegexMatch = ({
    isMatched,
    title
}) => {
    return (
        <View style={styles.PasswordRegexMatchContainer}>
            <Feather
                name="check"
                size={20}
                color={isMatched ? constants.Colors.color_17B933 : constants.Colors.color_4E4E4E}
            />
            <Text style={[styles.text14500, {
                color: isMatched ? constants.Colors.color_17B933 : constants.Colors.color_4E4E4E,
                marginStart: constants.vw(10)
            }]}>{title}</Text>
        </View>
    )
}

export const BottomSheet = ({
    onPress,
    title,
    iconName,
    backgroundColor,
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderBottomWidth,
    borderBottomColor,
    textColor
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={{
                paddingVertical: constants.vh(15),
                justifyContent: "center",
                alignItems: 'center',
                flexDirection: "row",
                backgroundColor: backgroundColor ? backgroundColor : "#fff",
                borderRadius: borderRadius ? borderRadius : 0,
                borderTopLeftRadius: borderTopLeftRadius ? borderTopLeftRadius : 0,
                borderTopRightRadius: borderTopRightRadius ? borderTopRightRadius : 0,
                borderBottomLeftRadius: borderBottomLeftRadius ? borderBottomLeftRadius : 0,
                borderBottomRightRadius: borderBottomRightRadius ? borderBottomRightRadius : 0,
                borderBottomWidth: borderBottomWidth ? borderBottomWidth : 0,
                borderBottomColor: borderBottomColor ? borderBottomColor : "#fff",

            }}
            onPress={onPress}
        >
            <FontAwesome
                name={iconName}
                size={30}
                color={constants.Colors.color_FF3062}
            />
            <Text style={{
                fontSize: 18,
                fontWeight: "bold",
                fontFamily: constants.Fonts.K2D_Regular,
                color: textColor ? textColor : "#000",
                textAlign: "center"
            }}>  {title}</Text>
        </TouchableOpacity>
    )
}

export const PriceBandCard = ({
    title,
    amount
}) => {
    return (
        <View style={styles.priceBandCardContainer}>
            <Text style={[
                styles.text14500,
                {
                    color: constants.Colors.color_B9B9B9
                }]}>{title}</Text>
            <View style={styles.poundAmountContainer}>
                <Image
                    source={constants.Images.Pound}
                />
                <Text style={styles.text16bold}>{' '}{amount}</Text>
            </View>

        </View>
    )
}

export const PostCard = ({
    onPress,
    Icon,
    title,
    image,
    height
}) => {
    return (
        <TouchableOpacity
            style={[styles.postCardContainer, {
                height:
                    height ? height : constants.vh(180),

                width: '100%'

            }]}
            activeOpacity={1}
            onPress={onPress}
        >
            {
                image ?
                    <Image
                        source={{ uri: image }}
                        style={{
                            width: "100%",
                            height:
                                height ? height : constants.vh(180),
                            borderRadius: 10,
                        }}
                        resizeMode={"contain"}
                    />
                    :
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        {Icon && Icon()}
                        <Text style={styles.text16normal}>{'  '}{title}</Text>
                    </View>
            }

        </TouchableOpacity>
    )
}

export const DropdownCard = ({
    title,
    onPress,
    paddingVertical
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={1}
            style={[styles.dropdownCardContainer, {
                paddingVertical: paddingVertical ? paddingVertical : constants.vh(17),
            }]}>
            <Text style={{ ...styles.text16normal, color: 'white' }}>{title}</Text>
            <AntDesign
                name="down"
                size={20}
                color={constants.Colors.color_B9B9B9}
            />
        </TouchableOpacity>
    )
}

export const MerchTypeCard = ({
    onPress,
    title,
    isSelected
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={styles.merchandiseCardContainer}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}
            >

                <View style={styles.merchandiseTextContainer}>
                    <Text style={styles.text16bold}>{title}</Text>
                </View>

            </View>
            <View style={{
                height: 30,
                width: 30,
                backgroundColor: isSelected ? constants.Colors.color_FF3062 : constants.Colors.transparent,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: !isSelected ? constants.Colors.rgba_255_255_255_3 : constants.Colors.transparent
            }}>
                {
                    isSelected ?
                        <Feather
                            name="check"
                            size={20}
                            color={constants.Colors.white}
                        />
                        :
                        null
                }

            </View>

        </TouchableOpacity>
    )
}

export const MerchandiseCard = ({
    title,
    isSelected,
    onPress,
    image,
    price
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={styles.merchandiseCardContainer}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center"
                }}
            >
                <Image
                    source={image}
                    style={styles.merchandiseImage}
                />
                <View style={styles.merchandiseTextContainer}>
                    <Text style={styles.text16bold}>{title}</Text>
                    <Text style={styles.text14normal}>£ {price}</Text>
                </View>

            </View>

            <View style={{
                height: 30,
                width: 30,
                backgroundColor: isSelected ? constants.Colors.color_FF3062 : constants.Colors.transparent,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: !isSelected ? constants.Colors.rgba_255_255_255_3 : constants.Colors.transparent
            }}>
                {
                    isSelected ?
                        <Feather
                            name="check"
                            size={20}
                            color={constants.Colors.white}
                        />
                        :
                        null
                }

            </View>
        </TouchableOpacity>
    )
}

export const CountCard = ({
    count
}) => {
    return (
        <View style={styles.countCardContainer}>
            <Text style={styles.text11bold}>{count}</Text>
        </View>
    )
}

export const GenreCard = ({
    genreName,
    isSelected,
    onPress,
    image
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <View
                style={{
                    width: constants.vw(96),
                    height: constants.vw(96),
                    borderRadius: constants.vw(48)
                }}
            >
                <FastImage
                    source={!image.match(constants.AppConstant.URL_SOCIAL) ?
                        constants.Images.welcome1 :
                        { uri: image, priority: FastImage.priority.high }
                    }
                    style={{
                        width: constants.vw(96),
                        height: constants.vw(96),
                        borderRadius: constants.vw(48)
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
                {isSelected &&
                    <View
                        style={{
                            width: constants.vw(28),
                            height: constants.vw(28),
                            borderRadius: constants.vw(14),
                            backgroundColor: constants.Colors.color_FF3062,
                            justifyContent: "center",
                            alignItems: "center",
                            position: "absolute",
                            top: constants.vw(35),
                            left: constants.vw(35),
                        }}
                    >
                        <Feather
                            name="check"
                            color={constants.Colors.white}
                            size={20}
                        />
                    </View>
                }

                <Text style={{
                    marginTop: constants.vh(10),
                    fontSize: 16,
                    fontWeight: "500",
                    textAlign: "center",
                    color: isSelected ? constants.Colors.color_FF3062 : constants.Colors.white
                }}>{genreName}</Text>
            </View>
        </TouchableOpacity>
    )
}

export const GenreCardReactangle = ({
    genreName,
    isSelected,
    onPress,
    image
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <View
                style={{
                    width: "100%",
                    height: constants.vw(96),
                    //borderRadius: constants.vw(48)
                }}
            >
                <FastImage
                    source={!image.match(constants.AppConstant.URL_SOCIAL) ?
                        constants.Images.welcome1 : { uri: image, priority: FastImage.priority.high }}
                    style={{
                        width: "100%",
                        height: constants.vw(96),
                        borderRadius: constants.vw(20)
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    onLoadStart={() => { }}
                    onProgress={(e) => { }}
                    onLoad={(e) => { }}
                />

                <Text style={{
                    //marginTop: constants.vh(10),
                    position: 'absolute',
                    top: constants.vh(20),
                    left: constants.vh(10),
                    fontSize: 16,
                    fontWeight: "500",
                    textAlign: "center",
                    color: isSelected ? constants.Colors.color_FF3062 : constants.Colors.white
                }}>{genreName}</Text>
            </View>
        </TouchableOpacity>
    )
}
export const CommentCard = ({
    profileImage,
    comment,
    onPressDelete,
    date,
    replyCount,
    isReply,
    onPressShowReply,
    showDelete,
    commentorName
}) => {
    if (replyCount > 9) {
        replyCount = `9+`
    } else {
        replyCount = replyCount
    }
    return (
        <TouchableOpacity
            onPress={onPressShowReply}
            activeOpacity={1}
            style={styles.commentCardContainer}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={onPressShowReply}
            >
                <Image
                    source={{ uri: profileImage }}
                    style={{
                        width: constants.vw(55),
                        height: constants.vw(55),
                        borderRadius: 10
                    }}
                />
                {
                    isReply &&
                    <View
                        style={{
                            position: "absolute",
                            bottom: constants.vh(40),
                            left: constants.vw(35),
                            width: constants.vw(25),
                            height: constants.vw(25),
                            borderRadius: constants.vw(25 / 2),
                            backgroundColor: constants.Colors.color_FF3062,
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Text style={{
                            fontSize: 11,
                            color: constants.Colors.white,
                            fontFamily: constants.Fonts.SF_ProText
                        }}>{replyCount}</Text>
                    </View>
                }
            </TouchableOpacity>
            <View
                style={{
                    width: "65%",
                    marginStart: constants.vw(20)
                }}
            >
                <Text
                    numberOfLines={1}
                    style={{
                        fontSize: 12,
                        color: "#fff",
                        fontFamily: constants.Fonts.K2D_Regular
                    }}
                >{commentorName}</Text>
                <Text
                    numberOfLines={1}
                    style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#fff",
                        fontFamily: constants.Fonts.K2D_Regular,
                        marginVertical: 1
                    }}>{comment}</Text>
                <Text
                    style={{
                        fontSize: 11,
                        color: "#B9B9B9",
                        fontFamily: constants.Fonts.K2D_Regular
                    }}
                >{date}</Text>
            </View>
            {
                showDelete &&
                <TouchableOpacity
                    hitSlop={styles.hitSlop}
                    activeOpacity={1}
                    onPress={onPressDelete}
                    style={{
                        width: "15%",
                        alignItems: "flex-end",
                    }}
                >
                    <MaterialCommunityIcons
                        name="delete-outline"
                        size={30}
                        color={constants.Colors.color_636363}
                    />

                </TouchableOpacity>
            }
        </TouchableOpacity>
    )
}

export const ReplyCard = ({
    reply,
    profileImage,
    time,
    backgroundColor,
    textColor,
    textAlign,
    alignContent,
    onLongPress
}) => {
    return (
        <TouchableOpacity
            style={{
                width: "100%",
                alignItems: alignContent
            }}
            activeOpacity={1}
            onLongPress={onLongPress}
        >
            <View
            // activeOpacity={1}
            >
                <View
                    activeOpacity={1}
                    style={{
                        flexDirection: "row",
                        justifyContent: alignContent,
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    {profileImage &&
                        <Image
                            source={{ uri: profileImage }}
                            style={{
                                width: constants.vw(25),
                                height: constants.vw(25),
                                borderRadius: constants.vw(25 / 2),
                            }}
                        />
                    }

                    <View style={{
                        padding: constants.vw(22),
                        borderRadius: 20,
                        backgroundColor: backgroundColor,
                        marginStart: constants.vw(8)

                    }}>
                        <Text style={{
                            fontSize: 16,
                            fontFamily: constants.Fonts.K2D_Regular,
                            color: textColor,
                        }}>{reply}</Text>
                    </View>

                </View>

                <View
                    style={{
                        marginTop: constants.vh(6),
                        marginBottom: constants.vh(13),
                        marginStart: constants.vw(33)
                    }}
                >
                    <Text
                        style={{
                            fontSize: 12,
                            fontFamily: constants.Fonts.K2D_Regular,
                            color: constants.Colors.color_B9B9B9,
                            textAlign: textAlign
                        }}
                    >{time}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export const ArtistDetailProfile = ({
    title,
    onPressShare,
    artistName,
    onPressBackIcon,
    coverImage,
    profileImage,
    onPressProfileImage,
    onPressLike,
    onPressComment,
    isLiked,
    likeCount,
    commentCount,
    isSubscribe,
    resizeMode,
    profilePicMarginTop,
    multipleClickShareDisabledProfile
}) => {
    return (
        <View style={styles.artistDetailProfileContainer}>
            <FastImage
                //source={constants.Images.ArtistCover}
                source={coverImage ? { uri: coverImage, priority: FastImage.priority.high } : constants.Images.ArtistCover}
                style={{
                    // height: Platform.OS === "ios" ? constants.vh(360) : constants.vh(320),
                    // width: "100%",
                    width: "100%",
                    height: "100%",
                    borderBottomLeftRadius: constants.vw(15),
                    borderBottomRightRadius: constants.vw(15),
                }}
                resizeMode={resizeMode ? resizeMode : "contain"}
                onLoadStart={() => { }}
                onProgress={(e) => { }}
                onLoad={(e) => { }}
            />
            <View style={{
                position: "absolute",
                //top: Platform.OS === "ios" ? constants.vh(44) : constants.vh(0),
                width: "100%",
                height: "100%",
                //paddingHorizontal: 20,
                backgroundColor: "rgba(0,0,0,0.3)"
            }}>
                <View style={{
                    //position: "absolute",
                    marginTop: Platform.OS === "ios" ? constants.vh(44) : constants.vh(0),
                    width: "100%",
                    paddingHorizontal: 20,

                }}>
                    <TouchableOpacity
                        onPress={onPressBackIcon}
                        hitSlop={styles.hitSlop}
                        activeOpacity={1}
                        style={[styles.backArrowContainer, { zIndex: 100, width: constants.vw(150), }]}>
                        <View>
                            <FontAwesome
                                name="chevron-left"
                                size={20}
                                color={constants.Colors.white}
                            />
                        </View>

                        <View style={{ marginStart: constants.vw(14) }}>
                            <Text style={styles.text14bold}>{title}</Text>
                        </View>
                    </TouchableOpacity>

                    <Animated.View style={[styles.profileDataArtistDetailsContainer, {
                        marginTop: profilePicMarginTop ? profilePicMarginTop : constants.vh(155)
                    }]}>
                        <View style={{ width: '80%' }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={onPressProfileImage}
                            >
                                <FastImage
                                    source={{ uri: profileImage }}
                                    style={styles.profileDataImage}
                                    priority={FastImage.priority.high}
                                    resizeMode={FastImage.resizeMode.cover}
                                    onLoadStart={() => { }}
                                    onProgress={(e) => { }}
                                    onLoad={(e) => { }}
                                />
                            </TouchableOpacity>
                            <View>
                                <Text style={{
                                    ...styles.text30800,
                                    //textTransform: 'capitalize' 
                                }} numberOfLines={2}>{artistName}</Text>
                            </View>
                        </View>



                        <View style={styles.buttonsContainer}>


                            <TouchableOpacity style={styles.commentContainer}
                                onPress={onPressShare}
                                activeOpacity={1}
                                hitSlop={{
                                    top: 10,
                                    left: 10,
                                    right: 10,
                                    bottom: 10
                                }}
                                disabled={multipleClickShareDisabledProfile ? multipleClickShareDisabledProfile : false}
                            >
                                <FastImage
                                    source={constants.Images.ShareIcon}
                                    style={{
                                        width: constants.vw(20),
                                        height: constants.vw(20)
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                                {/* <Fontisto
                                    //  onPress={onPressShare}
                                    name="share-a"
                                    size={constants.vw(15)}
                                    color={constants.Colors.white}
                                /> */}
                                <Text style={{
                                    fontSize: 12,
                                    fontFamily: constants.Fonts.K2D_Regular,
                                    fontWeight: "600",
                                    color: constants.Colors.white,
                                    marginTop: 5
                                }}>Share</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </View>
        </View>
    )
}

export const MerchandiseArtistDetailCard = ({
    onPress,
    title,
    image,
    price,
    isSubscribe
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={styles.merchandiseArtistDetailCardContainer}
        >
            {/* <Image
                source={{ uri: image }}
                style={styles.merchandiseImageArtistDetails}
            /> */}
            <FastImage
                style={styles.merchandiseImageArtistDetails}
                source={{
                    uri: image,
                    priority: FastImage.priority.high
                }}
                resizeMode={FastImage.resizeMode.cover}
                onLoadStart={() => { }}
                onProgress={(e) => { }}
                onLoad={(e) => { }}
            />
            <View style={{ marginTop: constants.vw(10), width: constants.vw(120) }}>
                <Text numberOfLines={1} style={[styles.text10bold]}>{title}</Text>
            </View>
            <View style={{ marginTop: constants.vh(5), flexDirection: "row" }}>
                <Text style={[styles.text14500, { color: constants.Colors.color_B0B0B0 }]}>£ {price}</Text>
                {isSubscribe === false &&
                    <View style={styles.lockContainer}>
                        <Fontisto
                            // onPress={onPressShare}
                            name="locked"
                            size={constants.vw(10)}
                            color={constants.Colors.white}
                        />
                    </View>}
            </View>
        </TouchableOpacity>
    )
}

export const VideoCardArtistDetails = ({
    onPress,
    image,
    title,
    duration,
    isSubscribe
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={styles.videoCardArtistDetailsContainer}
        >
            <FastImage
                source={{ uri: image, priority: FastImage.priority.high }}
                style={styles.merchandiseImageArtistDetails}
                resizeMode={FastImage.resizeMode.cover}
                onLoadStart={() => { }}
                onProgress={(e) => { }}
                onLoad={(e) => { }}
            />
            <View
                style={{
                    position: "absolute",
                    top: constants.vh(48),
                    left: constants.vw(48),
                    backgroundColor: constants.Colors.black,
                    borderRadius: 100
                }}
            >
                <AntDesign
                    name="playcircleo"
                    size={30}
                    color={constants.Colors.white}
                />
            </View>
            <View style={{ marginTop: constants.vw(10), width: constants.vw(120) }}>
                <Text numberOfLines={1} style={[styles.text10bold]}>{title}</Text>
            </View>
            <View style={{ marginTop: constants.vh(5), flexDirection: "row" }}>
                <Text style={[styles.text14500, { color: constants.Colors.color_B0B0B0 }]}>{duration}</Text>
                {isSubscribe === false &&
                    <View style={styles.lockContainer}>
                        <Fontisto
                            // onPress={onPressShare}
                            name="locked"
                            size={constants.vw(10)}
                            color={constants.Colors.white}
                        />
                    </View>}
            </View>
        </TouchableOpacity>
    )
}

export const PhotoCardArtistDetails = ({
    onPress,
    image,
    title,
    duration,
    blurRadius,
    isSubscribe
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={styles.videoCardArtistDetailsContainer}
        >
            {
                blurRadius === 10 ?
                    <Image
                        source={{
                            uri: image,
                        }}
                        style={styles.merchandiseImageArtistDetails}
                        blurRadius={blurRadius ? blurRadius : 0}
                    />
                    :
                    <FastImage
                        source={{
                            uri: image,
                            priority: FastImage.priority.high
                        }}
                        style={styles.merchandiseImageArtistDetails}
                        resizeMode={FastImage.resizeMode.cover}
                        onLoadStart={() => { }}
                        onProgress={(e) => { }}
                        onLoad={(e) => { }}

                    />
            }
            <View style={{ marginTop: constants.vw(10), width: constants.vw(120) }}>
                <Text numberOfLines={1} style={[styles.text10bold]}>{title}</Text>
            </View>
            <View style={{ marginTop: constants.vh(5), flexDirection: "row" }}>
                <Text style={[styles.text14500, { color: constants.Colors.color_B0B0B0 }]}>{duration}</Text>
                {isSubscribe === false &&
                    <View style={styles.lockContainer}>
                        <Fontisto
                            // onPress={onPressShare}
                            name="locked"
                            size={constants.vw(10)}
                            color={constants.Colors.white}
                        />
                    </View>}

            </View>
        </TouchableOpacity>
    )
}

export const CollectionArtistDetails = ({
    onPress,
    image,
    title,
    duration,
    postCount,
    isSubscribe
}) => {
    return (
        <>
            <TouchableOpacity
                activeOpacity={1}
                onPress={onPress}
                style={styles.videoCardArtistDetailsContainer}
            >
                <FastImage
                    source={image ? { uri: image, priority: FastImage.priority.high } : constants.Images.ArtistCover}
                    style={styles.merchandiseImageArtistDetails}
                    resizeMode={FastImage.resizeMode.cover}
                />
                <View style={{ marginTop: constants.vh(10), width: vw(120) }}>
                    <Text style={[styles.text10bold]} numberOfLines={1}>{title}</Text>
                </View>
                <View style={{ marginTop: constants.vh(10) }}>
                    <Text style={[styles.text14500, { color: constants.Colors.color_B0B0B0 }]}>{duration}</Text>
                </View>

                <View style={{
                    position: "relative", bottom: vh(15),
                    flexDirection: "row",
                    width: vw(120),
                }}>
                    <Text style={[styles.text14500, {
                        color: constants.Colors.color_B0B0B0,

                    }]}>{postCount} {postCount < 2 ? "Item" : "Items"}</Text>
                    {isSubscribe === false &&
                        <View style={[styles.lockContainer]}>
                            <Fontisto
                                // onPress={onPressShare}
                                name="locked"
                                size={constants.vw(10)}
                                color={constants.Colors.white}
                            />
                        </View>}
                </View>
            </TouchableOpacity>

        </>
    )
}

export const AudioCardArtistDetail = ({
    onPress,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    image,
    title,
    subtitle,
    isSubscribe
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={[styles.audioCardArtistDetailContainer, {
                borderTopLeftRadius: borderTopLeftRadius ? borderTopLeftRadius : 0,
                borderTopRightRadius: borderTopRightRadius ? borderTopRightRadius : 0,
                borderBottomLeftRadius: borderBottomLeftRadius ? borderBottomLeftRadius : 0,
                borderBottomRightRadius: borderBottomRightRadius ? borderBottomRightRadius : 0
            }]}
        >
            <View>
                <FastImage
                    source={{ uri: image, priority: FastImage.priority.high }}
                    style={{
                        width: constants.vw(49),
                        height: constants.vh(49),
                        borderRadius: 10
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                    onLoadStart={() => { }}
                    onProgress={(e) => { }}
                    onLoad={(e) => { }}
                />
            </View>
            <View
                style={{
                    width: "78%",
                    marginStart: constants.vw(20),
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <View style={{ marginTop: constants.vw(10), width: constants.vw(120) }}>
                    <Text style={[styles.text14500, { color: constants.Colors.white }]} numberOfLines={1}>{title}</Text>
                    <Text numberOfLines={1} style={styles.text10bold}>{subtitle}</Text>
                </View>
                <View>
                    {isSubscribe ?
                        <Fontisto
                            name="play"
                            size={20}
                            color={constants.Colors.color_636363}
                        /> :
                        <View style={styles.lockContainer}>

                            <Fontisto
                                name="locked"
                                size={constants.vw(10)}
                                color={constants.Colors.white}
                            />
                        </View>}



                </View>
            </View>
        </TouchableOpacity>
    )
}

export const ImageListCard = ({
    onPress,
    image,
    title,
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={styles.imageListCardContainer}
        >
            <View style={styles.imageListContainer}>
                <FastImage
                    source={{ uri: image, priority: FastImage.priority.high }}
                    style={styles.imageListCard}
                    resizeMode={FastImage.resizeMode.cover}
                    onLoadStart={() => { }}
                    onProgress={(e) => { }}
                    onLoad={(e) => { }}
                />
            </View>
            {/* <TouchableOpacity
                onPress={onPressIcon}
                activeOpacity={1}
                hitSlop={styles.hitSlop}
                style={{
                    position: "absolute",
                    top: constants.vh(140),
                    left: constants.vw(115)
                }}>
                <Entypo
                    name="dots-three-horizontal"
                    size={30}
                    color={constants.Colors.white}
                />
            </TouchableOpacity> */}
            <View style={{ marginTop: constants.vw(10), width: constants.vw(133) }}>
                <Text numberOfLines={2} style={{ ...styles.text12bold }}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

export const VideoListCard = ({
    onPress,
    image,
    onPressIcon,
    duration,
    title,
    views
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={1}
            style={styles.videoListCardContainer}
        >
            <Image
                source={image}
                style={styles.videoListCardThumbNail}
                resizeMode={FastImage.resizeMode.cover}
                onLoadStart={() => { }}
                onProgress={(e) => { }}
                onLoad={(e) => { }}
            />
            <TouchableOpacity
                onPress={onPressIcon}
                activeOpacity={1}
                hitSlop={styles.hitSlop}
                style={{
                    position: "absolute",
                    bottom: constants.vh(40),
                    // left: constants.vw(290),
                    right: constants.vw(10)
                }}>
                {/* <Entypo
                    name="dots-three-horizontal"
                    size={30}
                    color={constants.Colors.white}
                /> */}
                <Image
                    source={
                        constants.Images.Play
                    }

                />
            </TouchableOpacity>
            <View style={styles.durationContainer}>
                <Text style={styles.text13500}>{duration}</Text>
            </View>
            <View style={{ marginTop: 5 }}>
                <Text style={[styles.text18700, { color: constants.Colors.white }]}>{title}</Text>
            </View>
            {/* <View style={{}}>
                <Text style={[styles.text12bold, { color: "#A3A3A3" }]}>{views}</Text>
            </View> */}
        </TouchableOpacity>
    )
}

export const AudioListCard = ({
    onPress,
    image,
    title,
    genre
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={styles.audioListCardContainer}
        >
            <View>
                <FastImage
                    source={image}
                    style={{
                        width: constants.vw(49),
                        height: constants.vw(49),
                        borderRadius: 10,
                    }}
                    priority={FastImage.priority.high}
                    resizeMode={FastImage.resizeMode.cover}
                    onLoadStart={() => { }}
                    onProgress={(e) => { }}
                    onLoad={(e) => { }}
                />
            </View>
            <View style={{
                width: "65%",
            }}>
                <Text style={[styles.text14500, { color: constants.Colors.white }]}>{title}</Text>
                <Text style={[styles.text10bold, { color: constants.Colors.color_B9B9B9, }]}>{genre}</Text>
            </View>
            <TouchableOpacity>
                <AntDesign
                    name="right"
                    color={constants.Colors.white}
                    size={20}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

export const SubscriptionCard = ({
    showDivider,
    showTitle,
    showTitleCount,
    showSubTitle,
    backgroundColor,
    textAlign,
    titleCount,
    subTitleCount,
    title,
    subTitle,
    fontSize,
    paddingVertical,
    borderRadius,
    onPress,
    titleTextColor
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={[styles.subscriptionCardContainer, {
                backgroundColor: backgroundColor ? backgroundColor : constants.Colors.color_FF3062,
                paddingVertical: paddingVertical ? paddingVertical : constants.vh(22),
                borderRadius: borderRadius ? borderRadius : 16,
            }]}>
            {
                showTitle &&
                <View>
                    <Text style={[styles.text16bold, {
                        textAlign: textAlign ? textAlign : "center",
                        color: titleTextColor ? titleTextColor : "#fff"
                    }]}>{title}</Text>
                    {
                        showTitleCount &&
                        <Text style={[styles.text35bold, {
                            textAlign: textAlign ? textAlign : "center",
                            fontSize: fontSize ? fontSize : 30
                        }]}>{titleCount}</Text>
                    }

                </View>
            }


            {
                showDivider &&
                <View style={styles.divider} />
            }
            {
                showSubTitle &&
                <View style={styles.revenueContainer}>
                    <Text style={styles.text12bold}>{subTitle}</Text>
                    <Text style={styles.text16bold}>{subTitleCount}</Text>
                </View>
            }
        </TouchableOpacity>
    )
}

export const MerchandiseListCard = ({
    onPress,
    image,
    title,
    price,
    isSold
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={styles.merchandiseListCardContainer}
            onPress={onPress}
        >

            <FastImage
                style={{
                    width: constants.vw(130),
                    height: constants.vw(130),
                    borderRadius: constants.vw(10),
                    // resizeMode: "stretch",
                    alignSelf: "center"
                }}
                source={{
                    uri: image,
                    // headers: { Authorization: 'someAuthToken' },
                    priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
            <Text
                numberOfLines={1}
                style={[styles.text16bold, {
                    marginTop: constants.vh(14), marginStart: constants.vw(14),
                    // textTransform: 'capitalize',
                    width: "60%"
                }]}>{title}</Text>
            <View style={styles.buyNowMerchContainer}>
                <Text style={[styles.text40011]}>{price}</Text>
                {isSold ?

                    <TouchableOpacity style={[styles.buyNowContainer, { backgroundColor: constants.Colors.color_FF005C }]}
                        onPress={onPress}
                        activeOpacity={1}
                    >
                        <Text style={[styles.text40011]}>{constants.ConstStrings.soldOut}</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.buyNowContainer}
                        onPress={onPress}
                        activeOpacity={1}
                    >
                        <Text style={[styles.text40011]}>{constants.ConstStrings.buyNow}</Text>
                    </TouchableOpacity>
                }


            </View>
        </TouchableOpacity>
    )
}

export const MerchAnalyticsCard = ({
    onPress,
    backgroundColor,
    title,
    subtitle
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={{
                paddingHorizontal: constants.vw(18),
                paddingVertical: constants.vw(20),
                backgroundColor: backgroundColor,
                borderRadius: 10
            }}
        >
            <Text style={{
                fontSize: 18,
                fontWeight: "bold",
                fontFamily: constants.Fonts.K2D_Regular,
                color: constants.Colors.white
            }}>{title}</Text>
            <Text style={{
                fontSize: 14,
                fontWeight: "600",
                fontFamily: constants.Fonts.K2D_Regular,
                color: constants.Colors.white,
                marginTop: 5
            }}>{subtitle}</Text>
        </TouchableOpacity>
    )
}

export const NotificationCard = ({
    onPress,
    title,
    subtitle,
    date,
    image
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={styles.notificationCardContainer}
        >
            <FastImage
                source={image}
                style={{
                    width: constants.vw(49),
                    height: constants.vw(49),
                    borderRadius: 10
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
            <View style={{
                //marginStart: constants.vw(15),
                width: "70%"
            }}>
                <Text numberOfLines={2} style={{
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: "600",
                    fontFamily: constants.Fonts.K2D_Regular
                }}>{title}{title ? " " : ""}<Text style={{
                    color: constants.Colors.color_FF3062,
                    fontSize: 14,
                    fontWeight: "600",
                    fontFamily: constants.Fonts.K2D_Regular
                }}>{subtitle}</Text>
                </Text>
                <Text style={[styles.text11bold, {
                    color: constants.Colors.color_B9B9B9,
                    marginTop: 4
                }]}>{date}</Text>
            </View>

            <AntDesign
                name="right"
                size={25}
                color={constants.Colors.color_B9B9B9}
            />
        </TouchableOpacity>
    )
}


// ************************************NEW*****************************

export const NonSubscribedArtistCard = ({
    onPress,
    artistName,
    onPressShare,
    coverImage,
    profileImage,
    multipleClickDisabled,
    multipleClickShareDisabled
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            disabled={multipleClickDisabled ? multipleClickDisabled : false}
            style={{ width: "100%" }}
        >
            <FastImage
                source={coverImage}
                style={{
                    width: "100%",
                    height: constants.vh(361),
                    borderRadius: constants.vw(15),
                }}
                priority={FastImage.priority.high}
                resizeMode={FastImage.resizeMode.cover}
                onLoadStart={() => { }}
                onProgress={(e) => { }}
                onLoad={(e) => { }}
            />

            <View
                style={{
                    paddingHorizontal: constants.vw(23),
                    paddingVertical: constants.vh(32),
                    position: "absolute",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    width: "100%",
                    borderRadius: constants.vw(15),
                    backgroundColor: "rgba(0,0,0,0.3)"
                }}
            >
                <View>
                    <Text style={styles.text14600}>Artist</Text>
                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: constants.vh(6)
                    }}>
                        <FastImage
                            source={profileImage}
                            style={{
                                width: constants.vw(33),
                                height: constants.vw(33),
                                borderRadius: constants.vw(17)
                            }}
                            priority={FastImage.priority.high}
                            resizeMode={FastImage.resizeMode.cover}
                            onLoadStart={() => { }}
                            onProgress={(e) => { }}
                            onLoad={(e) => { }}
                        />
                        <View style={{
                            marginStart: 10,
                            width: constants.vw(200),
                        }}>
                            <Text numberOfLines={1} style={{
                                ...styles.text30800,
                                // textTransform: 'capitalize'
                            }}>{artistName}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={{
                    //marginStart: constants.vw(245)
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                }}
                    activeOpacity={1}
                    onPress={onPressShare}
                    disabled={multipleClickShareDisabled ? multipleClickShareDisabled : false}
                >
                    <FastImage
                        source={constants.Images.ShareIcon}
                        style={{
                            width: constants.vw(20),
                            height: constants.vw(20)
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                    {/* <Fontisto
                        // onPress={onPressShare}
                        name="share-a"
                        size={constants.vw(15)}
                        color={constants.Colors.white}
                    /> */}
                    <Text style={[styles.text14600, { marginTop: constants.vh(6), fontSize: 12, fontWeight: "600" }]}>Share</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

export const NoPostFound = ({
    title,
    subtitle,
    iconSize
}) => {
    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <MaterialIcons
                name="broken-image"
                size={iconSize ? iconSize : 80}
                color={constants.Colors.color_636363}
            />
            <Text style={[styles.text18700, { color: constants.Colors.color_636363 }]}>{title}</Text>

            <Text style={[styles.text16normal, { color: constants.Colors.color_636363 }]}>{subtitle}</Text>
        </View>
    )
}


export const NoPostFoundFeed = ({
    title,
    subtitle,
}) => {
    return (
        <View style={{ flex: 1, alignItems: "center", width: "100%" }}>
            <MaterialIcons
                name="broken-image"
                size={80}
                color={constants.Colors.color_636363}
            />

            <Text style={[styles.text18700, { color: constants.Colors.color_636363, textAlign: "center" }]}>{title}</Text>
        </View>
    )
}

export const NoChatFound = ({
    title,
    subtitle
}) => {
    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <Entypo
                name="chat"
                size={80}
                color={constants.Colors.color_636363}
            />
            <Text style={[styles.text18700, { color: constants.Colors.color_636363 }]}>{title}</Text>
            <Text style={[styles.text16normal, { color: constants.Colors.color_636363 }]}>{subtitle}</Text>
        </View>
    )
}

export const PaymentSubscriptionCard = ({
    title,
    subTitle,
    isSelected,
    onPress
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
            style={styles.PaymentSubscriptionCardContainer}
        >
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <Text style={styles.text23800}>{title}</Text>
                <Text style={[styles.text14600, {
                    position: "relative",
                    bottom: constants.vh(5),
                    marginStart: constants.vw(5)
                }]}>{subTitle}</Text>
            </View>
            <View style={{
                height: 30,
                width: 30,
                backgroundColor: isSelected ? constants.Colors.color_FF3062 : constants.Colors.transparent,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: !isSelected ? constants.Colors.rgba_255_255_255_3 : constants.Colors.transparent
            }}>
                {
                    isSelected ?
                        <Feather
                            name="check"
                            size={20}
                            color={constants.Colors.white}
                        />
                        :
                        null
                }

            </View>
        </TouchableOpacity>
    )
}

export const PaymentActiveSubscriptionCard = ({
    artistImage,
    artistName,
    onPressCancel,
    subscriptionPrice,
    subscriptionType,
    nextPayDate,
    subscribedSince
}) => {
    return (
        <View style={{
            padding: constants.vw(12),
            backgroundColor: constants.Colors.color_333333,
            borderRadius: 10
        }}>
            <View style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center"
            }}>
                <FastImage
                    source={artistImage}
                    style={{
                        width: constants.vw(33),
                        height: constants.vw(33),
                        borderRadius: constants.vw(33 / 2),
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "85%",
                    position: "absolute",
                    left: constants.vw(43),
                    bottom: constants.vw(10)
                }}>
                    <Text
                        numberOfLines={1}
                        style={[styles.text18bold, { textTransform: "capitalize", width: "60%" }]}>{artistName}</Text>
                    <View style={{
                        width: "35%"
                    }}>
                        <PrimaryButton
                            title="Active"
                            paddingVertical={3}
                        />
                    </View>
                </View>
            </View>

            <View style={{ marginTop: constants.vh(10) }}>
                <Text style={styles.text16bold}>{subscriptionPrice} - {subscriptionType}</Text>
            </View>
            <View style={{ marginTop: constants.vh(4) }}>
                <Text style={[styles.text16normal, { color: constants.Colors.white }]}>Next payment due {nextPayDate}</Text>
            </View>
            <View style={{ marginTop: constants.vh(4) }}>
                <Text style={[styles.text16normal, { color: constants.Colors.white }]}>Subscibed since {subscribedSince}</Text>
            </View>
            <TouchableOpacity
                onPress={onPressCancel}
                activeOpacity={1}
                style={{
                    alignSelf: "center",
                    marginTop: constants.vh(15),
                    paddingHorizontal: constants.vw(15),
                    paddingVertical: constants.vw(7),
                    backgroundColor: constants.Colors.color_FF3062,
                    borderRadius: 10
                }}>
                <Text style={styles.text16bold}>Cancel Subscription</Text>
            </TouchableOpacity>
        </View>
    )
}

export const PaymentCancelledSubscriptionCard = ({
    artistImage,
    artistName,
    subscriptionPrice,
    subscriptionType,
    subscriptionStartDate,
    subscriptionEndDate
}) => {
    return (
        <View style={{
            padding: constants.vw(12),
            backgroundColor: constants.Colors.color_333333,
            borderRadius: 10
        }}>
            <View style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center"
            }}>
                <Image
                    source={artistImage}
                    style={{
                        width: constants.vw(33),
                        height: constants.vw(33),
                        borderRadius: constants.vw(33 / 2),
                        resizeMode: "cover"
                    }}
                />
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "85%",
                    position: "absolute",
                    left: constants.vw(43),
                    bottom: constants.vw(10)
                }}>
                    <Text style={[styles.text18bold, { textTransform: "capitalize", width: "60%" }]}
                        numberOfLines={1}
                    >{artistName}</Text>
                    <View style={{
                        width: "35%"
                    }}>
                        <PrimaryButton
                            title="Cancelled"
                            paddingVertical={3}
                        />
                    </View>
                </View>
            </View>
            <View style={{ marginTop: constants.vh(10) }}>
                <Text style={styles.text16bold}>{subscriptionPrice} - {subscriptionType}</Text>
            </View>
            <View style={{ marginTop: constants.vh(10) }}>
                <Text style={[styles.text16normal, { color: constants.Colors.white }]}>Subscibed {subscriptionStartDate} - {subscriptionEndDate}</Text>
            </View>
        </View>
    )
}

export const PaymentPurchaseCard = ({
    artistName,
    productName,
    price
}) => {
    return (
        <View style={{
            padding: constants.vw(18),
            backgroundColor: constants.Colors.color_333333,
            borderRadius: 10
        }}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <Text style={[styles.text14600, { textTransform: "capitalize" }]}>{productName}</Text>
                <Text style={styles.text16bold}>{price}</Text>
            </View>
            <View
                style={{
                    marginTop: constants.vh(15)
                }}
            >
                <Text style={[styles.text14600, { textTransform: "capitalize" }]}>{artistName}</Text>
            </View>

        </View>
    )
}

export const PaymentCard = ({
    last4Digit,
    expiry,
    cardType,
    onPressDelete,
    showDelete,
    onPress
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={onPress}
        >
            <LinearGradient
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                colors={['#130C1B', "#3C1519"]}
                style={{
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                <ImageBackground
                    source={constants.Images.cardBackLogo}
                    style={{
                        width: constants.vw(200),
                        height: constants.vw(230),
                        alignSelf: "flex-end",
                    }}
                    resizeMode="cover"
                >

                </ImageBackground>
                <View style={styles.paymentCardContainer}>
                    <View style={[styles.paymentCardDetailsContainer]}>
                        <Text style={[styles.text18bold, { textTransform: "capitalize" }]}>{cardType}</Text>
                        {
                            showDelete &&
                            <AntDesign
                                onPress={onPressDelete}
                                name="delete"
                                size={30}
                                color={constants.Colors.white}
                            />
                        }

                    </View>
                    <Image
                        source={constants.Images.cardChip}
                        style={{
                            width: constants.vw(40),
                            height: constants.vh(30),
                            marginTop: constants.vh(30)
                        }}
                        resizeMode="contain"
                    />
                    <View style={[styles.paymentCardDetailsContainer]}>
                        <Text style={styles.text18bold}>XXXX</Text>
                        <Text style={styles.text18bold}>XXXX</Text>
                        <Text style={styles.text18bold}>XXXX</Text>
                        <Text style={styles.text18bold}>{last4Digit}</Text>
                    </View>
                    <View style={[{
                        marginTop: constants.vh(30),
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }]}>
                        <Image
                            source={constants.Images.cardLogo}
                            style={{
                                width: constants.vw(110),
                                height: constants.vh(70)
                            }}
                            resizeMode="contain"
                        />
                        <Text style={styles.text18bold}>{expiry}</Text>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    )
}

export const AlreadyChatArtistList = ({ artistImage, artistName,
    recentMessage, messageTime, onPress, isSearch
}) => {
    return (
        <TouchableOpacity
            style={styles.alreadyChatArtistListContainer}
            activeOpacity={1}
            onPress={onPress}
        >
            <View style={styles.chatContainer}>
                <View style={styles.imageMessageContainer}>
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
                <View style={styles.nameChatContainer}>
                    <Text style={[styles.text600normal, { textTransform: "capitalize" }]}>{artistName}</Text>
                    {isSearch &&
                        <View style={{ flexDirection: "row", width: "85%" }}>
                            <View style={{}}>
                                <Text style={styles.text10700} numberOfLines={1}>{recentMessage}</Text>
                            </View>
                            <Text style={styles.text10700} >- {messageTime}</Text>
                        </View>
                    }


                </View>


                <TouchableOpacity
                    activeOpacity={1}
                    onPress={onPress}
                    style={{ width: "10%" }}
                >
                    <AntDesign
                        name="right"
                        color={constants.Colors.white}
                        size={20}
                    />
                </TouchableOpacity>

            </View>
        </TouchableOpacity>
    )
}

export const BandoPlanCard = ({
    firstHeadLine, secondHeadLine, firstData, secondData, paddingHorizontal, paddingVertical, backgroundColor,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    fontHeadLine,
    fontSize,
    headerHeight,
    bodyHeight
}) => {
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={{
                height: "110%",
                backgroundColor: backgroundColor,
                paddingHorizontal: paddingHorizontal,
                paddingVertical: paddingVertical,
                borderRadius: 20,
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                borderTopLeftRadius: borderTopLeftRadius,
                borderTopRightRadius: borderTopRightRadius,
                borderBottomLeftRadius: borderBottomLeftRadius,
                borderBottomRightRadius: borderBottomRightRadius,
            }}
        >

            <View style={{
                height: headerHeight,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Text style={{
                    fontSize: fontHeadLine,
                    color: "white",
                    textAlign: 'center',
                    fontFamily: constants.Fonts.K2D_Bold
                }}>{firstHeadLine}</Text>
            </View>
            <View style={{
                height: bodyHeight,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={{
                    fontSize: fontSize,
                    color: "white",
                    textAlign: 'center',
                    fontFamily: constants.Fonts.K2D_Bold,
                    marginTop: "3%"
                }}>{firstData}</Text>
            </View>

        </TouchableOpacity>
    );
}

export const PostActionButton = ({
    onPressLikeUnlike,
    onPressComment,
    onPressShare,
    multipleClickShareDisabled,
    muted,
    onPressMuteUnmute,
    isLiked,
    showSpeaker,
    showFull,
    onPressFull
}) => {
    return (
        <View style={{
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            // width: "100%",
            //backgroundColor: "rgba(0,0,0,0.3)"
        }}>
            {
                showFull &&
                <TouchableOpacity
                    activeOpacity={1}
                    hitSlop={styles.hitSlop}
                    onPress={onPressFull}
                >
                    <MaterialIcons
                        name="fullscreen"
                        size={constants.vw(30)}
                        color={constants.Colors.white}
                    />
                </TouchableOpacity>
            }
            <TouchableOpacity
                style={{
                    marginTop: showFull ? constants.vh(15) : 0
                }}
                activeOpacity={1}
                hitSlop={styles.hitSlop}
                onPress={onPressShare}
                disabled={multipleClickShareDisabled ? multipleClickShareDisabled : false}
            >
                <FastImage
                    source={constants.Images.ShareIcon}
                    style={{
                        width: constants.vw(25),
                        height: constants.vw(25)
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
                {/* <Fontisto
                    name="share-a"
                    size={constants.vw(20)}
                    color={constants.Colors.white}
                /> */}
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    marginVertical: constants.vh(15)
                }}
                onPress={onPressComment}
                activeOpacity={1}
                hitSlop={styles.hitSlop}>
                <Image
                    source={constants.Images.MessageIcon}
                    resizeMode="contain"
                //style={styles.messageImage}
                />
            </TouchableOpacity>

            <TouchableOpacity
                activeOpacity={1}
                hitSlop={styles.hitSlop}
                onPress={onPressLikeUnlike}
            >
                <Image
                    source={isLiked ? constants.Images.Liked : constants.Images.Unliked}
                    resizeMode="contain"
                />
            </TouchableOpacity>

            {
                showSpeaker &&
                <TouchableOpacity
                    hitSlop={styles.hitSlop}
                    onPress={onPressMuteUnmute}
                    activeOpacity={1}
                >
                    <MaterialCommunityIcons
                        name={muted ? "volume-off" : "volume-high"}
                        size={25}
                        color="white"
                    />
                </TouchableOpacity>
            }

        </View>
    )
}