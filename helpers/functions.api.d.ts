import './polyfills.js';
import type * as recordTypes from '../types/recordTypes';
export declare function regenerateApiKey(userName: string): Promise<void>;
export declare function getApiKey(userName: string): Promise<string>;
export declare function getApiKeyFromSession(session: recordTypes.PartialSession): Promise<string>;
export declare function getUserNameFromApiKey(apiKey: string): Promise<string | undefined>;
