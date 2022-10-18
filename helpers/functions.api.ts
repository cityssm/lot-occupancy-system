import fs from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";

import Debug from "debug";

import * as recordTypes from "../types/recordTypes";

const debug = Debug("lot-occupancy-system:functions.api");

const apiKeyPath = "data/apiKeys.json";
let apiKeys: { [userName: string]: string };

const loadApiKeys = async () => {
    try {
        const fileData = await fs.readFile(apiKeyPath, "utf8");
        apiKeys = JSON.parse(fileData);
    } catch (error) {
        debug(error);
        apiKeys = {};
    }
};

const saveApiKeys = async () => {
    try {
        await fs.writeFile(apiKeyPath, JSON.stringify(apiKeys), "utf8");
    } catch (error) {
        debug(error);
    }
};

const generateApiKey = (apiKeyPrefix: string) => {
    return apiKeyPrefix + "-" + uuidv4() + "-" + Date.now();
};

export const regenerateApiKey = async (userName: string) => {
    apiKeys[userName] = generateApiKey(userName);
    await saveApiKeys();
};

export const getApiKey = async (userName: string) => {
    if (!apiKeys) {
        await loadApiKeys();
    }

    if (!apiKeys[userName]) {
        await regenerateApiKey(userName);
    }

    return apiKeys[userName];
};

export const getApiKeyFromSession = async (session: recordTypes.PartialSession) => {
    return await getApiKey(session.user.userName);
};

export const getUserNameFromApiKey = async (apiKey: string) => {
    if (!apiKeys) {
        await loadApiKeys();
    }

    for (const [userName, currentApiKey] of Object.entries(apiKeys)) {
        if (apiKey === currentApiKey) {
            return userName;
        }
    }
};
