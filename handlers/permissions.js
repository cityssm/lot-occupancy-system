import { getConfigProperty } from '../helpers/functions.config.js';
import { apiKeyIsValid, userCanUpdate, userIsAdmin } from '../helpers/functions.user.js';
const urlPrefix = getConfigProperty('reverseProxy.urlPrefix');
const forbiddenStatus = 403;
const forbiddenJSON = {
    success: false,
    message: 'Forbidden'
};
const forbiddenRedirectURL = `${urlPrefix}/dashboard/?error=accessDenied`;
export function adminGetHandler(request, response, next) {
    if (userIsAdmin(request)) {
        next();
        return;
    }
    response.redirect(forbiddenRedirectURL);
}
export function adminPostHandler(request, response, next) {
    if (userIsAdmin(request)) {
        next();
        return;
    }
    response.status(forbiddenStatus).json(forbiddenJSON);
}
export function updateGetHandler(request, response, next) {
    if (userCanUpdate(request)) {
        next();
        return;
    }
    response.redirect(forbiddenRedirectURL);
}
export function updatePostHandler(request, response, next) {
    if (userCanUpdate(request)) {
        next();
        return;
    }
    response.status(forbiddenStatus).json(forbiddenJSON);
}
export async function apiGetHandler(request, response, next) {
    if (await apiKeyIsValid(request)) {
        next();
    }
    else {
        response.redirect(`${urlPrefix}/login`);
    }
}
