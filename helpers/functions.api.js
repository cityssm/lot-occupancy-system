import fs from 'node:fs/promises';
import Debug from 'debug';
import { v4 as uuidV4 } from 'uuid';
const debug = Debug('lot-occupancy-system:functions.api');
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
    return `${apiKeyPrefix}-${uuidV4()}-${Date.now().toString()}`;
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
export async function getApiKeyFromUser(user) {
    return await getApiKey(user.userName);
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
    return undefined;
}
