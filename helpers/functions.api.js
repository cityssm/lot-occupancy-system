import fs from "node:fs/promises";
import crypto from "node:crypto";
import Debug from "debug";
const debug = Debug("lot-occupancy-system:functions.api");
const apiKeyPath = "data/apiKeys.json";
let apiKeys;
const loadApiKeys = async () => {
    try {
        const fileData = await fs.readFile(apiKeyPath, "utf8");
        apiKeys = JSON.parse(fileData);
    }
    catch (error) {
        debug(error);
        apiKeys = {};
    }
};
const saveApiKeys = async () => {
    try {
        await fs.writeFile(apiKeyPath, JSON.stringify(apiKeys), "utf8");
    }
    catch (error) {
        debug(error);
    }
};
const generateApiKey = (apiKeyPrefix) => {
    return apiKeyPrefix + "-" + crypto.randomUUID() + "-" + Date.now();
};
export const regenerateApiKey = async (userName) => {
    apiKeys[userName] = generateApiKey(userName);
    await saveApiKeys();
};
export const getApiKey = async (userName) => {
    if (!apiKeys) {
        await loadApiKeys();
    }
    if (!apiKeys[userName]) {
        await regenerateApiKey(userName);
    }
    return apiKeys[userName];
};
export const getApiKeyFromSession = async (session) => {
    return await getApiKey(session.user.userName);
};
