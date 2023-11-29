export declare function regenerateApiKey(userName: string): Promise<void>;
export declare function getApiKey(userName: string): Promise<string>;
export declare function getApiKeyFromUser(user: User): Promise<string>;
export declare function getUserNameFromApiKey(apiKey: string): Promise<string | undefined>;
