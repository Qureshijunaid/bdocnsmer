import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import constants from '../../constants';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        flex: 1,
        width: windowWidth,
        height: windowHeight,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        backgroundColor: 'rgba(52, 52, 52, 0.8)'
    }
});


export const ProgressView = (props) => {
    if (props.isProgress) {
        return (
            <SafeAreaView style={[styles.overlay, { alignItems: 'center', justifyContent: 'center' }]}>
                <View style={{ borderRadius: 10, backgroundColor: 'white', paddingHorizontal: 25, paddingVertical: 15 }}>
                    <Text style={{ fontSize: 20, fontWeight: '200' }}>{props.title !== undefined ? props.title : 'Loading'}</Text>
                    <ActivityIndicator color={constants.Colors.color_232323} size="large" />
                </View>
            </SafeAreaView>
        );
    } else {
        return (<View />)
    }
}
