import RNFetchBlob from 'react-native-fetch-blob';
import { Platform } from "react-native";
import Toast from 'react-native-toast-message';

export const downloadCSV = (values) => {
  const headerString = 'date," ",name,price\n';
  const rowString = values.map(d => d.data.map(item => (
    `${d.title}," ",${item.name},${item.price}\n`
  )).join(''));
  const csvString = `${headerString}${rowString}`;

  const pathToWrite =
    Platform.OS === 'ios' ?

      `${RNFetchBlob.fs.dirs.MainBundleDir}/BandoMerchOrders[2/8-2/10].csv` :
      `${RNFetchBlob.fs.dirs.DownloadDir}/BandoMerchOrders[2/8-2/10].csv`

  RNFetchBlob.fs
    .writeFile(pathToWrite, csvString, 'utf8')
    .then(() => {
      Toast.show({
        text1: "Bando",
        text2: "CSV file has been downloaded.",
        type: "success",
        position: "top"
      });
    })
    .catch(error => console.error(error));
}
