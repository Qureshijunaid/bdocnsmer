const API_DEV_HOST = `https://devapi.bando-app.com/`;
const API_STAG_HOST = `https://stagapi.bando-app.com/`;
//const API_STAG_HOST = `https://0a83-182-73-6-242.ngrok.io/`
const API_PRO_HOST = `https://bando-app.com/`;

const Config = {
    // 0 => Devlopment env, 1 => Staging ,2 ===> Production
    APP_MODE: 2,
    DEVELOPMENT: {
        API_HOST: `${API_DEV_HOST}`,
        API_ACCESS_POINT: `${API_DEV_HOST}v1/consumer/`,
    },
    STAGING: {
        API_HOST: `${API_STAG_HOST}`,
        API_ACCESS_POINT: `${API_STAG_HOST}v1/consumer/`,
    },
    PRODUCTION: {
        API_HOST: `${API_PRO_HOST}`,
        API_ACCESS_POINT: `${API_PRO_HOST}v1/consumer/`,
    },
};

export default function getBaseUrl() {
    let config = {
        apihost: '',
        accesspoint: '',
    };

    if (Config.APP_MODE === 0) {
        config = {
            ...config,
            apihost: Config.DEVELOPMENT.API_HOST,
            accesspoint: Config.DEVELOPMENT.API_ACCESS_POINT,
        };
    }
    else if (Config.APP_MODE === 1) {
        config = {
            ...config,
            apihost: Config.STAGING.API_HOST,
            accesspoint: Config.STAGING.API_ACCESS_POINT,
        };
    }
    else {
        config = {
            ...config,
            apihost: Config.PRODUCTION.API_HOST,
            accesspoint: Config.PRODUCTION.API_ACCESS_POINT,
        };
    }

    return config;
}
