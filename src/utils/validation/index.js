import { Alert } from 'react-native'
import constants from '../../constants';
import { errorType, errorName, errorMessage } from './ErrorConstants';
const Validations = {
  RegexValidation: function (value, type) {
    var RegexError = {
      type: errorType.none,
      name: errorName.success,
      message: errorMessage.none,
    }
    switch (type) {
      case "number":
        if (constants.AppConstant.NUMBER_REGEX.test(value) === true) {
          RegexError = {
            type: errorType.none,
            name: errorName.success,
            message: errorMessage.none,
          }
        } else {
          RegexError = {
            type: errorType.inline,
            name: errorName.error,
            message: errorMessage.enter_number,
          }
        }
        break;

      case "alphabet":
        if (constants.AppConstant.FULL_NAME_REGEX.test(value) === true) {
          RegexError = {
            type: errorType.none,
            name: errorName.success,
            message: errorMessage.none,
          }
        } else {
          RegexError = {
            type: errorType.inline,
            name: errorName.error,
            message: errorMessage.enter_name,
          }
        }
        break;

      case "alphanumeric":
        if (constants.AppConstant.ALPHANUMERIC_REGEX.test(value) === true) {
          RegexError = {
            type: errorType.none,
            name: errorName.success,
            message: errorMessage.none,
          }
        } else {
          RegexError = {
            type: errorType.inline,
            name: errorName.error,
            message: errorMessage.enter_alphanumeric,
          }
        }
        break;

      case "password":
        if (constants.AppConstant.PASSWORD_REGEX.test(value) === true) {
          RegexError = {
            type: errorType.none,
            name: errorName.success,
            message: errorMessage.none,
          }
        } else {
          RegexError = {
            type: errorType.inline,
            name: errorName.error,
            message: errorMessage.enter_alphanumeric,
          }
        }
        break;

      default:
        RegexError = {
          type: errorType.none,
          name: errorName.success,
          message: errorMessage.none,
        }
    }
    return RegexError;
  }
}

export default Validations