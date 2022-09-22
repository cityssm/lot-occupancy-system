import * as configFunctions from "./functions.config.js";

import ActiveDirectory from "activedirectory2";

const userDomain = configFunctions.getProperty("application.userDomain");

const activeDirectoryConfig = configFunctions.getProperty("activeDirectory");

const authenticateViaActiveDirectory = async (
    userName: string,
    password: string
): Promise<boolean> => {
    return new Promise((resolve) => {
        try {
            const ad = new ActiveDirectory(activeDirectoryConfig);

            ad.authenticate(
                userDomain + "\\" + userName,
                password,
                async (error, auth) => {
                    if (error) {
                        resolve(false);
                    }

                    resolve(auth);
                }
            );
        } catch {
            resolve(false);
        }
    });
};

export const authenticate = async (
    userName: string,
    password: string
): Promise<boolean> => {
    if (!userName || userName === "" || !password || password === "") {
        return false;
    }

    return await authenticateViaActiveDirectory(userName, password);
};


const safeRedirects = new Set([
    "/admin/cleanup",
    "/admin/fees",
    "/admin/occupancytypes",
    "/admin/tables",
    "/lotoccupancies",
    "/lotoccupancies/new",
    "/lots",
    "/lots/new",
    "/maps",
    "/maps/new",
    "/workorders",
    "/workorders/new",
    "/workorders/milestonecalendar",
    "/workorders/outlook",
    "/reports"
]);

export const getSafeRedirectURL = (possibleRedirectURL = "") => {
    const urlPrefix = configFunctions.getProperty("reverseProxy.urlPrefix");

    if (typeof possibleRedirectURL === "string") {
        const urlToCheck = (
            possibleRedirectURL.startsWith(urlPrefix)
                ? possibleRedirectURL.slice(urlPrefix.length)
                : possibleRedirectURL
        ).toLowerCase();

        if (
            safeRedirects.has(urlToCheck) ||
            /^(\/maps\/)\d+(\/edit)?$/.test(urlToCheck) ||
            /^(\/lots\/)\d+(\/edit)?$/.test(urlToCheck) ||
            /^(\/lotoccupancies\/)\d+(\/edit)?$/.test(urlToCheck) ||
            /^(\/workorders\/)\d+(\/edit)?$/.test(urlToCheck)
        ) {
            return urlPrefix + urlToCheck;
        }
    }

    return urlPrefix + "/dashboard";
};
