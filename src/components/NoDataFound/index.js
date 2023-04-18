import React from 'react';
import {
    View,
    Image,
    Text
} from 'react-native';
import constants from '../../constants';

export const NoDataFound = () => {
    return (
        <View
            style={{
                flex: 1,

            }}
        >
            <Text style={{
                color: "#fff"
            }}>No Data found</Text>
        </View>
    )
}