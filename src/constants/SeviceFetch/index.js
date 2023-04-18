import {
    Alert
} from 'react-native';
import constants from '../../constants';
import store from '../../store';
import { logOut } from '../../actions/auth';
import { getUserAccessTokenFromStorage } from "../../utils/asyncstorage"

export const api = async (url, method, body = null, headers = {}) => {
    try {
        const endPoint = url;
        const reqBody = body ? JSON.stringify(body) : null;
        const fetchParams = { method, headers, body };
        if ((method === "POST" || method === "PUT") && !reqBody) {
            throw new Error("Request body required");
        }
        const fetchPromise = await fetch(endPoint, fetchParams);
        return fetchPromise;
    } catch (e) {
        return e;
    }
}

export const fetchApi = async (endPoint, method, body, statusCode, token = null) => {
    try {
        token = await getUserAccessTokenFromStorage();
        const headers = {};
        const result = {
            token: null,
            success: false,
            response: null,
            headers: null,
            body: body,
            status: statusCode,
            endPoint: endPoint
        };

        if (token) {
            headers["Authorization"] = `${token}`;
            headers["hosturl"] = `${endPoint}`;
        }

        const reqBody = body ? JSON.stringify(body) : null;
        const fetchParams = { method, headers, body };
        if ((method === "POST" || method === "PUT") && !reqBody) {
            return result.response = { 'message': 'Invalid request' };
        }
        if (reqBody) {
            fetchParams.body = reqBody;
        }
        fetchParams.headers["Accept"] = "application/json";
        fetchParams.headers["Content-type"] = "application/json";
        const fetchPromise = await fetch(endPoint, fetchParams);
        const response = fetchPromise;

        if (response.status === statusCode) {
            if (response.headers.get("Authorization")) {
                result.token = response.headers.get("Authorization");
            }
            let responseBody;
            const responseText = await response.text();
            try {
                responseBody = JSON.parse(responseText);
            } catch (e) {
                responseBody = responseText;
            }
            result.success = true;
            result.response = responseBody;
            result.headers = headers;
            result.status = response.status;

            return result;
        } else {

            let responseBody;
            const responseText = await response.text();
            try {
                responseBody = JSON.parse(responseText);
            } catch (e) {
                responseBody = responseText;
            }

            result.success = false;
            result.status = response.status
            result.response = responseBody;
            result.headers = headers;
            if (responseBody.responseCode === 401) {
                setTimeout(() => {
                    store.dispatch(logOut())
                }, 4000);

            }
            return result;
        }
    } catch (error) {

        let result = {
            success: false,
            status: false,
            body: body,
            response: {
                message: "failed",
                result: { code: 0, message: error.message },
                status: false
            },
            headers: {},
            url: endPoint,
        }
        return result;
    }
}

