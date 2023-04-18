import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StatusBar,
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    ImageBackground,
    Modal,
    FlatList,
    Dimensions,
    BackHandler,
    Alert,
    Linking,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import * as NavigationService from '../../../navigation/NavigationService';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import constants from '../../../constants';
import Components from '../../../components';
import { searchArtistForChat, clearSearchArtistForChat } from '../../../actions/chat';
import { getConsumerProfile } from '../../../actions/profile';
import { styles } from './styles';

const SearchArtistList = (props) => {
    const [state, setState] = useState({
        isActive: false,
        searchQuery: '',
        pageNumber: 1,
        artistData: [
            {
                id: 123,
                artistName: 'Nile Rogers',
                artistImage: constants.Images.welcome1
            },
            {
                id: 123,
                artistName: 'Atul',
                artistImage: constants.Images.welcome1
            },
            {
                id: 123,
                artistName: 'Shivam',
                artistImage: constants.Images.welcome1
            },
            {
                id: 123,
                artistName: 'Shivam',
                artistImage: constants.Images.welcome1
            },
            {
                id: 123,
                artistName: 'Shivam',
                artistImage: constants.Images.welcome1
            },
            {
                id: 123,
                artistName: 'Shivam',
                artistImage: constants.Images.welcome1
            },
            {
                id: 123,
                artistName: 'Nile Rogers',
                artistImage: constants.Images.welcome1
            },
        ]
    })
    const setSearchQuery = (text) => {
        setState({
            ...state,
            searchQuery: text,
            isActive: true
        });
        if (text.length > 1) {
            props.dispatch(searchArtistForChat({ query: text }));
        }
    }


    const renderItemForAlreadyChatArtist = ({ item, index }) => {
        return (
            <View style={{ marginTop: constants.vh(22) }}>
                <Components.AlreadyChatArtistList
                    artistImage={!item.profileImage ? constants.AppConstant.bandoLogo : item.profileImage}
                    artistName={item.artistName != "" ? item.artistName : `${item.firstName} ${item.lastName}`}
                    isSearch={false}
                    onPress={() => NavigationService.navigate(constants.ScreensName.Chatting.name, item)}
                />
            </View>


        )
    }

    const renderEmptyList = () => {
        return (
            <View style={{ marginTop: constants.vh(22) }}>
                <Text style={styles.text23white}>No artist found</Text>
            </View>
        )
    }


    const handleClose = () => {
        setState({
            ...state,
            isActive: false,
            searchQuery: ''
        })
        props.dispatch(clearSearchArtistForChat())
        props.navigation.goBack()
    }

    const handleProfileClick = async () => {
        await props.dispatch(getConsumerProfile());
        //NavigationService.navigate(constants.ScreensName.UserProfile.name, null)
    }
    return (
        <>
            <StatusBar barStyle="light-content" />
            <TouchableWithoutFeedback
                onPress={() => { Keyboard.dismiss() }}
                style={{ flex: 1 }}>
                <SafeAreaView style={styles.container}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => handleProfileClick()}
                        >
                            <FastImage
                                style={styles.headerImage}
                                source={{
                                    uri:
                                        props.auth?.userRegistered?.profileImage != null ?
                                            props.auth?.userRegistered?.profileImage :
                                            constants.AppConstant.bandoLogo
                                    ,
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.searchBlackContainer}>
                        <TextInput
                            placeholder='Artists'
                            style={styles.searchField}
                            selectionColor={constants.Colors.color_FFF500}

                            autoFocus={true}
                            autoCapitalize={"none"}
                            onBlur={() => { }}

                            //onFocus={()=>{setState({...state,isActive:true})}}
                            onChangeText={(text) => {
                                setSearchQuery(text)
                            }}
                            value={state.searchQuery}
                        />
                        <TouchableOpacity
                            activeOpacity={1}
                            style={styles.closeIcon} onPress={() => { handleClose() }}>
                            <AntDesign name={"close"} size={20} color={constants.Colors.white} />
                        </TouchableOpacity>
                    </View>


                    <View style={{ marginTop: 20, width: "90%", alignSelf: "center" }}>
                        {state.searchQuery.length > 1 &&
                            <FlatList
                                data={props.chat.searchArtistForChat}
                                ListEmptyComponent={renderEmptyList}
                                renderItem={renderItemForAlreadyChatArtist}
                                // onEndReached={handleOnReachedTrending}
                                onEndReachedThreshold={0.5}
                                keyExtractor={(item, index) => index.toString()}
                            //maxToRenderPerBatch={5}
                            />
                        }
                        {state.searchQuery.length < 2 &&
                            <View style={{ marginTop: constants.vh(22) }}>
                                <Text style={styles.text23white}>Please search artist  here</Text>
                            </View>
                        }
                    </View>

                    <Components.ProgressView
                        isProgress={props.chat.isLoading}
                        title={constants.AppConstant.Bando}
                    />
                </SafeAreaView>
            </TouchableWithoutFeedback>

        </>
    )
}
function mapStateToProps(state) {
    let { post, auth, profile, chat } = state;
    return {
        post, auth, profile, chat
    }
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchArtistList);