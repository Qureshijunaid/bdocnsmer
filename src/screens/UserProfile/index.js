import React, { useEffect } from 'react';
import {
    StatusBar,
    SafeAreaView,
    View,
    Text,
    Image,
    ImageBackground,
    Dimensions,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Carousel from 'react-native-snap-carousel';
import * as NavigationService from '../../navigation/NavigationService';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import {
    setArtistID, getArtistDetail, getConsumerProfile

} from '../../actions/profile';
import constants from '../../constants';
import Components from '../../components';
import { styles } from './styles';

const WIDTH = Dimensions.get("window").width

const UserProfile = (props) => {
    const [state, setState] = React.useState({
        artistList: props.auth.userRegistered ? props.auth.userRegistered.artistDetails : [],
        // firstName: props.auth.userRegistered ? props.auth.userRegistered.firstName : '',
        // lastName: props.auth.userRegistered ? props.auth.userRegistered.lastName : '',
        // bio: props.auth.userRegistered ? props.auth.userRegistered.bio : '',
    })
    // useEffect(() => {
    //     const unsubscribe = props.navigation.addListener('focus', () => {
    //         props.dispatch(getConsumerProfile());
    //     });
    //     return () => {
    //         unsubscribe;
    //     }
    // }, [])

    const showArtistDetail = (data) => {
        state.multipleClickDisabled = true
        setState({
            ...state
        })
        if (state.multipleClickDisabled) {
            props.dispatch(setArtistID(data))
            props.dispatch(getArtistDetail("homeArtistDetail"))
        }

    }
    const renderArtist = ({ item, index }) => {
        return (
            <View style={styles.slide}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => showArtistDetail(item._id)}
                >
                    <FastImage
                        source={item.coverImage ? { uri: item.coverImage } : { uri: constants.AppConstant.bandoLogo }}
                        imageStyle={{ borderRadius: 10 }}
                        style={{
                            width: "100%",
                            height: constants.vh(255),
                            borderRadius: 10
                        }}
                        priority={FastImage.priority.high}
                        resizeMode={FastImage.resizeMode.cover}
                        onLoadStart={() => { }}
                        onProgress={(e) => { }}
                        onLoad={(e) => { }}
                    >
                        <View style={{
                            position: "absolute",
                            bottom: constants.vh(21),
                            paddingHorizontal: constants.vw(15)
                        }}>
                            <FastImage
                                //source={item.profileImage?{uri:item.profileImage}:{uri:constants.AppConstant.bandoLogo}}
                                source={item.profileImage ? { uri: item.profileImage } : { uri: constants.AppConstant.bandoLogo }}
                                style={{
                                    width: constants.vw(30),
                                    height: constants.vw(30),
                                    borderRadius: constants.vw(30 / 2)
                                }}
                                priority={FastImage.priority.high}
                                resizeMode={FastImage.resizeMode.cover}
                                onLoadStart={() => { }}
                                onProgress={(e) => { }}
                                onLoad={(e) => { }}
                            />
                            <View style={{
                                marginTop: constants.vh(10),
                            }}>
                                <Text style={styles.text30800} numberOflines={1}>{item.artistName ? item.artistName : item.firstName + " " + item.lastName}</Text>
                            </View>
                        </View>

                    </FastImage>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                <View style={styles.dataContainer}>
                    <View style={{
                        //paddingHorizontal: 20,
                        flex: 1
                    }}>
                        <View style={styles.headerContainer}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => props.navigation.goBack()}
                            // hitSlop={{
                            //     top: 5,
                            //     left: 5,
                            //     bottom: 5,
                            //     right: 5
                            // }}
                            // style={{ paddingHorizontal: 10 }}
                            >
                                <AntDesign
                                    name="arrowleft"
                                    size={30}
                                    color={constants.Colors.white}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => NavigationService.navigate(constants.ScreensName.Settings.name, null)}
                                hitSlop={{
                                    top: 5,
                                    left: 5,
                                    bottom: 5,
                                    right: 5
                                }}
                                style={{ backgroundColor: "rgba(0,0,0,0.1)", padding: 5, borderRadius: 50 }}
                            >

                                {/* <Image
                                    source={constants.Images.SettingIconProfile}
                                    resizeMode={"cover"}
                                /> */}

                                <Feather
                                    onPress={() => NavigationService.navigate(constants.ScreensName.Settings.name, null)}
                                    name="settings"
                                    size={25}
                                    color={constants.Colors.white}
                                />
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            style={{ paddingHorizontal: 10, marginTop: constants.vh(28) }}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}

                        >
                            <View style={styles.profileImageContainer}>
                                <ImageBackground
                                    source={constants.Images.ProfileCircle}
                                    style={{
                                        width: constants.vw(155),
                                        height: constants.vw(155),
                                        borderRadius: constants.vw(155 / 2),
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <FastImage
                                        source={props.auth.userRegistered.profileImage ? { uri: props.auth.userRegistered.profileImage } : { uri: constants.AppConstant.bandoLogo }}
                                        style={{
                                            width: constants.vw(132),
                                            height: constants.vw(132),
                                            borderRadius: constants.vw(132 / 2),
                                            //resizeMode: "cover"
                                        }}
                                        priority={FastImage.priority.high}
                                        resizeMode={FastImage.resizeMode.cover}
                                        onLoadStart={() => { }}
                                        onProgress={(e) => { }}
                                        onLoad={(e) => { }}
                                    />
                                </ImageBackground>
                            </View>

                            <View style={{
                                marginTop: constants.vh(12),
                                alignItems: "center",
                                alignSelf: 'center'
                            }}>
                                <Text style={{ ...styles.text28bold }}>{(props.auth.userRegistered ? props.auth.userRegistered.firstName : '') + " " + (props.auth.userRegistered ? props.auth.userRegistered.lastName : '')}</Text>
                            </View>
                            <View style={{
                                marginTop: constants.vh(18),
                                alignItems: "center",
                                marginHorizontal: constants.vw(10),
                                alignSelf: 'center',
                            }}>
                                <Text style={{ ...styles.text16normal }}>
                                    {props.auth.userRegistered ? props.auth.userRegistered.bio : ''}
                                </Text>
                            </View>

                            <View style={{
                                marginTop: constants.vh(20),
                                alignItems: "center"
                            }}>
                                <Text style={styles.text23bold}>Subscribed Artists</Text>
                            </View>

                            <View style={{
                                marginTop: constants.vh(18),
                                marginBottom: constants.vh(60),
                                alignItems: "center"
                            }}>
                                {state.artistList.length > 0 ?
                                    <>
                                        {/* <>
                                            {console.log("NavigationService", NavigationService.navigate)}</> */}
                                        <Carousel
                                            //ref={(c) => { this._carousel = c; }}
                                            data={state.artistList}
                                            renderItem={renderArtist}
                                            sliderWidth={WIDTH}
                                            itemWidth={WIDTH * 0.7}
                                        />
                                    </>
                                    :
                                    <View style={{ marginTop: constants.vh(40) }}>
                                        <Text style={styles.text16normal}>There is no subscribed artists to show.</Text>
                                    </View>
                                }
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}
function mapStateToProps(state) {
    const { newPost, auth } = state
    return {
        newPost, auth
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
)(UserProfile)

