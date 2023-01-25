import { applyPolyfills } from './polyfills.js';
import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';
import Debug from 'debug';
const debug = Debug('lot-occupancy-system:functions.api');
applyPolyfills();
const apiKeyPath = 'data/apiKeys.json';
let apiKeys;
async function loadApiKeys() {
    try {
        const fileData = await fs.readFile(apiKeyPath, 'utf8');
        apiKeys = JSON.parse(fileData);
    }
    catch (error) {
        debug(error);
        apiKeys = {};
    }
}
async function saveApiKeys() {
    try {
        await fs.writeFile(apiKeyPath, JSON.stringify(apiKeys), 'utf8');
    }
    catch (error) {
        debug(error);
    }
}
function generateApiKey(apiKeyPrefix) {
    return `${apiKeyPrefix}-${uuidv4()}-${Date.now().toString()}`;
}
export async function regenerateApiKey(userName) {
    apiKeys[userName] = generateApiKey(userName);
    await saveApiKeys();
}
export async function getApiKey(userName) {
    if (apiKeys === undefined) {
        await loadApiKeys();
    }
    if (!Object.hasOwn(apiKeys, userName)) {
        await regenerateApiKey(userName);
    }
    return apiKeys[userName];
}
export async function getApiKeyFromSession(session) {
    return await getApiKey(session.user.userName);
}
export async function getUserNameFromApiKey(apiKey) {
    if (apiKeys === undefined) {
        await loadApiKeys();
    }
    for (const [userName, currentApiKey] of Object.entries(apiKeys)) {
        if (apiKey === currentApiKey) {
            return userName;
        }
    }
}
