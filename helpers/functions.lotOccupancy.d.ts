import type * as recordTypes from "../types/recordTypes";
export declare const filterOccupantsByLotOccupantType: (lotOccupancy: recordTypes.LotOccupancy, lotOccupantType: string) => recordTypes.LotOccupancyOccupant[];
export declare const getFieldValueByOccupancyTypeField: (lotOccupancy: recordTypes.LotOccupancy, occupancyTypeField: string) => string;
