import constants from '../../constants';
const config = {
    screens: {
        LogIn: "LogIn",
        // ResetPassword: {
        //     path: `${constants.ScreensName.ResetPassword.name}/:id`,
        //     parse: {
        //         id: (id) => `${id}`,
        //     },
        // }
    },
};

const linking = {
    // prefixes: ["http://13.232.200.98:8002/v1/artist/resetPassword"],
    prefixes: ["Bando://com.app.bando"],
    config,
};

export default linking;