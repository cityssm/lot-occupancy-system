import { Router } from "express";
import * as configFunctions from "../helpers/functions.config.js";
import * as authenticationFunctions from "../helpers/functions.authentication.js";
import { useTestDatabases } from "../data/databasePaths.js";
export const router = Router();
const getSafeRedirectURL = (possibleRedirectURL = "") => {
    const urlPrefix = configFunctions.getProperty("reverseProxy.urlPrefix");
    if (typeof possibleRedirectURL === "string") {
        const urlToCheck = (possibleRedirectURL.startsWith(urlPrefix)
            ? possibleRedirectURL.slice(urlPrefix.length)
            : possibleRedirectURL).toLowerCase();
        switch (urlToCheck) {
            case "/admin/fees":
            case "/admin/occupancyTypes":
            case "/admin/tables":
            case "/lotOccupancies":
            case "/lots":
            case "/maps":
            case "/workOrders":
            case "/reports":
                return urlPrefix + urlToCheck;
        }
    }
    return urlPrefix + "/dashboard";
};
router
    .route("/")
    .get((request, response) => {
    const sessionCookieName = configFunctions.getProperty("session.cookieName");
    if (request.session.user && request.cookies[sessionCookieName]) {
        const redirectURL = getSafeRedirectURL((request.query.redirect || ""));
        response.redirect(redirectURL);
    }
    else {
        response.render("login", {
            userName: "",
            message: "",
            redirect: request.query.redirect,
            useTestDatabases
        });
    }
})
    .post(async (request, response) => {
    const userName = request.body.userName;
    const passwordPlain = request.body.password;
    const unsafeRedirectURL = request.body.redirect;
    const redirectURL = getSafeRedirectURL(typeof unsafeRedirectURL === "string" ? unsafeRedirectURL : "");
    const isAuthenticated = await authenticationFunctions.authenticate(userName, passwordPlain);
    let userObject;
    if (isAuthenticated) {
        const userNameLowerCase = userName.toLowerCase();
        const canLogin = configFunctions
            .getProperty("users.canLogin")
            .some((currentUserName) => {
            return userNameLowerCase === currentUserName.toLowerCase();
        });
        if (canLogin) {
            const canUpdate = configFunctions
                .getProperty("users.canUpdate")
                .some((currentUserName) => {
                return (userNameLowerCase === currentUserName.toLowerCase());
            });
            const isAdmin = configFunctions
                .getProperty("users.isAdmin")
                .some((currentUserName) => {
                return (userNameLowerCase === currentUserName.toLowerCase());
            });
            userObject = {
                userName: userNameLowerCase,
                userProperties: {
                    canUpdate,
                    isAdmin
                }
            };
        }
    }
    if (isAuthenticated && userObject) {
        request.session.user = userObject;
        response.redirect(redirectURL);
    }
    else {
        response.render("login", {
            userName,
            message: "Login Failed",
            redirect: redirectURL,
            useTestDatabases
        });
    }
});
export default router;
