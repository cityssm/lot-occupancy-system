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
    lotCount?: number;
}
export interface LotType extends Record {
    lotTypeId?: number;
    lotType?: string;
    orderNumber?: number;
    lotTypeStatuses?: LotTypeStatus[];
    lotTypeFields?: LotTypeField[];
}
export interface LotTypeField extends Record {
    lotTypeFieldId?: number;
    lotTypeField?: string;
    lotTypeId?: number;
    lotType: LotType;
    lotTypeFieldValues?: string;
    isRequired?: boolean;
    pattern?: string;
    minimumLength?: number;
    maximumLength?: number;
    orderNumber?: number;
}
export interface LotTypeStatus extends Record {
    lotTypeStatusId?: number;
    lotTypeId?: number;
    lotTypeStatus?: string;
    orderNumber?: number;
}
export interface Lot extends Record {
    lotId?: number;
    lotName?: string;
    lotTypeId?: number;
    lotType?: LotType;
    mapId?: number;
    map?: Map;
    mapKey?: string;
    lotLatitude?: number;
    lotLongitude?: number;
    lotTypeStatusId?: number;
    lotTypeStatus?: LotTypeStatus;
}
export interface Occupant extends Record {
    occupantId?: number;
    occupantName?: string;
    occupantAddress1?: string;
    occupantAddress2?: string;
    occupantCity?: string;
    occupantProvince?: string;
    occupantPostalCode?: string;
    occupantPhoneNumber?: string;
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
export interface PartialSession {
    user: User;
}
