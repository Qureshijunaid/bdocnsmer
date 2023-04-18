import { Linking, Platform } from "react-native";
import RNFetchBlob from 'react-native-fetch-blob';
import RNBackgroundDownloader from 'react-native-background-downloader';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import moment from 'moment';

import {
    getLastCachedClearedTime,
    setLastCachedClearedTime
} from '../asyncstorage';

const createFolderPath = () => {
    const PATH_TO_CREATE = `${RNBackgroundDownloader.directories.documents}/TempCache`
    RNFetchBlob.fs.mkdir(PATH_TO_CREATE)
        .then(() => { console.log("path created"); })
        .catch((err) => { console.log("path already exist"); })
}
export const downloadFile = async (url) => {
    await createFolderPath()
    let urlArray = url.split("/")
    let fileNameAndExtension = urlArray[urlArray.length - 1]
    let localDir = `${RNBackgroundDownloader.directories.documents}/TempCache/${fileNameAndExtension}`

    const downloaded = await RNFetchBlob.fs.exists(localDir);
    console.log("downloaded", downloaded);
    if (downloaded) {
        return localDir;
    } else {
        RNBackgroundDownloader.download({
            id: `video_${fileNameAndExtension}`,
            url: url,
            destination: `${RNBackgroundDownloader.directories.documents}/TempCache/${fileNameAndExtension}`
        })
            .begin((expectedBytes) => {
                console.log(`Going to download ${expectedBytes / 1050000} MB! at ${localDir}`);
            })
            .progress((percent) => {
                console.log(`Downloaded: ${percent * 100}%`);
            })
            .done(() => {
                console.log('Download is done!');

            })
            .error((error) => {
                console.log('Download canceled due to error: ', error);
            });
        return null;

    }

}

export const deleteAllCachedVideo = () => {
    let path = `${RNBackgroundDownloader.directories.documents}/TempCache`
    RNFetchBlob.fs.unlink(path)
        .then(() => {
            console.log("cleared");
        })
        .catch((err) => { console.log("err", err); })
}

export const deleteCachePeriodically = async () => {
    getLastCachedClearedTime().then(lastClearedTime => {
        if (lastClearedTime) {
            var timeNow = moment(new Date())
            var duration = moment.duration(timeNow.diff(lastClearedTime));
            var hours = duration.asHours();
            if (hours > 1) {
                deleteAllCachedVideo()
                setLastCachedClearedTime(timeNow)
            }
        }
    })
}


