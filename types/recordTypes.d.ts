export interface Record {
    recordCreate_userName?: string;
    recordCreate_timeMillis?: number;
    recordCreate_dateString?: string;
    recordUpdate_userName?: string;
    recordUpdate_timeMillis?: number;
    recordUpdate_dateString?: string;
    recordUpdate_timeString?: string;
    recordDelete_userName?: string;
    recordDelete_timeMillis?: number;
    recordDelete_dateString?: string;
}
export interface Map extends Record {
    mapId?: number;
    mapName?: string;
    mapDescription?: string;
    mapLatitude?: number;
    mapLongitude?: number;
    mapSVG?: string;
    mapAddress1?: string;
    mapAddress2?: string;
    mapCity?: string;
    mapProvince?: string;
    mapPostalCode?: string;
    mapPhoneNumber?: string;
}
export interface User {
    userName: string;
    userProperties?: UserProperties;
}
export interface UserProperties {
    canUpdate: boolean;
    isAdmin: boolean;
}
declare module "express-session" {
    interface Session {
        user: User;
    }
}
