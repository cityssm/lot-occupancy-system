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
export interface LotStatus extends Record {
    lotStatusId?: number;
    lotStatus?: string;
    orderNumber?: number;
}
export interface Lot extends Record {
    lotId?: number;
    lotName?: string;
    lotTypeId?: number;
    lotType?: LotType | string;
    mapId?: number;
    mapName?: string;
    map?: Map;
    mapSVG?: string;
    mapKey?: string;
    lotLatitude?: number;
    lotLongitude?: number;
    lotStatusId?: number;
    lotStatus?: LotStatus | string;
    lotOccupancyCount?: number;
    lotOccupancies?: LotOccupancy[];
    lotComments?: LotComment[];
}
export interface LotComment extends Record {
    lotCommentId?: number;
    lotId?: number;
    lotCommentDate?: number;
    lotCommentDateString?: string;
    lotCommentTime?: number;
    lotCommentTimeString?: string;
    lotComment?: string;
}
export interface OccupancyType extends Record {
    occupancyTypeId?: number;
    occupancyType?: string;
    orderNumber?: number;
    occupancyTypeFields?: OccupancyTypeField[];
}
export interface OccupancyTypeField {
    occupancyTypeFieldId?: number;
    occupancyTypeId?: number;
    occupancyTypeField?: string;
    occupancyTypeFieldValues?: string;
    isRequired?: boolean;
    pattern?: string;
    minimumLength?: number;
    maximumLength?: number;
    orderNumber?: number;
}
export interface LotOccupantType extends Record {
    lotOccupantTypeId?: number;
    lotOccupantType?: string;
    orderNumber?: number;
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
export interface LotOccupancyOccupant extends Occupant, Record {
    lotOccupancyId?: number;
    lotOccupantIndex?: number;
    lotOccupantTypeId?: number;
    lotOccupantType?: string | LotOccupantType;
}
export interface LotOccupancyComment extends Record {
    lotOccupancyCommentId?: number;
    lotOccupancyId?: number;
    lotOccupancyCommentDate?: number;
    lotOccupancyCommentDateString?: string;
    lotOccupancyCommentTime?: number;
    lotOccupancyCommentTimeString?: string;
    lotOccupancyComment?: string;
}
export interface LotOccupancy extends Record {
    lotOccupancyId?: number;
    occupancyTypeId?: number;
    occupancyType?: OccupancyType | string;
    lotId?: number;
    lotName?: string;
    mapId?: number;
    mapName?: string;
    occupancyStartDate?: number;
    occupancyStartDateString?: string;
    occupancyEndDate?: number;
    occupancyEndDateString?: string;
    lotOccupancyComments?: LotOccupancyComment[];
    lotOccupancyOccupants?: LotOccupancyOccupant[];
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
