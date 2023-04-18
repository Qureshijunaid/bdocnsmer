// Local Imports
import types from '../constants/Types'
import EndPoint from '../constants/EndPoint';
import { POST } from '../constants/ServiceAxios';
import config from '../utils/config';

export const screenShotTaken = () => {
    return async (dispatch) => {
        POST(`${config().accesspoint}${EndPoint.SCREENSHOT}`,
            {}).then(result => {
                dispatch({
                    type: types.SCREENSHOT_TAKEN
                })
            }).catch((err) => {
            })
    }
}
