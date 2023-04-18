import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Platform,
  StatusBar,
  Image,
  BackHandler,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';

import { styles } from './styles';

import constants from '../../../constants';
import Components from '../../../components';
import * as NavigationService from '../../../navigation/NavigationService';
import { switchRoute } from '../../../actions/auth';

const BandoPlan = (props) => {
  const handleGoToHomepage = () => {
    props.dispatch(switchRoute());
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  const backAction = () => {
    return true;
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.dataContainer}>
          <View>
            <Text style={styles.text30bold}>
              {constants.ConstStrings.bandoFreeAndPremium}
            </Text>
            <Text style={styles.text30bold}>
              {"Premium"}
            </Text>
          </View>

          <View style={{
            height: constants.vh(106),
            marginTop: constants.vh(32),
            width: "100%",
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <View style={{ width: "50%" }}>
              <Components.BandoPlanCard
                firstHeadLine={"FREE"}
                firstData={constants.ConstStrings.free}
                paddingHorizontal={10}
                paddingVertical={5}
                backgroundColor={"#5F5F5F"}
                borderTopLeftRadius={10}
                borderTopRightRadius={0}
                borderBottomLeftRadius={10}
                borderBottomRightRadius={0}
                fontHeadLine={14}
                fontSize={14}
                // headerHeight={"40%"}
                bodyHeight={"70%"}
              />
            </View>
            <View style={{ width: "50%" }}>
              <Components.BandoPlanCard
                firstHeadLine={"PREMIUM"}
                firstData={constants.ConstStrings.premium}
                paddingHorizontal={10}
                paddingVertical={5}
                backgroundColor={"#FF3061"}
                borderTopLeftRadius={0}
                borderTopRightRadius={10}
                borderBottomLeftRadius={0}
                borderBottomRightRadius={10}
              />
            </View>
          </View>

          <View style={{ paddingVertical: constants.vh(30) }}>
            <Text style={{
              fontSize: 14,
              color: "white",
              textAlign: 'center',
              fontFamily: constants.Fonts.K2D_Bold
            }}>{constants.ConstStrings.cannotUpgradeToPremium}</Text>
          </View>

          <View style={{ height: constants.vh(106), width: "100%", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ width: "50%" }}>
              <Components.BandoPlanCard
                firstData={"Bando Free"}
                paddingHorizontal={10}
                paddingVertical={10}
                backgroundColor={"#5F5F5F"}
                borderTopLeftRadius={10}
                borderTopRightRadius={0}
                borderBottomLeftRadius={10}
                borderBottomRightRadius={0}
                fontSize={24}
                headerHeight={"0%"}
                bodyHeight={"100%"}
              />
            </View>
            <View style={{ width: "50%" }}>
              <Components.BandoPlanCard
                firstData={"Current Plan"}
                paddingHorizontal={10}
                paddingVertical={10}
                backgroundColor={"#5F5F5F"}
                borderTopLeftRadius={0}
                borderTopRightRadius={10}
                borderBottomLeftRadius={0}
                borderBottomRightRadius={10}
                headerHeight={"0%"}
                bodyHeight={"100%"}
              />
            </View>
          </View>

          <View style={{ width: "100%", height: constants.vh(200), marginTop: constants.vh(40) }}>
            <Components.BandoPlanCard
              firstHeadLine={"Bando Premium"}
              firstData={constants.ConstStrings.bandoPremium}
              paddingHorizontal={10}
              paddingVertical={10}
              fontHeadLine={24}
              fontSize={14}
              backgroundColor={"#FF3061"}
              borderTopLeftRadius={10}
              borderTopRightRadius={10}
              borderBottomLeftRadius={10}
              borderBottomRightRadius={10}
              headerHeight={"40%"}
              bodyHeight={"60%"}
            />
          </View>
          <View style={{ height: constants.vh(130) }} >
            <Text></Text>
          </View>
        </ScrollView>

        <View style={{ paddingHorizontal: 15, marginBottom: 10 }} >
          <Components.PrimaryButton
            title={constants.ConstStrings.done}
            onPress={() => handleGoToHomepage()}
            backgroundColor={constants.Colors.color_FF3062}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

function mapStateToProps(state) {
  const { login } = state;
  return {
    login,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(BandoPlan);
