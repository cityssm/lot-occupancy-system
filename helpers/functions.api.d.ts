import * as recordTypes from "../types/recordTypes";
export declare const regenerateApiKey: (userName: string) => Promise<void>;
export declare const getApiKey: (userName: string) => Promise<string>;
export declare const getApiKeyFromSession: (session: recordTypes.PartialSession) => Promise<string>;
