import { getUserNameFromApiKey } from './functions.api.js';
import { getConfigProperty } from './functions.config.js';
export function userIsAdmin(request) {
    return request.session?.user?.userProperties?.isAdmin ?? false;
}
export function userCanUpdate(request) {
    return request.session?.user?.userProperties?.canUpdate ?? false;
}
export async function apiKeyIsValid(request) {
    const apiKey = request.params?.apiKey;
    if (apiKey === undefined) {
        return false;
    }
    const userName = await getUserNameFromApiKey(apiKey);
    if (userName === undefined) {
        return false;
    }
    return getConfigProperty('users.canLogin').some((currentUserName) => {
        return userName === currentUserName.toLowerCase();
    });
}
