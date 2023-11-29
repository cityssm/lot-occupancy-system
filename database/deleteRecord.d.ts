type RecordTable = 'FeeCategories' | 'Fees' | 'Lots' | 'LotComments' | 'LotOccupancies' | 'LotOccupancyComments' | 'LotOccupantTypes' | 'LotStatuses' | 'LotTypes' | 'LotTypeFields' | 'Maps' | 'OccupancyTypes' | 'OccupancyTypeFields' | 'WorkOrders' | 'WorkOrderComments' | 'WorkOrderMilestones' | 'WorkOrderMilestoneTypes' | 'WorkOrderTypes';
export declare function deleteRecord(recordTable: RecordTable, recordId: number | string, user: User): Promise<boolean>;
export {};
