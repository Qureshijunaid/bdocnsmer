import React, { useEffect, useState } from 'react';
import { Platform, Linking, NativeEventEmitter, NativeModules } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { connect, Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import DeviceInfo from 'react-native-device-info';
import { LogBox } from 'react-native';
import stripe from 'tipsi-stripe';
import Orientation from 'react-native-orientation-locker';
import RNPreventScreenshot from 'react-native-screenshot-prevent';
import {
	addScreenshotListener,
	removeScreenshotListener,
} from 'react-native-detector';

import AuthStack from './src/navigation/auth';
import AppStack from './src/navigation/AppStack';
import SplashStack from './src/navigation/splash';
import store from './src/store';
import { setUserFCMTokenToStorage } from './src/utils/asyncstorage';
import { navigationRef } from './src/navigation/NavigationService';
import * as NavigationService from './src/navigation/NavigationService';
import { switchRoute } from './src/actions/auth';
import {
	setArtistID,
	getArtistDetail, setArtistDetailFromApp, getArtistDetailHomePage
} from './src/actions/profile';
import { getNotification, viewNotification } from './src/actions/home';
import { getPostDetail, getReplyList, setSelectedPost } from './src/actions/post';
import {
	getArtistDetailToStorage,
	getUserAccessTokenFromStorage
} from './src/utils/asyncstorage';
import messaging from '@react-native-firebase/messaging';
import constants from './src/constants';
import { deleteCachePeriodically } from './src/utils/DownloadVideo';
import { getMerchDetails } from "./src/actions/merch";
import {
	getSubcribedArtistList,
	getSubcribedArtistChatList,
} from './src/actions/chat';
import ScreenCapturing from "./src/screens/ScreenCapturing";
import { screenShotTaken } from "./src/actions/screenshot";

LogBox.ignoreAllLogs();
stripe.setOptions({
	publishableKey: constants.AppConstant.stripePro,
});

export function App(props) {
	const [isRecording, setIsRecording] = useState(false)
	const isRecordingMsg = "The Bando's security policy capturing/recording a content is not allowed."
	const requestUserPermission = async () => {
		const authStatus = await messaging().requestPermission();
		const enabled =
			authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
			authStatus === messaging.AuthorizationStatus.PROVISIONAL;
		if (enabled) {
			getFcmToken();
		}
	};

	const getFcmToken = async () => {
		const fcmToken = await messaging().getToken().then((fcmToken) => {
			setUserFCMTokenToStorage(fcmToken)
		}

		).catch((error) => {

		}
		);

	};

	const getArtistDetailForLocal = async () => {
		getArtistDetailToStorage().then((resultFromGetArtistDetail) => {
			props.dispatch(setArtistDetailFromApp(resultFromGetArtistDetail))

		}).catch((error) => {

		})
	}

	useEffect(() => {
		handleUseEffect()
	}, [])

	const handleUseEffect = () => {
		deleteCachePeriodically()
		requestUserPermission()
		getArtistDetailForLocal()
		messaging().onNotificationOpenedApp(remoteMessage => {
			console.log("remoteMessage onNotificationOpenedApp", remoteMessage)
			props.dispatch(setArtistID(remoteMessage.data.artistId))
			if (remoteMessage.data.notificationType === "5") {
				const parentId = remoteMessage.data.parent_id
				props.dispatch(viewNotification(remoteMessage.data._id, parentId))
			} else {
				props.dispatch(viewNotification(remoteMessage.data._id))
			}

			if (remoteMessage.data.notificationType === "2") { //audio
				let updatedPostData = {
					...remoteMessage.data,
					likes: JSON.parse(remoteMessage.data.likes),
					comments: JSON.parse(remoteMessage.data.comments),
					merchandise: JSON.parse(remoteMessage.data.merchandise)
				}
				console.log("updatedPostData of push notification", updatedPostData);
				setTimeout(() => {
					handleShowPostDetails(updatedPostData, updatedPostData.artistId)
				}, 2000)
				return 1
			}

			if (remoteMessage.data.notificationType === "3") { //video
				let updatedPostData = {
					...remoteMessage.data,
					likes: JSON.parse(remoteMessage.data.likes),
					comments: JSON.parse(remoteMessage.data.comments),
					merchandise: JSON.parse(remoteMessage.data.merchandise)
				}
				console.log("updatedPostData of push notification", updatedPostData);
				setTimeout(() => {
					handleShowPostDetails(updatedPostData, updatedPostData.artistId)
				}, 2000)
				return 1
			}

			if (remoteMessage.data.notificationType === "4") { //image
				let updatedPostData = {
					...remoteMessage.data,
					likes: JSON.parse(remoteMessage.data.likes),
					comments: JSON.parse(remoteMessage.data.comments),
					merchandise: JSON.parse(remoteMessage.data.merchandise)
				}
				console.log("updatedPostData of push notification", updatedPostData);
				setTimeout(() => {
					handleShowPostDetails(updatedPostData, updatedPostData.artistId)
				}, 2000)
				return 1
			}

			if (remoteMessage.data.notificationType === "5") {
				const payload = {
					comment_id: remoteMessage.data.parent_id
				}
				props.dispatch(getReplyList(payload))
				setTimeout(() => {
					NavigationService.navigate(constants.ScreensName.ReplyNotification.name, { notificationData: remoteMessage.data })
				}, 2000)
				return 1
			}
			if (remoteMessage.data.notificationType === "6") {
				setTimeout(() => {
					props.dispatch(getMerchDetails(remoteMessage.data._id, (merchDetails) => {
						if (!!merchDetails) {
							const payloadForMerch = {
								ArtistId: merchDetails.ArtistId,
								artistId: merchDetails.artistId,
								artistName: merchDetails.artistName,
								artistProfileImage: merchDetails.artistProfileImage,
								createdAt: merchDetails.createdAt,
								height: merchDetails.height,
								images: JSON.stringify(merchDetails.images),
								merch_details: JSON.stringify(merchDetails.merch_details),
								notificationType: 6,
								price_details: JSON.stringify(merchDetails.price_details),
								status: merchDetails.status,
								updatedAt: merchDetails.updatedAt,
								width: merchDetails.width,
								_id: merchDetails._id
							}
							NavigationService.navigate(constants.ScreensName.MerchNotification.name, { notificationData: payloadForMerch })
						}
					}))
					//NavigationService.navigate(constants.ScreensName.MerchNotification.name, { notificationData: remoteMessage.data })
				}, 2000)
				return 1

			}
			if (remoteMessage.data.notificationType === "13") {
				props.dispatch(setArtistID(remoteMessage.data._id))

				setTimeout(() => {
					props.dispatch(getArtistDetail("homeArtistDetail"))
				}, 2000)
				return 1

			}
			if (remoteMessage.data.notificationType === "17") {
				setTimeout(() => {
					if (Platform.OS === "ios") {
						Linking.openURL(constants.AppConstant.iOSAppURL)
					} else {
						Linking.openURL(constants.AppConstant.androidAppURL)
					}
					props.dispatch(viewNotification(remoteMessage.data._id, "", "17"))
				}, 2000)
				return 1
			}
			if (remoteMessage.data.notificationType === "18") {
				setTimeout(() => {
					let payload = {
						"pageNumber": 1
					}
					props.dispatch(getSubcribedArtistChatList(payload))
					props.dispatch(getSubcribedArtistList(payload))
					props.dispatch(viewNotification(remoteMessage.data._id, "", "18"))
					NavigationService.navigate("ChatTab")
				}, 2000)
				return 1
			}
		})

		messaging().getInitialNotification().then(handleSelected).catch((error) => {

		});

		messaging().onMessage(remoteMessage => {
			let data = {
				"pageNumber": 1,
				"isRead": false,
			}
			props.dispatch(getNotification(data))
		})


		Linking.getInitialURL()
			.then(url => {
				console.log("opening link", url);
				if (url === null) {
				} else {
					navigate(url)
				}
			})
			.catch(err => {
			});

		Linking.addEventListener("url", handleOpenURL);
		setTimeout(() => {
			props.dispatch(switchRoute());
		}, 2000);
		RNPreventScreenshot.enabled(true);
		Orientation.lockToPortrait()
		if (Platform.OS === "ios") {
			handleScreenRecordiOS()
			listenScreenShotiOS()
		}
		return () => {
			removeScreenshotListener;
		};
	}

	const handleSelected = async remoteMessage => {
		console.log("remoteMessageremoteMessage===> handleSelected", remoteMessage)
		if (remoteMessage.data.notificationType === "5") {
			const parentId = remoteMessage.data.parent_id
			props.dispatch(viewNotification(remoteMessage.data._id, parentId))
		} else {
			props.dispatch(viewNotification(remoteMessage.data._id))
		}

		props.dispatch(setArtistID(remoteMessage.data.artistId))

		if (remoteMessage.data.notificationType === "2") {
			setTimeout(() => {
				let updatedPostData = {
					...remoteMessage.data,
					likes: JSON.parse(remoteMessage.data.likes),
					comments: JSON.parse(remoteMessage.data.comments),
					merchandise: JSON.parse(remoteMessage.data.merchandise)
				}
				handleShowPostDetails(updatedPostData, updatedPostData.artistId)
			}, 2000)
			return 1
		}
		if (remoteMessage.data.notificationType === "3") {
			setTimeout(() => {
				let updatedPostData = {
					...remoteMessage.data,
					likes: JSON.parse(remoteMessage.data.likes),
					comments: JSON.parse(remoteMessage.data.comments),
					merchandise: JSON.parse(remoteMessage.data.merchandise)
				}
				handleShowPostDetails(updatedPostData, updatedPostData.artistId)
			}, 2000)
			return 1
		}
		if (remoteMessage.data.notificationType === "4") {
			setTimeout(() => {
				let updatedPostData = {
					...remoteMessage.data,
					likes: JSON.parse(remoteMessage.data.likes),
					comments: JSON.parse(remoteMessage.data.comments),
					merchandise: JSON.parse(remoteMessage.data.merchandise)
				}
				handleShowPostDetails(updatedPostData, updatedPostData.artistId)
			}, 2000)
			return 1
		}

		if (remoteMessage.data.notificationType === "5") {
			const payload = {
				comment_id: remoteMessage.data.parent_id
			}
			props.dispatch(getReplyList(payload))
			setTimeout(() => {
				NavigationService.navigate(constants.ScreensName.ReplyNotification.name, { notificationData: remoteMessage.data })
			}, 2000)
			return 1
		}
		if (remoteMessage.data.notificationType === "6") {
			setTimeout(() => {
				props.dispatch(getMerchDetails(remoteMessage.data._id, (merchDetails) => {
					if (!!merchDetails) {
						const payloadForMerch = {
							ArtistId: merchDetails.ArtistId,
							artistId: merchDetails.artistId,
							artistName: merchDetails.artistName,
							artistProfileImage: merchDetails.artistProfileImage,
							createdAt: merchDetails.createdAt,
							height: merchDetails.height,
							images: JSON.stringify(merchDetails.images),
							merch_details: JSON.stringify(merchDetails.merch_details),
							notificationType: 6,
							price_details: JSON.stringify(merchDetails.price_details),
							status: merchDetails.status,
							updatedAt: merchDetails.updatedAt,
							width: merchDetails.width,
							_id: merchDetails._id
						}
						NavigationService.navigate(constants.ScreensName.MerchNotification.name, { notificationData: payloadForMerch })
					}
				}))
				//NavigationService.navigate(constants.ScreensName.MerchNotification.name, { notificationData: remoteMessage.data })
			}, 2000)
			return 1

		}
		if (remoteMessage.data.notificationType === "13") {
			props.dispatch(setArtistID(remoteMessage.data._id))

			setTimeout(() => {
				props.dispatch(getArtistDetail("homeArtistDetail"))
			}, 2000)
			return 1
		}
		if (remoteMessage.data.notificationType === "17") {
			setTimeout(() => {
				if (Platform.OS === "ios") {
					Linking.openURL(constants.AppConstant.iOSAppURL)
				} else {
					Linking.openURL(constants.AppConstant.androidAppURL)
				}
				props.dispatch(viewNotification(remoteMessage.data._id, "", "17"))
			}, 2000)
			return 1
		}
		if (remoteMessage.data.notificationType === "18") {
			setTimeout(() => {
				let payload = {
					"pageNumber": 1
				}
				props.dispatch(getSubcribedArtistChatList(payload))
				props.dispatch(getSubcribedArtistList(payload))
				props.dispatch(viewNotification(remoteMessage.data._id, "", "18"))
				NavigationService.navigate("ChatTab")
			}, 2000)
			return 1
		}
	};

	const handleOpenURL = (event) => {
		console.log("handleOpenURL====>", event)
		if (event.url === null) {
		} else {
			navigate(event.url)
		}
	};

	const navigate = async (url) => {
		if (Platform.OS == 'ios') {
			const whereToNavigate = url.split("/")[3];
			console.log("whereToNavigate===>", whereToNavigate)
			const token = url.split("/")[4];

			if (whereToNavigate === constants.ScreensName.ResetPassword.name) {
				setTimeout(() => {
					NavigationService.navigate(constants.ScreensName.ResetPassword.name, { resetToken: token })
				}, 1000)
			}
			else if (whereToNavigate === "SharePost") {
				getUserAccessTokenFromStorage().then(accessToken => {
					let payload = {
						"post_id": token
					}
					props.dispatch(getPostDetail(payload))
				}).catch(err => {
				})
			}
			else if (whereToNavigate === "ShareProfile") {
				getUserAccessTokenFromStorage().then(accessToken => {
					props.dispatch(setArtistID(token))
					setTimeout(() => {
						props.dispatch(getArtistDetail("homeArtistDetail"))
					}, 1200)
					//props.dispatch(getArtistDetail("homeArtistDetail"))
				}).catch(err => {
				})

			}

		} else if (Platform.OS == "android") {
			const whereToNavigate = url.split("/")[5];
			const token = url.split("/")[6];
			console.log("whereToNavigate", whereToNavigate, token);
			if (whereToNavigate === "setPassword") {
				setTimeout(() => {
					NavigationService.navigate(constants.ScreensName.ResetPassword.name, { resetToken: token })
				}, 1000)
			}

			else if (whereToNavigate === "sharePost") {
				getUserAccessTokenFromStorage().then(accessToken => {
					let payload = {
						"post_id": token
					}
					props.dispatch(getPostDetail(payload))
				}).catch(err => {
				})
			}
			else if (whereToNavigate === "shareProfile") {
				getUserAccessTokenFromStorage().then(accessToken => {
					props.dispatch(setArtistID(token))
					setTimeout(() => {
						props.dispatch(getArtistDetail("homeArtistDetail"))
					}, 1200)
				}).catch(err => {
				})

			}

		}
	};

	const handleShowPostDetails = (item, artistId) => {
		props.dispatch(setArtistID(artistId))
		props.dispatch(getArtistDetailHomePage(artistId, false, item))
		const payloadForSetSeletcedPost = {
			"post_id": item._id,
			"post_data": item
		}
		props.dispatch(setSelectedPost(payloadForSetSeletcedPost))
	}

	const handleScreenRecordiOS = () => {
		console.log("handleScreenRecordiOS")
		let bridge = new NativeEventEmitter(NativeModules.ScreenCaptureNotification);

		const screenCaptureEnabled = bridge.addListener("isScreenCaptureEnabled", async res => {
			if (res?.value) {
				console.log("isScreenCaptureEnabled")
				const token = await getToken()
				if (token != null && token != undefined) {
					props.dispatch(screenShotTaken())
				}
				setIsRecording(true)
			}
		})
		const ScreenRecorderDetect = NativeModules.ScreenRecorderDetect;
		try {
			ScreenRecorderDetect.get().then(async isRecord => {
				if (isRecord === "YES") {
					console.log("isRecord", isRecord)
					const token = await getToken()
					if (token != null && token != undefined) {
						props.dispatch(screenShotTaken())
					}
					setIsRecording(true)
				}
			});
		} catch (e) {
			console.error("handleScreenRecordiOS", e);
		}
	}

	const listenScreenShotiOS = () => {
		addScreenshotListener(userDidScreenshot);
	}

	const getToken = async () => {
		const token = await getUserAccessTokenFromStorage();
		if (token) {
			return token
		}
		else {
			return null
		}
	}

	const userDidScreenshot = async () => {
		console.log("userDidScreenshot")

		
		const token = await getToken()
		// console.log("token=====>", token)
		if (token != null && token != undefined) {
			props.dispatch(screenShotTaken())
		}
		setIsRecording(true)//will handle iOS screenshot only and send feedback to admin
	};

	return (
		<NavigationContainer ref={navigationRef}>
			{
				isRecording ?
					<ScreenCapturing recordingMsg={isRecordingMsg} />
					:
					(
						props.auth.isAppLoading ?
							<SplashStack />
							:
							(
								props.auth.accessToken ?
									<AppStack />
									:
									<AuthStack />
							)
					)
			}
		</NavigationContainer>
	);
};

function mapStateToProps(state) {
	const { app, auth, home, post,
		profile } = state
	return {
		app,
		auth, home, post,
		profile
	}
}

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	}
}

const Switching = connect(
	mapStateToProps,
	mapDispatchToProps
)(App)

export default function Root() {
	return (
		<Provider store={store}>
			<Switching />
			<Toast
				ref={(ref) => Toast.setRef(ref)}
				topOffset={DeviceInfo.hasNotch() ? 44 : 20}
			/>
		</Provider>
	)
}