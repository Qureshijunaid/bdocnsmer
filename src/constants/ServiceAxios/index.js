import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Platform } from 'react-native';

import {
    getUserAccessTokenFromStorage, getUserRefreshTokenFromStorage,
    setUserAccessTokenToStorage, setUserRefreshTokenToStorage
} from "../../utils/asyncstorage"
import store from '../../store';
import { logOut, sessionExpiredLogout } from '../../actions/auth';
const axiosInstance = axios.create({
    //baseURL: process.env.VUE_APP_ROOT_API,
    //timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
        'version': Platform.OS === "ios" ? "1.4.9" : "1.5.9",
        'platform': Platform.OS === "ios" ? "iOS" : "android"
    },
});

axiosInstance.interceptors.request.use(
    async function (config) {
        const token = await getUserAccessTokenFromStorage();
        if (token) {
            config.headers.Authorization = `${token}`;
        }
        console.log("config", config);
        return config;
    },
);

axiosInstance.interceptors.response.use(
    async function (result) {
        let apiName = result.config.url.split("/")
        console.log(`result ${apiName[apiName.length - 1]}`, result);
        return result
    },
    async function (error) {
        const originalConfig = error.config;
        let apiName = error.response.config.url.split("/")
        console.log(`error ${apiName[apiName.length - 1]}`, error.response);
        if (error.response.status === 401) {

            originalConfig._retry = true;

            let refreshToken = await getUserRefreshTokenFromStorage()
            try {
                let response = await axios({
                    method: 'post',
                    //url: `https://stagapi.bando-app.com/v1/consumer/refreshTokenVerify`,
                    url: `https://bando-app.com/v1/consumer/refreshTokenVerify`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        refreshToken: refreshToken
                    }
                })
                if (response.status === 401) {
                    store.dispatch(sessionExpiredLogout())
                    return Promise.reject("Session expired. Please login.")
                } else {
                    setUserAccessTokenToStorage(response.data.result.data.token)
                    setUserRefreshTokenToStorage(response.data.result.data.refreshToken)
                    axiosInstance.defaults.headers.common["Authorization"] = `${response.data.result.data.token}`;
                    const result = axiosInstance(originalConfig);
                    return result
                }
            }
            catch (_error) {
                store.dispatch(sessionExpiredLogout())
                return Promise.reject("Session expired. Please login.")
            }
        }
        else if (error.response.status === 503) {
            return Promise.reject("Service unavailable. Please try again later")
        }
        else if (error.response.status === 403) {
            // console.log('abcvcxsadsfd');
            return Promise.reject(error.response.data.result.message);
        }
        else {
            //return Promise.reject("Session expired. Please login.")
            return Promise.reject(error.response.data.result.message);
        }
    }
)









export const GET = async (url, params) => {
    let getRes = await axiosInstance.get(
        url,
        {
            params: params
        }
    );
    if (getRes.status === 200) {
        return { data: getRes.data, status: true };
    } else {
        return { message: getRes.data.message, status: false };
    }
};



export const DELETE = async (url, body) => {
    let getRes = await axiosInstance.delete(url, { data: body });
    if (getRes.status === 200) {
        return { data: getRes.data, status: true };
    } else {
        return { message: getRes.data.message, status: false };
    }
};

export const POST = async (url, body, options) => {
    let getRes = await axiosInstance.post(url, body, options);
    if (getRes.status === 200 || getRes.status === 201) {
        return { data: getRes.data, status: true };
    } else {
        return { message: getRes.data.message, status: false };
    }
};

export const PATCH = async (url, body, options) => {
    let getRes = await axiosInstance.patch(url, body, options);
    if (getRes.status === 200 || getRes.status === 201) {
        return { data: getRes.data, status: true };
    } else {
        return { message: getRes.data.message, status: false };
    }
};

export const POST_MULTIPART = async (url, body) => {
    const token = await getUserAccessTokenFromStorage();
    let options = {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token,
        },
        method: 'POST',
        body: body
    };


    return await fetch(url, options)
        .then(response => {
            return response.json()
                .then(responseJson => {
                    return responseJson;
                });
        });


};

export const PUT = async (url, body, options) => {
    let getRes = await axiosInstance.put(url, body, options);
    if (getRes.status === 200) {
        return { data: getRes.data, status: true };
    } else {
        return { message: getRes.data.message, status: false };
    }
};
