import AsyncStorage from '@react-native-community/async-storage';

/*
 * [writeStorage functions add data to storage]
 * @param {key  string}   
 * @param {value  string}   
*/
export const writeStorage = async function (key, value) {
    if (key && value) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
            return value;
        } catch (e) {
            return e;
        }
    } else {
        return 'key or value not assigned';
    }
}


/*
 * [readStorage functions read data from storage by there key]
 * @param {key  string}   
 * @return {value}   
*/
export const readStorage = async function (key) {
    if (key) {
        try {
            const value = await AsyncStorage.getItem(key);
            return JSON.parse(value);
        } catch (e) {
            return e;
        }
    } else {
        return 'key not assigned';
    }
}

/*
 * [removeAllStorage functions wipe all data from the storage]  
*/
export const removeAllStorage = async () => {
    try {
        const value = await AsyncStorage.clear();
        return value;
    } catch (e) {
        return e;
    }
};


/*
 * [removeStorage functions wipe all data from the storage from specific @Key]  
*/

export const removeStorage = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    }
    catch (exception) {
        return false;
    }
}