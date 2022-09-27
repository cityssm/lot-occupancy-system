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

/*
 * LOT OCCUPANCY DB TYPES
 */

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
    lotType?: string;

    mapId?: number;
    mapName?: string;
    map?: Map;
    mapSVG?: string;
    mapKey?: string;

    lotLatitude?: number;
    lotLongitude?: number;

    lotStatusId?: number;
    lotStatus?: string;

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

export interface FeeCategory extends Record {
    feeCategoryId?: number;
    feeCategory?: string;
    fees?: Fee[];
    orderNumber?: number;
}

export interface Fee extends Record {
    feeId?: number;

    feeCategoryId?: number;
    feeCategory?: string;

    feeName?: string;
    feeDescription?: string;

    occupancyTypeId?: number;
    occupancyType?: string;

    lotTypeId?: number;
    lotType?: string;

    includeQuantity?: boolean;
    quantityUnit?: string;

    feeAmount?: number;
    feeFunction?: string;

    taxAmount?: number;
    taxPercentage?: number;

    isRequired?: boolean;

    orderNumber?: number;
}

export interface LotOccupancyFee extends Fee, Record {
    lotOccupancyId?: number;

    feeId?: number;
    feeName?: string;

    quantity?: number;
    feeAmount?: number;
    taxAmount?: number;
}

export interface LotOccupancyTransaction extends Record {
    lotOccupancyId?: number;
    transactionIndex?: number;
    transactionDate?: number;
    transactionDateString?: string;
    transactionTime?: number;
    transactionTimeString?: string;
    transactionAmount?: number;
    externalReceiptNumber?: string;
    transactionNote?: string;
}

export interface LotOccupancyOccupant extends Record {
    lotOccupancyId?: number;
    lotOccupantIndex?: number;

    lotOccupantTypeId?: number;
    lotOccupantType?: string;

    occupantName?: string;
    occupantAddress1?: string;
    occupantAddress2?: string;
    occupantCity?: string;
    occupantProvince?: string;
    occupantPostalCode?: string;
    occupantPhoneNumber?: string;
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

export interface LotOccupancyField extends OccupancyTypeField, Record {
    lotOccupancyId?: number;
    occupancyTypeFieldId?: number;
    lotOccupancyFieldValue?: string;
}

export interface LotOccupancy extends Record {
    lotOccupancyId?: number;

    occupancyTypeId?: number;
    occupancyType?: string;

    lotId?: number;
    lotTypeId?: number;
    lotName?: string;

    mapId?: number;
    mapName?: string;

    occupancyStartDate?: number;
    occupancyStartDateString?: string;

    occupancyEndDate?: number;
    occupancyEndDateString?: string;

    lotOccupancyFields?: LotOccupancyField[];
    lotOccupancyComments?: LotOccupancyComment[];
    lotOccupancyOccupants?: LotOccupancyOccupant[];
    lotOccupancyFees?: LotOccupancyFee[];
    lotOccupancyTransactions?: LotOccupancyTransaction[];
}

/*
 * WORK ORDERS
 */

export interface WorkOrderType extends Record {
    workOrderTypeId?: number;
    workOrderType?: string;
    orderNumber?: number;
}

export interface WorkOrderMilestoneType extends Record {
    workOrderMilestoneTypeId?: number;
    workOrderMilestoneType?: string;
    orderNumber?: number;
}

export interface WorkOrderComment extends Record {
    workOrderCommentId?: number;
    workOrderId?: number;

    workOrderCommentDate?: number;
    workOrderCommentDateString?: string;

    workOrderCommentTime?: number;
    workOrderCommentTimeString?: string;

    workOrderComment?: string;
}

export interface WorkOrderMilestone extends Record, WorkOrder {
    workOrderMilestoneId?: number;

    workOrderMilestoneTypeId?: number;
    workOrderMilestoneType?: string;

    workOrderMilestoneDate?: number;
    workOrderMilestoneDateString?: string;

    workOrderMilestoneTime?: number;
    workOrderMilestoneTimeString?: string;

    workOrderMilestoneDescription?: string;

    workOrderMilestoneCompletionDate?: number;
    workOrderMilestoneCompletionDateString?: string;

    workOrderMilestoneCompletionTime?: number;
    workOrderMilestoneCompletionTimeString?: string;

    workOrderRecordUpdate_timeMillis?: number;
}

export interface WorkOrder extends Record {
    workOrderId?: number;

    workOrderTypeId?: number;
    workOrderType?: string;

    workOrderNumber?: string;
    workOrderDescription?: string;

    workOrderOpenDate?: number;
    workOrderOpenDateString?: string;

    workOrderCloseDate?: number;
    workOrderCloseDateString?: string;

    workOrderMilestones?: WorkOrderMilestone[];
    workOrderMilestoneCount?: number;
    workOrderMilestoneCompletionCount?: number;

    workOrderComments?: WorkOrderComment[];
    workOrderLots?: Lot[];
    workOrderLotOccupancies?: LotOccupancy[];
}

/*
 * USER TYPES
 */

export interface User {
    userName: string;
    userProperties?: UserProperties;
}

export interface UserProperties {
    canUpdate: boolean;
    isAdmin: boolean;
    apiKey: string;
}

declare module "express-session" {
    interface Session {
        user: User;
    }
}

export interface PartialSession {
    user: User;
}
