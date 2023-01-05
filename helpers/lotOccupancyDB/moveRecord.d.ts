declare type RecordTable = "OccupancyTypes" | "WorkOrderMilestoneTypes" | "WorkOrderTypes";
export declare function moveRecordDown(recordTable: RecordTable, recordId: number | string): boolean;
export declare function moveRecordDownToBottom(recordTable: RecordTable, recordId: number | string): boolean;
export {};
