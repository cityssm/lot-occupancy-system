import { getUserNameFromApiKey } from "./functions.api.js";
import * as configFunctions from "./functions.config.js";
export const userIsAdmin = (request) => {
    var _a;
    const user = (_a = request.session) === null || _a === void 0 ? void 0 : _a.user;
    if (!user) {
        return false;
    }
    return user.userProperties.isAdmin;
};
export const userCanUpdate = (request) => {
    var _a;
    const user = (_a = request.session) === null || _a === void 0 ? void 0 : _a.user;
    if (!user) {
        return false;
    }
    return user.userProperties.canUpdate;
};
export const apiKeyIsValid = async (request) => {
    const apiKey = request.params.apiKey;
    if (!apiKey) {
        return false;
    }
    const userName = await getUserNameFromApiKey(apiKey);
    if (!userName) {
        return false;
    }
    const canLogin = configFunctions
        .getProperty("users.canLogin")
        .some((currentUserName) => {
        return userName === currentUserName.toLowerCase();
    });
    return canLogin;
};
