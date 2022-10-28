import type { User } from "../types/recordTypes";
export interface UserRequest {
    session?: {
        user?: User;
    };
}
export interface APIRequest {
    params?: {
        apiKey?: string;
    };
}
export declare const userIsAdmin: (request: UserRequest) => boolean;
export declare const userCanUpdate: (request: UserRequest) => boolean;
export declare const apiKeyIsValid: (request: APIRequest) => Promise<boolean>;
