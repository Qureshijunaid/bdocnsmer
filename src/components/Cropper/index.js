import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList
} from 'react-native';
import { CropView } from 'react-native-image-crop-tools';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { styles } from './styles';
import constants from '../../constants';

const Cropper = ({
    image,
    onCroppedComplete,
    onClose,
    hideAspects
}) => {
    const aspects = [
        { width: 1, height: 1, id: 0 },
        { width: 16, height: 9, id: 1 },
        { width: 9, height: 16, id: 2 },
        { width: 4, height: 3, id: 3 },
        { width: 3, height: 4, id: 4 },
    ]
    const cropViewRef = useRef()
    const [width, setWidth] = useState(1)
    const [height, setHeight] = useState(1)
    const [selected, setSelected] = useState(0)
    const [showAspect, setShowAspect] = useState(false)
    // const [imageUri, setImage] = useState(image)
    // const [initImageUri, setInitImage] = useState(image)
    const renderAspects = ({ item, index }) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    // setImage(initImageUri)
                    setWidth(item.width)
                    setHeight(item.height)
                    setShowAspect(false)
                    setSelected(index)
                }}
                style={{
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    backgroundColor: selected === index ? constants.Colors.color_3A3A3A : "transparent"
                }}
            >
                <Text style={[styles.text, { textAlign: "center" }]}>{item.width !== 1 ? item.width : "square"}{item.width !== 1 ? `:${item.height}` : ""}</Text>
            </TouchableOpacity>
        )
    }
    const handleCropped = (res) => {
        onCroppedComplete(res)
    }
    const handleClose = () => {
        onClose()
    }
    return (
        <>
            <View style={{ flex: 1, }}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        hitSlop={styles.hitSlop}
                        onPress={handleClose}
                    >
                        <Entypo
                            name="cross"
                            size={30}
                            color={"white"}
                        />
                    </TouchableOpacity>
                    <Text style={styles.text}>Edit Image</Text>
                    <TouchableOpacity
                        onPress={() => {
                            cropViewRef.current.saveImage(100);
                        }}
                        activeOpacity={0.8}
                        hitSlop={styles.hitSlop}
                    >
                        <Text style={styles.text}>Done</Text>
                    </TouchableOpacity>
                </View>
                <CropView
                    sourceUrl={image}
                    style={styles.cropView}
                    ref={cropViewRef}
                    onImageCrop={(res) => handleCropped(res)}
                    keepAspectRatio
                    aspectRatio={{ width: width, height: height }}
                />
                <View style={styles.buttonContainer}>
                    {
                        !hideAspects &&
                        <TouchableOpacity
                            onPress={() => { setShowAspect(true) }}
                            activeOpacity={0.8}
                            hitSlop={styles.hitSlop}>
                            <MaterialIcons
                                name="aspect-ratio"
                                size={25}
                                color={"white"}
                            />
                        </TouchableOpacity>
                    }

                    <TouchableOpacity
                        onPress={() => {
                            cropViewRef.current.rotateImage(true);
                        }}
                        activeOpacity={0.8}
                        hitSlop={styles.hitSlop}>
                        <MaterialIcons
                            name="crop-rotate"
                            size={30}
                            color={"white"}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                visible={showAspect}
                transparent
                onRequestClose={() => { setShowAspect(false) }}
                animationType="slide"
            >
                <TouchableOpacity
                    onPress={() => { setShowAspect(false) }}
                    activeOpacity={1}
                    style={styles.modalContainer}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.modalDataContainer}>
                        <FlatList
                            data={aspects}
                            renderItem={renderAspects}
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </>
    )
}

export default Cropper;