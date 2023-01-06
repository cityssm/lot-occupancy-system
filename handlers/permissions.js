import * as configFunctions from "../helpers/functions.config.js";
import * as userFunctions from "../helpers/functions.user.js";
const urlPrefix = configFunctions.getProperty("reverseProxy.urlPrefix");
const forbiddenStatus = 403;
const forbiddenJSON = {
    success: false,
    message: "Forbidden"
};
const forbiddenRedirectURL = urlPrefix + "/dashboard/?error=accessDenied";
export const adminGetHandler = (request, response, next) => {
    if (userFunctions.userIsAdmin(request)) {
        return next();
    }
    return response.redirect(forbiddenRedirectURL);
};
export const adminPostHandler = (request, response, next) => {
    if (userFunctions.userIsAdmin(request)) {
        return next();
    }
    return response.status(forbiddenStatus).json(forbiddenJSON);
};
export const updateGetHandler = (request, response, next) => {
    if (userFunctions.userCanUpdate(request)) {
        return next();
    }
    return response.redirect(forbiddenRedirectURL);
};
export const updatePostHandler = (request, response, next) => {
    if (userFunctions.userCanUpdate(request)) {
        return next();
    }
    return response.status(forbiddenStatus).json(forbiddenJSON);
};
export const apiGetHandler = async (request, response, next) => {
    if (await userFunctions.apiKeyIsValid(request)) {
        return next();
    }
    return response.redirect(urlPrefix + "/login");
};
