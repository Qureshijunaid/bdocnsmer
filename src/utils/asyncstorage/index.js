import { writeStorage, readStorage, removeAllStorage, removeStorage } from './model';

/*
 * [wipeStorage functions remove all data from local storage]
 *    
*/
export const wipeStorage = async () => {
    return new Promise(function (resolve) {
        resolve(removeAllStorage());
    });
}

/*
 * [setUserAccessToken functions set value of Token]
 * @param {value  string}   
 *    
*/
export const setUserAccessTokenToStorage = async (value) => {
    return new Promise(function (resolve) {
        resolve(writeStorage('USER_ACCESS_TOKEN', value));
    });
}


/*
 * [getUserAccessToken functions get user value from Token]  
 * @return {value}   
*/
export const getUserAccessTokenFromStorage = async () => {
    return new Promise(function (resolve) {
        resolve(readStorage('USER_ACCESS_TOKEN'));
    });
}


/*
 * [setUserVerification functions set user verified value]
 * @param {value  string}   
 *    
*/
export const setUserVerification = async (value) => {
    return new Promise(function (resolve) {
        resolve(writeStorage('USER_VERIFICATION', value));
    });
}


/*
 * [getUserVerification functions get user varified value]
 * @return {value}   
*/
export const getUserVerification = async () => {
    return new Promise(function (resolve) {
        resolve(readStorage('USER_VERIFICATION'));
    });
}


/*
 * [setUser functions set value of Token]
 * @param {value  string}   
 *    
*/
export const setUserEmailToStorage = async (value) => {
    return new Promise(function (resolve) {
        resolve(writeStorage('USER_EMAIL', value));
    });
}


/*
 * [getUser functions get user value from Token]  
 * @return {value}   
*/
export const getUserEmailFromStorage = async () => {
    return new Promise(function (resolve) {
        resolve(readStorage('USER_EMAIL'));
    });
}


/*
 * [setUser functions set value of Token]
 * @param {value  string}   
 *    
*/
export const setUserToStorage = async (value) => {
    return new Promise(function (resolve) {
        resolve(writeStorage('USER', value));
    });
}


/*
 * [getUser functions get user value from Token]  
 * @return {value}   
*/
export const getUserFromStorage = async () => {
    return new Promise(function (resolve) {
        resolve(readStorage('USER'));
    });
}




/*
 * [setUserFCMTokenToStorage functions set value of Token]
 * @param {value  string}   
 *    
*/
export const setUserFCMTokenToStorage = async (value) => {
    return new Promise(function (resolve) {
        resolve(writeStorage('FCM_TOKEN', value));
    });
}


/*
 * [getUserFCMTokenFromStorage functions get user value from Token]  
 * @return {value}   
*/
export const getUserFCMTokenFromStorage = async () => {
    return new Promise(function (resolve) {
        resolve(readStorage('FCM_TOKEN'));
    });
}


/*
 * [setArtistDetail functions set value of Token]
 * @param {value  string}   
 *    
*/

export const setArtistDetailToStorage = async (value) => {
    return new Promise(function (resolve) {
        resolve(writeStorage('Artist_Details', value));
    });
}


/*
 * [getUser functions get user value from Token]  
 * @return {value}   
*/
export const getArtistDetailToStorage = async () => {
    return new Promise(function (resolve) {
        resolve(readStorage('Artist_Details'));
    });
}


export const setLastCachedClearedTime = async (value) => {
    return new Promise(function (resolve) {
        resolve(writeStorage('LAST_CACHED_TIME', value));
    });
}


/*
 * [getUser functions get user value from Token]  
 * @return {value}   
*/
export const getLastCachedClearedTime = async () => {
    return new Promise(function (resolve) {
        resolve(readStorage('LAST_CACHED_TIME'));
    });
}


export const setUserRefreshTokenToStorage = async (value) => {
    return new Promise(function (resolve) {
        resolve(writeStorage('USER_REFRESH_TOKEN', value));
    });
}


/*
 * [getUserAccessToken functions get user value from Token]  
 * @return {value}   
*/
export const getUserRefreshTokenFromStorage = async () => {
    return new Promise(function (resolve) {
        resolve(readStorage('USER_REFRESH_TOKEN'));
    });
}


export const setUserAccessTokenUpdateTime = async (value) => {
    console.log("setUserAccessTokenUpdateTime", value);
    return new Promise(function (resolve) {
        resolve(writeStorage('USER_UPDATE_ACCESS_TOKEN_TIME', value));
    });
}


/*
 * [getUserAccessToken functions get user value from Token]  
 * @return {value}   
*/
export const getUserAccessTokenUpdateTime = async () => {
    return new Promise(function (resolve) {
        resolve(readStorage('USER_UPDATE_ACCESS_TOKEN_TIME'));
    });
}
