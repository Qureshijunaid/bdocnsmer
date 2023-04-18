import { RNS3 } from 'react-native-aws3';

const uploadFile = async (uri, name, type) => {

    const file = {
        uri: uri,
        name: name,
        type: type,
    }

    const options = {
        keyPrefix: 'myuploads/',
        bucket: 'techalchemybando',
        region: 'ap-south-1',

        successActionStatus: 201,
    }

    let result = await RNS3.put(file, options).then(response => {
        if (response.status !== 201)
            throw new Error("Failed to upload image to S3");

        return response
    }).catch((error) => {
        return error
    }

    )
    return result

};


export default uploadFile;