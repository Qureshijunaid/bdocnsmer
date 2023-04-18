import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Platform,
    StatusBar,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';

import * as NavigationService from '../../../navigation/NavigationService';
import constants from '../../../constants';
import Components from '../../../components';
import { styles } from './styles';
import { setRegistrationDetails, getGenre, selectUserGenre } from '../../../actions/registration';
import Toast from 'react-native-toast-message';

const SelectGenre = (props) => {
    const [state, setState] = useState({
        aboutText: '',
        selectedUsage: [],
        usageArray: [{
            key: 1,
            title: 'Releasing',
            isSelected: false,
        },
        {
            key: 2,
            title: 'Selling',
            isSelected: false,
        },
        {
            key: 3,
            title: 'Releasing',
            isSelected: false,
        },
        {
            key: 4,
            title: 'Getting',
            isSelected: false,
        },
        {
            key: 5,
            title: 'Advertising',
            isSelected: false,
        },
        {
            key: 6,
            title: 'Additional',
            isSelected: false,
        },
        {
            key: 7,
            title: 'Getting',
            isSelected: false,
        },
        ]

    })
    useEffect(() => {
    }, [])

    const handleNext = async () => {
        if (state.selectedUsage.length < 3) {
            Toast.show({
                text1: constants.AppConstant.Bando,
                text2: "Please select 3 or more intrested music genres",
                type: "error",
                position: "top"
            });
            return 1;
        }

        let bandoUsageSelected = []
        state.selectedUsage.map(item => {
            bandoUsageSelected.push(item._id)
        })
        const payload = {
            "bandoUsage": bandoUsageSelected,
        }


        await props.dispatch(setRegistrationDetails(payload))
        NavigationService.navigate(constants.ScreensName.ProfilePicture.name, null)

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
        if (!item.isSelected) {
            state.selectedUsage.push(item)
        } else {
            const ifExist = state.selectedUsage.findIndex(
                itemselectedUsage => item.key === itemselectedUsage.key
            )
            if (ifExist > -1) {
                state.selectedUsage.splice(ifExist, 1);
            }
        }

        await props.dispatch(selectUserGenre({ genreId: item._id }));
        setState({
            ...state
        })

    };

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                <View style={styles.dataContainer}>
                    <Components.HeaderWithProgress
                        presentCount={6}
                        totalCount={7}
                        onPress={() => {
                            props.navigation.goBack()
                        }}
                    />
                    <View style={styles.whatBandoUseContainer}>
                        <Text style={styles.text30bold}>{constants.ConstStrings.select3OrMoreIntrestedMusic}</Text>
                        <Text style={styles.text16500}>{constants.ConstStrings.weWillBuildYourProfile}</Text>
                    </View>
                    <FlatList
                        horizontal={false}
                        numColumns={3}
                        data={props.registration.genres}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={<View style={styles.listFooterLayout} />}
                    />
                </View>
                {/*<View style={{ paddingHorizontal: 15, marginBottom: 15 ,backgroundColor:'red'}}>*/}
                <View style={styles.absoluteBtn}>
                    <Components.PrimaryButton
                        title={constants.ConstStrings.next}
                        onPress={state.selectedUsage.length > 2 ? handleNext : null}
                        backgroundColor=
                        {state.selectedUsage.length > 2 ?
                            constants.Colors.color_FF3062 :
                            constants.Colors.rgb_126_39_60
                        }
                    />
                </View>
            </SafeAreaView>
        </>
    )
}

function mapStateToProps(state) {
    const { registration } = state
    return {
        registration
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
)(SelectGenre)