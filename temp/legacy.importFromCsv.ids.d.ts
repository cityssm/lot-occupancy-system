export declare function getFeeIdByFeeDescription(feeDescription: string): number;
export declare const preneedOwnerLotOccupantTypeId: number;
export declare const funeralDirectorLotOccupantTypeId: number;
export declare const deceasedLotOccupantTypeId: number;
export declare const purchaserLotOccupantTypeId: number;
export declare const availableLotStatusId: number;
export declare const reservedLotStatusId: number;
export declare const takenLotStatusId: number;
export declare function getLotTypeId(dataRow: {
    cemetery: string;
}): number;
export declare const preneedOccupancyType: import("../types/recordTypes.js").OccupancyType;
export declare const deceasedOccupancyType: import("../types/recordTypes.js").OccupancyType;
export declare const cremationOccupancyType: import("../types/recordTypes.js").OccupancyType;
export declare const acknowledgedWorkOrderMilestoneTypeId: number | undefined;
export declare const deathWorkOrderMilestoneTypeId: number | undefined;
export declare const funeralWorkOrderMilestoneTypeId: number | undefined;
export declare const cremationWorkOrderMilestoneTypeId: number | undefined;
export declare const intermentWorkOrderMilestoneTypeId: number | undefined;
export declare const workOrderTypeId = 1;
