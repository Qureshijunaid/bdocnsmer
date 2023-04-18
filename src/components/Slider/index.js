import * as React from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
    Text,
    Platform
} from "react-native";
import PropTypes from "prop-types";
import constants from '../../constants';

const DEVICE_WIDTH = Dimensions.get("window").width;

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const { height, width } = Dimensions.get('window');

export const isIPhoneX = () => Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
    ? width === X_WIDTH && height === X_HEIGHT || width === XSMAX_WIDTH && height === XSMAX_HEIGHT
    : false;

export const STATUSBAR_HEIGHT = Platform.select({
    ios: isIPhoneX() ? 34 : 0,  //44 & 20
    android: 0,   //StatusBar.currentHeight
    default: 0
})

class BackgroundCarousel extends React.Component {
    scrollRef = React.createRef();
    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 0,
            offset: 0,
        };
        this.scrollRef = React.createRef();
    }

    componentDidMount = () => {
        const { loopTime, autoScroll, onEndReached, carouselWidth } = this.props;
        if (autoScroll)
            setInterval(() => {
                this.setState(
                    prev => ({
                        selectedIndex:
                            prev.selectedIndex === this.props.images.length - 1
                                ? onEndReached
                                    ? this.props.images.length - 1
                                    : 0
                                : prev.selectedIndex + 1
                    }),
                    () => {
                        this.scrollRef.current.scrollTo({
                            animated: true,
                            x: DEVICE_WIDTH * this.state.selectedIndex,
                            y: 0
                        });
                    }
                );
            }, loopTime);
    };

    handleNext = () => {
        this.setState(
            prev => ({
                selectedIndex:
                    prev.selectedIndex === this.props.images.length - 1
                        ? 0
                        : prev.selectedIndex + 1
            }),
            () => {
                this.scrollRef.current.scrollTo({
                    animated: true,
                    x: DEVICE_WIDTH * this.state.selectedIndex,
                    y: 0
                });
            }
        );
    }

    handlePrev = () => {
        this.setState(
            prev => ({
                selectedIndex:
                    prev.selectedIndex > 0
                        ? prev.selectedIndex - 1
                        : 0
            }),
            () => {
                this.scrollRef.current.scrollTo({
                    animated: true,
                    x: DEVICE_WIDTH * this.state.selectedIndex,
                    y: 0
                });
            }
        );
    }
    setSelectedIndex = event => {
        const contentOffset = event.nativeEvent.contentOffset;
        const viewSize = event.nativeEvent.layoutMeasurement;

        // Divide the horizontal offset by the width of the view to see which page is visible
        const selectedIndex = Math.floor(contentOffset.x / viewSize.width);
        this.setState({ selectedIndex });
    };

    render() {
        const {
            containerStyle,
            images,
            imagesHeader,
            selectedButtonColor,
            sliderButtonSize,
            unselectedButtonBorderColor,
            spaceBetweenDot,
            prev,
            next,
            showButton,
            buttonStyle,
            onEndReached,
            sliderMarginBottom,
            ...rest
        } = this.props
        const { selectedIndex } = this.state;
        return (
            <View style={[{ height: "100%", width: "100%" }, containerStyle]}>

                <ScrollView
                    horizontal
                    pagingEnabled
                    onMomentumScrollEnd={onEndReached ? null : this.setSelectedIndex}
                    ref={this.scrollRef}
                >
                    {images.map(image => (
                        <View style={styles.backgroundImage}>
                            <Image
                                style={styles.backgroundImage}
                                //source={{ uri: image }}
                                source={image.body}
                                key={image.body}
                                resizeMode="stretch"
                            />

                        </View>
                    ))}

                </ScrollView>

                <View style={styles.sliderContainer}>
                    <View>
                        {
                            selectedIndex !== 0 && showButton ?
                                <TouchableOpacity
                                    onPress={this.handlePrev}
                                    style={buttonStyle}>
                                    <Text>{prev}</Text>
                                </TouchableOpacity>
                                :
                                null
                        }
                    </View>

                    <View style={{
                        flexDirection: "row"
                    }}>
                        {
                            images.map(function (item, index) {
                                return (
                                    <View key={index} style={[styles.sliderBtnContainer, { marginBottom: sliderMarginBottom }]}>

                                        <View style={{
                                            height: sliderButtonSize,
                                            width: sliderButtonSize,
                                            borderRadius: sliderButtonSize / 2,
                                            borderWidth: 1,
                                            borderColor: unselectedButtonBorderColor,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: spaceBetweenDot
                                        }}>
                                            {
                                                this.state.selectedIndex == index ? <View
                                                    style={
                                                        {
                                                            height: sliderButtonSize - 1,
                                                            width: sliderButtonSize - 1,
                                                            borderRadius: sliderButtonSize / 2,
                                                            backgroundColor: selectedButtonColor
                                                        }}
                                                /> : null
                                            }
                                        </View>
                                    </View>
                                )
                            }.bind(this))
                        }
                    </View>
                    <View>
                        {
                            selectedIndex !== images.length - 1 && showButton ?
                                <TouchableOpacity
                                    onPress={this.handleNext}
                                    style={buttonStyle}>
                                    <Text>{next}</Text>
                                </TouchableOpacity>
                                :
                                null
                        }
                    </View>
                </View>
                {
                    (onEndReached && selectedIndex === images.length - 1)
                        ? onEndReached() :
                        null
                }
            </View>
        );
    }
}


BackgroundCarousel.propTypes = {
    loopTime: PropTypes.number,
    containerStyle: PropTypes.object,
    sliderButtonSize: PropTypes.number,
    selectedButtonColor: PropTypes.string,
    autoScroll: PropTypes.bool,
    unselectedButtonBorderColor: PropTypes.string,
    spaceBetweenDot: PropTypes.number,
    prev: PropTypes.string,
    next: PropTypes.string,
    showButton: PropTypes.bool,
    buttonStyle: PropTypes.object,
    onEndReached: PropTypes.func,
    sliderMarginBottom: PropTypes.number,
};

BackgroundCarousel.defaultProps = {
    loopTime: 3000,
    containerStyle: {},
    sliderButtonSize: 13,
    selectedButtonColor: "#fff",
    unselectedButtonBorderColor: "fff",
    autoScroll: true,
    spaceBetweenDot: 10,
    prev: "Prev",
    next: "Next",
    showButton: true,
    buttonStyle: {},
    sliderMarginBottom: 100,
};


const styles = StyleSheet.create({
    backgroundImage: {
        height: "100%",
        width: Dimensions.get("window").width
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flex: 1
    },
    // itemContainer: {
    //     height,
    //     width
    // },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: "space-between",
        position: 'absolute',
        bottom: 10,
        width: '100%'
    },
    sliderContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        justifyContent: "space-between",
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    sliderBtn: {
        height: 13,
        width: 13,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },

    sliderBtnContainer: {
        flexDirection: 'row',
    },
});

export { BackgroundCarousel };