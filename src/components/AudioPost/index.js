
import React from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';

import constants from '../../constants';
import { styles } from './styles';

export const AudioPost = ({
    title,
    time,
    backgroundImage,
    profileImage,
    firstName,
    lastName,
    isLiked,
    likeCount,
    commentCount,
    shareCount,
    description,
    onPressLike,
    onPressComment,
    onPressShare,
    musicTitle,
    playedTime,
    totalTime,
    onThreeDotPress,
    multipleClickShareDisabled,
    handleMuteUnmute,
    muted,
    onPressCard,
    onPressArtist,
    album,
    dontShowArtistName
}) => {
    if (playedTime > totalTime) {
        playedTime = totalTime
    }
    if (playedTime < 0) {
        playedTime = 0
    } const playedPercentage = (playedTime / totalTime) * 100;
    const unPlayedPercentage = 100 - playedPercentage;
    return (
        <TouchableOpacity
            activeOpacity={1}
            style={styles.container}
            onPress={onPressCard}
        >
            <FastImage
                source={{ uri: backgroundImage, priority: FastImage.priority.high }}
                style={styles.audioImage}
                resizeMode={FastImage.resizeMode.cover}
                onLoadStart={() => { }}
                onProgress={(e) => { }}
                onLoad={(e) => { }}
            />
            <LinearGradient
                //start={{x: 0.0, y: 0.25}} end={{x: 0.5, y: 1.0}}
                colors={[
                    "rgba(0,0,0,0)",
                    "rgba(0,0,0,0.2)",
                    "rgba(0,0,0,0.3)",
                ]}
                style={styles.dataContainer}
            >
                {
                    !dontShowArtistName
                        ?
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={onPressArtist}
                            style={{
                                // position: 'absolute',
                                marginTop: constants.vw(20),
                                // marginLeft: constants.vw(20)
                            }}>
                            {/* <Text style={styles.text14600}>Artist</Text> */}
                            <View style={{
                                flexDirection: "row",
                                //alignItems: "center",
                                marginTop: constants.vh(6)
                            }}>
                                <FastImage
                                    source={profileImage}
                                    style={{
                                        width: constants.vw(33),
                                        height: constants.vw(33),
                                        borderRadius: constants.vw(17)
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                    onLoadStart={() => { }}
                                    onProgress={(e) => { }}
                                    onLoad={(e) => { }}
                                />
                                <View style={{
                                    marginStart: 10,
                                    width: constants.vw(200),
                                }}>
                                    <Text style={styles.text30800}>{firstName}</Text>
                                    <Text style={styles.text30800}>{lastName}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{
                                // position: 'absolute',
                                marginTop: constants.vw(32),
                                // marginLeft: constants.vw(20)
                            }}>
                            <Text style={styles.text14600}></Text>
                            <View style={{
                                flexDirection: "row",
                                //alignItems: "center",
                                marginTop: constants.vh(6)
                            }}>
                                <View
                                    style={{
                                        width: constants.vw(33),
                                        height: constants.vw(33),
                                    }}
                                />
                                <View style={{
                                    marginStart: 10,
                                    width: constants.vw(200),
                                }}>
                                    <Text style={styles.text30800}></Text>
                                    <Text style={styles.text30800}></Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                }

                <View style={styles.secondryDataContainer}>
                    <View style={styles.descriptionContainer}>
                        <View style={{
                            alignSelf: "flex-start",
                            // flexDirection: "column",
                            // justifyContent: "flex-start",
                        }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",

                                }}
                            >
                                <Text style={styles.text10bold}>{time}</Text>
                                <View style={{
                                    marginStart: constants.vw(10),
                                }}>
                                    <Entypo
                                        onPress={onThreeDotPress}
                                        name="dots-three-horizontal"
                                        color="#fff"
                                        size={constants.vw(25)}
                                    />
                                </View>
                            </View>
                            {/* <View> */}
                            <Text numberOfLines={1} style={styles.text30800}>{album}</Text>
                            {/* </View>  */}
                            <Text numberOfLines={3} style={[styles.text14600]}>{description}</Text>
                        </View>
                        <View>
                            <View style={{
                                flexDirection: "row",
                                marginTop: 24,
                                alignItems: "center"
                            }}>
                                <FontAwesome
                                    name="music"
                                    size={20}
                                    color={constants.Colors.white}
                                />
                                <Text style={[styles.text16900, { marginStart: 9 }]}>{musicTitle}</Text>
                            </View>
                            <View
                                style={{
                                    width: "100%",
                                    height: 4,
                                    borderRadius: 20,
                                    backgroundColor: constants.Colors.rgba_255_255_255_3,
                                    marginTop: constants.vh(14),
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "center"
                                }}
                            >
                                <View
                                    style={{
                                        width: `${playedPercentage}%`,
                                        height: 4,
                                        borderTopLeftRadius: 20,
                                        borderBottomLeftRadius: 20,
                                        backgroundColor: constants.Colors.color_FF005C,
                                    }}
                                />
                                <View
                                    style={{
                                        width: `${unPlayedPercentage}%`,
                                        height: 4,
                                        backgroundColor: constants.Colors.rgba_255_255_255_3,
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            onPress={() => onPressLike()}
                            activeOpacity={0.5}
                            hitSlop={{
                                top: 5,
                                left: 10,
                                right: 10,
                                bottom: 5
                            }}
                            style={styles.likeButtonContainer}>
                            <Image
                                source={isLiked ? constants.Images.Liked : constants.Images.Unliked}
                                resizeMode="contain"
                            />
                            <Text style={[styles.text14600]}>{likeCount}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onPressComment}
                            activeOpacity={1}
                            hitSlop={{
                                top: 5,
                                left: 10,
                                right: 10,
                                bottom: 5
                            }}
                            style={styles.commentContainer}>
                            <FastImage
                                source={constants.Images.MessageIcon}
                                style={styles.messageImage}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                            <Text style={[styles.text14600]}>{commentCount}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.commentContainer}
                            hitSlop={{
                                top: 5,
                                left: 10,
                                right: 10,
                                bottom: 5
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
                                //  onPress={onPressShare}
                                name="share-a"
                                size={constants.vw(15)}
                                color={constants.Colors.white}
                            /> */}
                            <Text style={styles.text12600}>Share</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
            <TouchableOpacity
                onPress={handleMuteUnmute}
                hitSlop={{
                    top: 10,
                    left: 10,
                    right: 10,
                    bottom: 10
                }}
                activeOpacity={0.8}
                style={{
                    position: "absolute",
                    top: "10%",
                    right: "8%"
                }}
            >
                <MaterialCommunityIcons
                    name={muted ? "volume-off" : "volume-high"}
                    size={25}
                    color="white"
                />
            </TouchableOpacity>
        </TouchableOpacity >
    )
}