import type * as recordTypes from "../types/recordTypes";
export declare function filterOccupantsByLotOccupantType(lotOccupancy: recordTypes.LotOccupancy, lotOccupantType: string): recordTypes.LotOccupancyOccupant[];
export declare function getFieldValueByOccupancyTypeField(lotOccupancy: recordTypes.LotOccupancy, occupancyTypeField: string): string | undefined;
export declare function getFeesByFeeCategory(lotOccupancy: recordTypes.LotOccupancy, feeCategory: string, feeCategoryContains?: boolean): recordTypes.LotOccupancyFee[];
export declare function getTransactionTotal(lotOccupancy: recordTypes.LotOccupancy): number;
