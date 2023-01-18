import type * as recordTypes from '../../types/recordTypes';
declare type RecordTable = 'FeeCategories' | 'Fees' | 'Lots' | 'LotComments' | 'LotOccupancies' | 'LotOccupancyComments' | 'LotOccupantTypes' | 'LotStatuses' | 'LotTypes' | 'LotTypeFields' | 'Maps' | 'OccupancyTypes' | 'OccupancyTypeFields' | 'WorkOrders' | 'WorkOrderComments' | 'WorkOrderMilestones' | 'WorkOrderMilestoneTypes' | 'WorkOrderTypes';
export declare function deleteRecord(recordTable: RecordTable, recordId: number | string, requestSession: recordTypes.PartialSession): Promise<boolean>;
export {};
