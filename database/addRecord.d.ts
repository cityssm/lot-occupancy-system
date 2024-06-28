type RecordTable = 'LotStatuses' | 'LotTypes' | 'OccupancyTypes' | 'WorkOrderMilestoneTypes' | 'WorkOrderTypes';
export declare function addRecord(recordTable: RecordTable, recordName: string, orderNumber: number | string, user: User): Promise<number>;
export {};
