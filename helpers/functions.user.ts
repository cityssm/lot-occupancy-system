import { getUserNameFromApiKey } from "./functions.api.js";
import * as configFunctions from "./functions.config.js";

import type { Request } from "express";

export const userIsAdmin = (request: Request): boolean => {
    const user = request.session?.user;

    if (!user) {
        return false;
    }

    return user.userProperties.isAdmin;
};

export const userCanUpdate = (request: Request): boolean => {
    const user = request.session?.user;

    if (!user) {
        return false;
    }

    return user.userProperties.canUpdate;
};

export const apiKeyIsValid = async (request: Request): Promise<boolean> => {
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
