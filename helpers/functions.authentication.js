import * as configFunctions from "./functions.config.js";
import ActiveDirectory from "activedirectory2";
const userDomain = configFunctions.getProperty("application.userDomain");
const activeDirectoryConfig = configFunctions.getProperty("activeDirectory");
async function authenticateViaActiveDirectory(userName, password) {
    return new Promise((resolve) => {
        try {
            const ad = new ActiveDirectory(activeDirectoryConfig);
            ad.authenticate(userDomain + "\\" + userName, password, async (error, auth) => {
                if (error) {
                    resolve(false);
                }
                resolve(auth);
            });
        }
        catch {
            resolve(false);
        }
    });
}
export async function authenticate(userName, password) {
    if (!userName || userName === "" || !password || password === "") {
        return false;
    }
    return await authenticateViaActiveDirectory(userName, password);
}
const safeRedirects = new Set([
    "/admin/cleanup",
    "/admin/fees",
    "/admin/lottypes",
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
export function getSafeRedirectURL(possibleRedirectURL = "") {
    const urlPrefix = configFunctions.getProperty("reverseProxy.urlPrefix");
    if (typeof possibleRedirectURL === "string") {
        const urlToCheck = possibleRedirectURL.startsWith(urlPrefix)
            ? possibleRedirectURL.slice(urlPrefix.length)
            : possibleRedirectURL;
        const urlToCheckLowerCase = urlToCheck.toLowerCase();
        if (safeRedirects.has(urlToCheckLowerCase) ||
            /^(\/maps\/)\d+(\/edit)?$/.test(urlToCheckLowerCase) ||
            /^(\/lots\/)\d+(\/edit)?$/.test(urlToCheckLowerCase) ||
            /^(\/lotoccupancies\/)\d+(\/edit)?$/.test(urlToCheckLowerCase) ||
            /^(\/workorders\/)\d+(\/edit)?$/.test(urlToCheckLowerCase) ||
            /^\/print\/(pdf|screen)\/[\d/=?A-Za-z-]+$/.test(urlToCheck)) {
            return urlPrefix + urlToCheck;
        }
    }
    return urlPrefix + "/dashboard";
}
