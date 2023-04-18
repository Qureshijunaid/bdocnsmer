import * as React from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
    FlatList,
    Text,
} from "react-native";
import PropTypes from "prop-types";
import FastImage from 'react-native-fast-image';

import Components from '../../components';

const DEVICE_WIDTH = constants.vw(344)
//Dimensions.get("window").width;
import constants from '../../constants';

class MerchandiseSlider extends React.Component {
    scrollRef = React.createRef();
    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 0,
            offset: 0,
            selectSize: 0,
            selectedMerchQuantity: null,
            selectedQuantityPrice: null,
            selectedMerchAvailable: "0"
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
        if (this.props.images[this.state.selectedIndex].price_details[0].variations.length > 0) {
            this.setState({
                selectedMerchAvailable: this.props.images[this.state.selectedIndex].price_details[0].variations[0].inStock
            })
        }
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
        // this.setState({
        //     selectSize: 0
        // })
        const contentOffset = event.nativeEvent.contentOffset;
        const viewSize = event.nativeEvent.layoutMeasurement;

        // Divide the horizontal offset by the width of the view to see which page is visible
        const selectedIndex = Math.floor(contentOffset.x / viewSize.width);
        this.setState({ selectedIndex });
        // if (this.props.images[selectedIndex].price_details[0].variations.length > 0) {
        //     this.setState({
        //         selectedMerchAvailable: this.props.images[selectedIndex].price_details[0].variations[this.state.selectSize].inStock
        //     })
        // }
    };

    renderSizeArray = ({ item, index }) => {
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.sizeContainer, {
                    borderColor: (index === this.state.selectSize ? constants.Colors.white : constants.Colors.color_2F2F2F),
                    backgroundColor: item.inStock === "0" ? constants.Colors.soldOut : "transparent"
                }]}

                onPress={() => {
                    this.setState({
                        selectSize: index,
                        selectedQuantityPrice: item.price,
                        selectedMerchQuantity: item.quantity,
                        selectedMerchAvailable: this.props.images[this.state.selectedIndex].price_details[0].variations[index].inStock
                    })

                }}
            >
                <Text style={[styles.text16normal, { color: constants.Colors.white }]}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    handleClickMerch = (data) => {
        return onPressBuyNow(data)

    }

    render() {
        const {
            containerStyle,
            images,
            selectedButtonColor,
            sliderButtonSize,
            unselectedButtonBorderColor,
            spaceBetweenDot,
            prev,
            next,
            showButton,
            buttonStyle,
            onEndReached,
            onPressBuyNow,
            ...rest
        } = this.props
        const { selectedIndex } = this.state;
        return (
            <View style={[{ marginTop: constants.vh(5), height: "100%", width: DEVICE_WIDTH }, containerStyle]}>

                <ScrollView
                    horizontal
                    pagingEnabled
                    onMomentumScrollEnd={onEndReached ? null : this.setSelectedIndex}
                    ref={this.scrollRef}
                >
                    {images.map((image, index) => (
                        <View style={{
                            width: DEVICE_WIDTH,
                        }}>
                            <FastImage
                                style={styles.backgroundImage}
                                // source={require(image)}
                                source={{ uri: image.images[0], priority: FastImage.priority.high }}

                                key={image}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <View style={styles.sliderContainer}>
                                <View style={{
                                    flexDirection: "row",

                                }}>
                                    {
                                        images.map(function (item, index) {
                                            return (
                                                <View key={index} style={[styles.sliderBtnContainer]}>

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
                            </View>
                            <View style={{
                                marginTop: constants.vh(18)
                            }}>
                                <Text style={styles.text23800}>{image.merch_details[0].merchName}</Text>
                            </View>

                            <View style={{
                                marginTop: constants.vh(29),
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "99%",
                                alignSelf: "center"
                            }}>
                                <Text style={[styles.text23800, {
                                    color: "#B0B0B0",
                                    marginBottom: 0
                                }]}>
                                    {/* £ {image.price_details[0].price} */}
                                    {`£ ${image.price_details[0].variations.length > 0 ? image.price_details[0].variations[0].price.toFixed(2)
                                        : image.price_details[0].price.toFixed(2)}`}
                                </Text>
                                {
                                    image.price_details[0].variations.length < 1 ?
                                        (
                                            image.price_details[0].inStock === "1" ?
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    onPress={() => onPressBuyNow(image, this.state.selectSize)}
                                                    style={[styles.buyNow,
                                                    { marginTop: image.price_details[0]?.variations.length > 0 ? constants.vh(60) : 0 }
                                                    ]}
                                                >
                                                    <Text style={styles.text14500}>Buy Now</Text>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity
                                                    activeOpacity={1}
                                                    //onPress={() => onPressBuyNow(image)}
                                                    style={[styles.buyNow,
                                                    {
                                                        backgroundColor: constants.Colors.color_FF005C,
                                                        marginTop: image.price_details[0]?.variations.length > 0 ? constants.vh(60) : 0
                                                    }
                                                    ]}
                                                >
                                                    <Text style={styles.text14500}>Sold Out</Text>
                                                </TouchableOpacity>

                                        )
                                        : null
                                }
                            </View>
                            {
                                image.price_details[0].variations.length > 0 ?
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        style={{ marginTop: constants.vh(18) }}>
                                        <FlatList
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            data={image.price_details[0]?.variations}
                                            renderItem={this.renderSizeArray}
                                            keyExtractor={(item, index) => index.toString()}
                                        />
                                    </TouchableOpacity> :
                                    null

                            }
                            {
                                image.price_details[0].variations.length > 0 ?
                                    this.state.selectedMerchAvailable === "1" ?
                                        (<TouchableOpacity
                                            activeOpacity={1}
                                            onPress={() => onPressBuyNow(image, this.state.selectSize)}
                                            style={[styles.buyNow,
                                            { marginTop: constants.vh(20), alignSelf: "flex-end", marginHorizontal: constants.vh(5) }
                                            ]}
                                        >
                                            <Text style={styles.text14500}>Buy Now</Text>
                                        </TouchableOpacity>) :
                                        (
                                            <TouchableOpacity
                                                activeOpacity={1}
                                                style={[styles.buyNow,
                                                {
                                                    marginTop: constants.vh(20),
                                                    alignSelf: "flex-end",
                                                    marginHorizontal: constants.vh(5),
                                                    backgroundColor: constants.Colors.color_FF005C
                                                }
                                                ]}
                                            >
                                                <Text style={styles.text14500}>Sold Out</Text>
                                            </TouchableOpacity>
                                        )
                                    :
                                    null
                            }

                        </View>

                    ))}
                </ScrollView>


                {
                    (onEndReached && selectedIndex === images.length - 1)
                        ? onEndReached() :
                        null
                }
            </View>
        );
    }
}


MerchandiseSlider.propTypes = {
    loopTime: PropTypes.number,
    containerStyle: PropTypes.object,
    sliderButtonSize: PropTypes.number,
    selectedButtonColor: PropTypes.string,
    onPressBuyNow: PropTypes.func,
    autoScroll: PropTypes.bool,
    unselectedButtonBorderColor: PropTypes.string,
    spaceBetweenDot: PropTypes.number,
    prev: PropTypes.string,
    next: PropTypes.string,
    showButton: PropTypes.bool,
    buttonStyle: PropTypes.object,
    onEndReached: PropTypes.func,
};

MerchandiseSlider.defaultProps = {
    //loopTime: 3000,
    containerStyle: {},
    sliderButtonSize: 13,
    selectedButtonColor: "#fff",
    unselectedButtonBorderColor: "fff",
    autoScroll: false,
    spaceBetweenDot: 10,
    prev: "Prev",
    next: "Next",
    showButton: true,
    buttonStyle: {},
    onPressBuyNow: {}
};


const styles = StyleSheet.create({
    backgroundImage: {
        height: constants.vh(321),
        width: DEVICE_WIDTH,
        borderRadius: 8,
        alignSelf: "center",

        // borderRadius: constants.vh(20)
    },
    text23800: {
        fontSize: 23,
        fontWeight: "800",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
    },
    text14500: {
        fontSize: 14,
        fontWeight: "500",
        fontFamily: constants.Fonts.K2D_Regular,
        color: constants.Colors.white
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
    buyNow: {
        paddingVertical: constants.vh(10),
        paddingHorizontal: constants.vw(38),
        backgroundColor: constants.Colors.color_17B933,
        borderRadius: constants.vw(20),
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
        marginTop: constants.vh(40),
        alignSelf: 'center',
        justifyContent: "center",
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 10,
        //backgroundColor:'red'
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
    sizeContainer: {
        marginEnd: constants.vw(16),
        backgroundColor: constants.Colors.color_2F2F2F,
        borderWidth: 1,
        borderRadius: 5,
        //width: constants.vw(42),
        //height: constants.vw(42),
        paddingHorizontal: constants.vw(10),
        paddingVertical: constants.vh(12),
        justifyContent: "center",
        alignItems: "center"
        // padding: constants.vw(15)
    },
});

export { MerchandiseSlider };