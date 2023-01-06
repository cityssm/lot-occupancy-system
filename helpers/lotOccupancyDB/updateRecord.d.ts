import type * as recordTypes from "../../types/recordTypes";
declare type RecordTable = "FeeCategories" | "LotStatuses" | "LotTypes" | "OccupancyTypes" | "WorkOrderMilestoneTypes" | "WorkOrderTypes";
export declare const clearCacheFunctions: Map<RecordTable, () => void>;
export declare function updateRecord(recordTable: RecordTable, recordId: number | string, recordName: string, requestSession: recordTypes.PartialSession): boolean;
export {};
