import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
    StatusBar,
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Platform
} from 'react-native';
import { connect } from 'react-redux';
import ReadMore from 'react-native-read-more-text';

import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import { AudioSlider } from '../../../components/AudioListSlider';
import * as NavigationService from '../../../navigation/NavigationService';
import { getArtistDetail } from '../../../actions/profile'

const ArtistDetails = (props) => {
    // useLayoutEffect(() => {
    //     props.dispatch(getArtistDetail())
    // }, [])

    const [state, setState] = React.useState({
        merchandiseArray: [
            { id: 1, image: constants.Images.welcome1, title: "Nile Rodgers T-shirt", price: 20.99 },
            { id: 2, image: constants.Images.InvestorImage4, title: "Blueprint Hoodie", price: 80.99 },
            { id: 3, image: constants.Images.InvestorImage6, title: "Nile Rodgers T-shirt", price: 20.99 },
        ],
        videoArray: [
            { id: 1, title: "Concert clip - London", time: "10 min", image: constants.Images.InvestorImage8 },
            { id: 2, title: "Thank you all my fans", time: "5 min", image: constants.Images.InvestorImage13 },
            { id: 3, title: "Masterjam", time: "35 min", image: constants.Images.InvestorImage3 },
            { id: 5, title: "Concert clip - London", time: "10 min", image: constants.Images.welcome2 },
        ],
        photoArray: [
            { id: 1, title: "USA Concert", image: constants.Images.InvestorImage2 },
            { id: 2, title: "Thank you all my fans", image: constants.Images.InvestorImage10 },
            { id: 3, title: "Masterjam", image: constants.Images.InvestorImage14 },
        ],
        audioArray: [
            [
                { id: 1, cover_image: constants.Images.InvestorImage5, title: "Birds Are Chirping", subtitle: "Track" },
                { id: 2, cover_image: constants.Images.InvestorImage14, title: "Cartier Rings", subtitle: "Album" },
                { id: 3, cover_image: constants.Images.InvestorImage1, title: "I'll be there", subtitle: "Album-Chick" },
                { id: 4, cover_image: constants.Images.InvestorImage11, title: "I'll be there", subtitle: "Album-Chick" },
            ],
            [
                { id: 5, cover_image: constants.Images.InvestorImage3, title: "I'll be there", subtitle: "Album-Chick" },
                { id: 6, cover_image: constants.Images.InvestorImage1, title: "Last Night in Marbella", subtitle: "Track" },
                { id: 7, cover_image: constants.Images.InvestorImage5, title: "I'll be there", subtitle: "Album-Chick" },
                { id: 8, cover_image: constants.Images.welcome1, title: "I'll be there", subtitle: "Album-Chick" },
            ],
            [
                { id: 9, cover_image: constants.Images.InvestorImage5, title: "I'll be there", subtitle: "Album-Chick" },
                { id: 10, cover_image: constants.Images.welcome1, title: "I'll be there", subtitle: "Album-Chick" },
                { id: 11, cover_image: constants.Images.InvestorImage1, title: "Last Night in Marbella", subtitle: "Track" },
                { id: 12, cover_image: constants.Images.InvestorImage3, title: "I'll be there", subtitle: "Album-Chick" },
            ],
            [
                { id: 13, cover_image: constants.Images.InvestorImage5, title: "I'll be there", subtitle: "Album-Chick" },
                { id: 14, cover_image: constants.Images.welcome1, title: "I'll be there", subtitle: "Album-Chick" },
                { id: 15, cover_image: constants.Images.InvestorImage3, title: "I'll be there", subtitle: "Album-Chick" },
                { id: 16, cover_image: constants.Images.InvestorImage1, title: "Last Night in Marbella", subtitle: "Track" },
            ],
        ],
        array1: [],
        array2: [],
        array3: [],
        array4: [],
        combinedArray: [],
        isSubscribe: true
    })

    useEffect(() => {
        setState({
            ...state,
            array1: [],
            array2: [],
            array3: [],
            array4: []
        })
        props.profile.artistDetail[3].audioDetails.map((item, index) => {
            if (index < 4) {
                state.array1 = [...state.array1, item]
                setState({
                    ...state
                })
            }
            if (index > 3 && index < 8) {
                state.array2 = [...state.array2, item]
                setState({
                    ...state
                })
            }
            if (index > 7 && index < 12) {
                state.array3 = [...state.array3, item]
                setState({
                    ...state
                })
            }
            if (index > 11 && index < 16) {
                state.array4 = [...state.array4, item]
                setState({
                    ...state
                })
            }
        })
        if (state.array1.length > 0) {
            state.combinedArray.push(state.array1)
            setState({
                ...state
            })
        }
        if (state.array2.length > 0) {
            state.combinedArray.push(state.array2)
            setState({
                ...state
            })
        }
        if (state.array3.length > 0) {
            state.combinedArray.push(state.array3)
            setState({
                ...state
            })
        }
        if (state.array4.length > 0) {
            state.combinedArray.push(state.array4)
            setState({
                ...state
            })
        }

    }, [])
    const renderTruncatedFooter = (handlePress) => {
        return (
            <Text style={{ color: "#fff", marginTop: 5 }} onPress={handlePress}>
                Read more
            </Text>
        );
    }

    const renderRevealedFooter = (handlePress) => {
        return (
            <Text style={{ color: "#fff", marginTop: 5 }} onPress={handlePress}>
                Show less
            </Text>
        );
    }

    const handleTextReady = () => {
        // ...
    }

    const renderMerchandise = ({ item, index }) => {
        return (
            <View style={{ marginHorizontal: constants.vw(15) }}>
                <Components.MerchandiseArtistDetailCard
                    title={item.merch_details.length > 0 && item.merch_details[0].merchName}
                    image={item.images[0]
                    }
                    price={
                        item.price_details[0].variations.length > 0 ? item.price_details[0].variations[0].price
                            : item.price_details[0].price}
                />
            </View>
        )
    }

    const renderVideo = ({ item, index }) => {
        if (index <= 10) {
            return (
                <View style={{ marginHorizontal: constants.vw(15) }}>
                    <Components.VideoCardArtistDetails
                        title={item.title}
                        image={"https://homepages.cae.wisc.edu/~ece533/images/airplane.png"}
                        duration={JSON.parse(item.media_duration)}
                    />
                </View>
            )
        }
    }

    const renderPhoto = ({ item, index }) => {
        if (index <= 10) {
            return (
                <View style={{ marginHorizontal: constants.vw(15) }}>
                    <Components.PhotoCardArtistDetails
                        title={item.title}
                        image={item.media_url}
                        duration={item.time}
                    />
                </View>
            )
        }
    }
    return (
        <>
            <StatusBar barStyle="light-content" />
            <View style={styles.container}>
                <Components.ArtistDetailProfile
                    title={"Artist"}
                    artistName={
                        props.profile.artistDetail != null ?

                            props.profile.artistDetail[0].artistDeatils.artistName === ""
                                ?
                                `${props.profile.artistDetail[0].artistDeatils.firstName} ${props.profile.artistDetail[0].artistDeatils.lastName}`
                                :
                                props.profile.artistDetail[0].artistDeatils.artistName
                            :
                            `${props.profile.artistDetail[0].artistDeatils.firstName} ${props.profile.artistDetail[0].artistDeatils.lastName}`

                    }
                    coverImage={props.profile?.artistDetail[0]?.artistDeatils?.coverImage ?
                        { uri: props.profile.artistDetail[0].artistDeatils.coverImage }
                        : null
                        // constants.Images.ArtistCover
                    }
                    profileImage={props.profile?.artistDetail[0]?.artistDeatils?.profileImage ?
                        props.profile.artistDetail[0].artistDeatils.profileImage : constants.AppConstant.bandoLogo}
                    onPressBackIcon={() => props.navigation.goBack()}
                    onPressShare={() => { }}
                    commentCount={20}
                    isLiked={true}
                    likeCount={10}
                    isSubscribe={state.isSubscribe}
                />
                <ScrollView style={[styles.dataContainer, { flex: 1 }]}>
                    <View style={styles.portionContainer}>
                        <Text style={styles.text20bold}>{constants.ConstStrings.bio}</Text>
                        {/* <View style={{
                            width: "30%"
                        }}>
                            <Components.PrimaryButton
                                onPress={() => NavigationService.navigate(constants.ScreensName.EditProfile.name, null)}
                                title="Edit Profile"
                                paddingVertical={5}
                                borderRadius={20}
                            />
                        </View> */}
                    </View>

                    <View style={styles.descriptionContainer}>
                        <ReadMore
                            numberOfLines={3}
                            renderTruncatedFooter={renderTruncatedFooter}
                            renderRevealedFooter={renderRevealedFooter}
                            onReady={handleTextReady}>
                            <Text style={styles.text16normal}>
                                {
                                    props.profile.artistDetail != null &&
                                    props.profile.artistDetail[0].artistDeatils.bio}

                            </Text>
                        </ReadMore>
                    </View>

                    {/* MERCHANDISE HERE */}
                    <View style={styles.merchandiseContainer}>
                        <View style={styles.portionContainer}>
                            <View style={styles.titleAndCountContainer}>
                                <Text style={styles.text18500}>{constants.ConstStrings.merchandise}</Text>
                                <View style={styles.countContainer}>
                                    <Components.PrimaryButton
                                        title={props.profile.artistDetail != null &&
                                            props.profile.artistDetail[1].merchDetails.length
                                        }
                                        paddingVertical={1}
                                        borderRadius={20}
                                    />
                                </View>
                            </View>
                            {state.isSubscribe &&
                                <TouchableOpacity
                                    hitSlop={styles.hitSlop}
                                    activeOpacity={1}
                                    onPress={() => NavigationService.navigate(constants.ScreensName.Merch.name, null)}
                                >
                                    <Text style={styles.text14500}>{constants.ConstStrings.viewAll}</Text>
                                </TouchableOpacity>
                            }

                        </View>
                    </View>
                    {props.profile.artistDetail != null && props.profile.artistDetail[1].merchDetails.length > 0 ?
                        <View style={styles.merchandiseContainer}>
                            <FlatList
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={
                                    props.profile.artistDetail[1].merchDetails}
                                renderItem={renderMerchandise}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        :
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>No Merchandise here</Text>
                        </View>
                    }



                    {/* AUDIO HERE */}
                    <View style={styles.merchandiseContainer}>
                        <View style={styles.portionContainer}>
                            <View style={styles.titleAndCountContainer}>
                                <Text style={styles.text18500}>{constants.ConstStrings.audio}</Text>
                                <View style={styles.countContainer}>
                                    <Components.PrimaryButton
                                        title={props.profile.artistDetail != null &&
                                            props.profile.artistDetail[3].audioDetails.length}
                                        paddingVertical={1}
                                        borderRadius={20}
                                    />
                                </View>
                            </View>
                            {state.isSubscribe &&
                                <View>
                                    <TouchableOpacity
                                        hitSlop={styles.hitSlop}
                                        activeOpacity={1}
                                        onPress={() => NavigationService.navigate(constants.ScreensName.AudioList.name, null)}
                                    >
                                        <Text style={styles.text14500}>{constants.ConstStrings.viewAll}</Text>
                                    </TouchableOpacity>
                                </View>

                            }

                        </View>
                    </View>
                    {props.profile.artistDetail != null && props.profile.artistDetail[3].audioDetails.length > 0 ?
                        <View style={styles.merchandiseContainer}>
                            <AudioSlider
                                images={state.combinedArray}
                                containerStyle={{
                                    height: Platform.OS === "ios" ? constants.vh(300) : constants.vh(320),
                                }}
                                showButton={false}
                                onPressAudio={(result) => { }}
                            />
                        </View> :
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>No Audio here</Text>
                        </View>

                    }


                    {/* VIDEO HERE */}
                    <View style={styles.merchandiseContainer}>
                        <View style={styles.portionContainer}>
                            <View style={styles.titleAndCountContainer}>
                                <Text style={styles.text18500}>{constants.ConstStrings.video}</Text>
                                <View style={styles.countContainer}>
                                    <Components.PrimaryButton
                                        title={props.profile.artistDetail != null &&
                                            props.profile.artistDetail[4].videoDetails.length}
                                        paddingVertical={1}
                                        borderRadius={20}
                                    />
                                </View>
                            </View>
                            {state.isSubscribe &&
                                <View>
                                    <TouchableOpacity
                                        hitSlop={styles.hitSlop}
                                        activeOpacity={1}
                                        onPress={() => NavigationService.navigate(constants.ScreensName.VideoList.name, null)}
                                    >
                                        <Text style={styles.text14500}>{constants.ConstStrings.viewAll}</Text>
                                    </TouchableOpacity>
                                </View>

                            }

                        </View>
                    </View>
                    {props.profile.artistDetail != null && props.profile.artistDetail[4].videoDetails.length > 0 ?
                        <View style={styles.merchandiseContainer}>
                            <FlatList
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={
                                    props.profile.artistDetail[4].videoDetails}
                                renderItem={renderVideo}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        :
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>No Video here</Text>
                        </View>
                    }


                    {/* PHOTOS HERE */}
                    <View style={styles.merchandiseContainer}>
                        <View style={styles.portionContainer}>
                            <View style={styles.titleAndCountContainer}>
                                <Text style={styles.text18500}>{constants.ConstStrings.photo}</Text>
                                <View style={styles.countContainer}>
                                    <Components.PrimaryButton
                                        title={props.profile.artistDetail != null &&
                                            props.profile.artistDetail[2].imageDetails.length}
                                        paddingVertical={1}
                                        borderRadius={20}
                                    />
                                </View>
                            </View>
                            {state.isSubscribe &&
                                <View>
                                    <TouchableOpacity
                                        hitSlop={styles.hitSlop}
                                        activeOpacity={1}
                                        onPress={() => NavigationService.navigate(constants.ScreensName.ImageList.name, null)}
                                    >
                                        <Text style={styles.text14500}>{constants.ConstStrings.viewAll}</Text>
                                    </TouchableOpacity>

                                </View>}

                        </View>
                    </View>
                    {props.profile.artistDetail != null && props.profile.artistDetail[2].imageDetails.length > 0 ?
                        <View style={styles.merchandiseContainer}>
                            <FlatList
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={props.profile.artistDetail != null &&
                                    props.profile.artistDetail[2].imageDetails}
                                renderItem={renderPhoto}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                        :
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>No Image here</Text>
                        </View>
                    }


                </ScrollView>
                {!state.isSubscribe &&
                    <View style={{
                        width: "90%", alignSelf: 'center',
                        marginTop: constants.vh(10),
                        marginBottom: constants.vh(25)
                    }}>
                        <Components.PrimaryButton
                            title={constants.ConstStrings.subscribeToUnblockAllFeatures}

                        />
                    </View>}
                <Components.ProgressView
                    isProgress={props.profile.isLoading}
                    title={constants.AppConstant.Bando}
                />
            </View>
        </>
    )
}

function mapStateToProps(state) {
    const { auth, post, profile } = state
    return {
        auth,
        post,
        profile
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
    (ArtistDetails);