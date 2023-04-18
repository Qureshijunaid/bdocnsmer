import { getUniqueId, getManufacturer } from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';

export async function getFcmToken() {

  try {
    let tokenHere = await messaging().getToken();
    return tokenHere

  } catch (error) {
    return "no.token.found";
  }

}

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getFcmToken()
  }
}

export async function getDeviceUniqueId() {
  try {
    return await getUniqueId()
  } catch (error) {
    return false
  }
}