type RecordTable = 'LotStatuses' | 'LotTypes' | 'OccupancyTypes' | 'WorkOrderMilestoneTypes' | 'WorkOrderTypes';
export declare function updateRecord(recordTable: RecordTable, recordId: number | string, recordName: string, user: User): Promise<boolean>;
export {};
