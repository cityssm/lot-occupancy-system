import fs from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";

import Debug from "debug";

import * as recordTypes from "../types/recordTypes";

const debug = Debug("lot-occupancy-system:functions.api");

const apiKeyPath = "data/apiKeys.json";
let apiKeys: { [userName: string]: string };

async function loadApiKeys() {
    try {
        const fileData = await fs.readFile(apiKeyPath, "utf8");
        apiKeys = JSON.parse(fileData);
    } catch (error) {
        debug(error);
        apiKeys = {};
    }
}

async function saveApiKeys() {
    try {
        await fs.writeFile(apiKeyPath, JSON.stringify(apiKeys), "utf8");
    } catch (error) {
        debug(error);
    }
}

function generateApiKey(apiKeyPrefix: string) {
    return apiKeyPrefix + "-" + uuidv4() + "-" + Date.now();
}

export async function regenerateApiKey(userName: string) {
    apiKeys[userName] = generateApiKey(userName);
    await saveApiKeys();
}

export async function getApiKey(userName: string) {
    if (!apiKeys) {
        await loadApiKeys();
    }

    if (!apiKeys[userName]) {
        await regenerateApiKey(userName);
    }

    return apiKeys[userName];
}

export async function getApiKeyFromSession(session: recordTypes.PartialSession) {
    return await getApiKey(session.user.userName);
}

export async function getUserNameFromApiKey(apiKey: string) {
    if (!apiKeys) {
        await loadApiKeys();
    }

    for (const [userName, currentApiKey] of Object.entries(apiKeys)) {
        if (apiKey === currentApiKey) {
            return userName;
        }
    }
}
