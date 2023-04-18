import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Platform,
    StatusBar,
    FlatList,
    TouchableOpacity,
    Modal,
    BackHandler
} from 'react-native';
import { connect } from 'react-redux';
import * as NavigationService from '../../../navigation/NavigationService';
import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import { setRegistrationDetails, getGenre, selectUserGenre } from '../../../actions/registration';
import Feather from 'react-native-vector-icons/Feather';
import { updateUserIntrest } from '../../../actions/profile';
import Toast from 'react-native-toast-message';

const EditConsumerGenre = (props) => {
    const [state, setState] = useState({
        aboutText: '',
        selectedUsage: props.auth.userRegistered ? props.auth.userRegistered.genres ? props.auth.userRegistered.genres : [] : [],
        showGoBack: false,
        selectedIntrest: 0
    })

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);


    const backAction = () => {
        setState({
            ...state,
            showGoBack: true
        })
        return true;
    };

    const countSelectedIntrest = () => {
        let selectedIntrest = 0;
        props.registration.genres.map((item) => {
            if (item.isSelected) {
                selectedIntrest++;
            }
        });

        return selectedIntrest;
    }

    const handleSave = async () => {
        let totalSelectedIntrest = countSelectedIntrest();
        if (totalSelectedIntrest < 3) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please select 3 or more intrested music genres",
                type: "error",
                position: "top"
            });
            return 1;
        }

        let bandoUsageSelected = [];
        props.registration.genres.map((item) => {
            if (item.isSelected) {
                bandoUsageSelected.push(item._id)
            }
        });

        const payload = {
            "genres": bandoUsageSelected,
        }


        await props.dispatch(updateUserIntrest(payload))
    }

    const renderItem = ({ item, index }) => {
        return (
            <View
                style={{
                    marginVertical: constants.vh(20),
                    width: "33%",
                }}
            >
                <Components.GenreCard
                    genreName={item.title}
                    image={item.image_url}
                    isSelected={item.isSelected}
                    onPress={() => selectItem(item)}
                />
            </View>
        )
    }

    const selectItem = async (item) => {
        props.dispatch(selectUserGenre({ genreId: item._id }));
    };

    const handleGoBack = () => {
        setState({
            ...state,
            showGoBack: false,
            selectedUsage: props.auth.userRegistered ? props.auth.userRegistered.genres ? props.auth.userRegistered.genres : [] : [],
        })
        props.navigation.goBack();
    }

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                {/* <View style={styles.dataContainer}> */}
                {/* <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => { setState({ ...state, showGoBack: true }) }}
                        style={styles.headerContainer}>
                        <Feather
                            name="arrow-left"
                            size={25}
                            color={constants.Colors.white}
                        /> */}
                <View style={{
                    paddingHorizontal: 20,
                    marginTop: 10,
                    marginBottom: 50,
                }}>
                    <Components.HeaderWithTitle
                        onPress={() => { setState({ ...state, showGoBack: true }) }}
                    />
                    {/* </View> */}
                    <Text style={styles.text30bold}>{constants.ConstStrings.edit_interests}</Text>
                    {/* </TouchableOpacity> */}
                    <View style={styles.whatBandoUseContainer}>
                        <Text style={styles.text16500}>{constants.ConstStrings.select_at_least_3_genres_youre_interested_in_so}</Text>
                        {/* <Text style={styles.text16500}>{constants.ConstStrings.we_can_ensure_the_content_on_the_app}</Text> */}
                    </View>
                    <FlatList
                        horizontal={false}
                        numColumns={3}
                        data={props.registration.genres}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={<View style={styles.listFooterLayout}
                        />}
                    />
                </View>
                {/*<View style={{ paddingHorizontal: 15, marginBottom: 15 ,backgroundColor:'red'}}>*/}
                <View style={styles.absoluteBtn}>
                    <Components.PrimaryButton
                        title={constants.ConstStrings.save}
                        onPress={state.selectedUsage.length > 2 ? handleSave : null}
                        backgroundColor=
                        {state.selectedUsage.length > 2 ?
                            constants.Colors.color_FF3062 :
                            constants.Colors.rgb_126_39_60
                        }
                    />
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={state.showGoBack}
                >
                    <View
                        style={styles.modalMain}
                    >
                        <View style={styles.modalSecondry}>
                            {/* <Text style={styles.text23white}>Logout?</Text> */}
                            <Text
                                style={{ ...styles.text16C4C4C4, marginTop: constants.vh(20) }}
                            >Are you sure you want to</Text>
                            <Text
                                style={styles.text16C4C4C4}
                            >go back?</Text>

                        </View>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={handleGoBack}
                                style={styles.modalButton}
                            >
                                <Text
                                    style={[styles.text16white, {
                                        color: "#FF4F4F",
                                    }]}
                                >Yes</Text>
                            </TouchableOpacity>
                            <View
                                style={{
                                    paddingVertical: constants.vh(28),
                                    width: 2,
                                    backgroundColor: "rgba(84, 84, 88, 0.65)"
                                }}
                            />
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => {
                                    setState({
                                        ...state,
                                        showGoBack: false
                                    })
                                }}
                                style={styles.modalButton}
                            >
                                <Text
                                    style={styles.text16white}
                                >Cancel</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </Modal>
                <Components.ProgressView
                    isProgress={props.profile.isLoading}
                    title={constants.AppConstant.Bando}
                />
            </SafeAreaView>
        </>
    )
}

function mapStateToProps(state) {
    const { registration, auth, profile } = state
    return {
        registration, auth, profile
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
)(EditConsumerGenre)