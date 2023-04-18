import React, { useEffect } from 'react';
import {
    StatusBar,
    SafeAreaView,
    Text,
    View
} from 'react-native';
import { connect } from 'react-redux';
import Orientation from 'react-native-orientation-locker';

import constants from '../../constants';
import Components from '../../components';
import Video from '../../components/VideoPlayer/react-native-video-controls/VideoPlayer';

const VideoPlayer = (props) => {
    useEffect(() => {
        console.log("props.route.params", props.route.params);
        const subscribe = props.navigation.addListener('focus', () => {
            Orientation.unlockAllOrientations()
        })
        const unsubscribe = props.navigation.addListener('blur', () => {
            Orientation.lockToPortrait()
        })
        return () => {
            subscribe
            unsubscribe
        }
    }, [])
    return (
        <>
            <View style={{ flex: 1 }}>
                <Video
                    source={
                        props.route.params.url.includes("m3u8") ?
                            {
                                uri: props.route.params.url,
                                type: "m3u8",
                            } :
                            {
                                uri: props.route.params.url,
                            }
                    }
                    fullscreen
                    fullscreenAutorotate
                    initialPlayed={props.route.params.initialPlayed ? props.route.params.initialPlayed : 0}
                    seekColor={"red"}
                    hideShutterView={true}
                    posterResizeMode="cover"
                    showOnStart={false}
                    controlAnimationTiming={0}
                    allowsExternalPlayback={false}
                    durationCallback={(result) => {

                    }}
                    repeat={false}
                    ignoreSilentSwitch={"ignore"}
                    playWhenInactive={false}
                    playInBackground={false}
                    poster={
                        props.route.params.posterFrame ?
                            props.route.params.posterFrame :
                            constants.AppConstant.bandoLogo
                    }
                    resizeMode="contain"
                    showPostActionButton={true}
                    onPressCross={() => { props.navigation.goBack() }}
                />
            </View>
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
)(VideoPlayer)
