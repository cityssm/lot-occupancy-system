import { getUserNameFromApiKey } from "./functions.api.js";
import * as configFunctions from "./functions.config.js";
export function userIsAdmin(request) {
    const user = request.session?.user;
    if (!user || !user.userProperties) {
        return false;
    }
    return user.userProperties.isAdmin;
}
export function userCanUpdate(request) {
    const user = request.session?.user;
    if (!user || !user.userProperties) {
        return false;
    }
    return user.userProperties.canUpdate;
}
export async function apiKeyIsValid(request) {
    const apiKey = request.params?.apiKey;
    if (!apiKey) {
        return false;
    }
    const userName = await getUserNameFromApiKey(apiKey);
    if (!userName) {
        return false;
    }
    const canLogin = configFunctions.getProperty("users.canLogin").some((currentUserName) => {
        return userName === currentUserName.toLowerCase();
    });
    return canLogin;
}
