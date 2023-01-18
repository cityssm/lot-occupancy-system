import type * as recordTypes from '../../types/recordTypes';
declare type RecordTable = 'FeeCategories' | 'LotStatuses' | 'LotTypes' | 'OccupancyTypes' | 'WorkOrderMilestoneTypes' | 'WorkOrderTypes';
export declare function updateRecord(recordTable: RecordTable, recordId: number | string, recordName: string, requestSession: recordTypes.PartialSession): Promise<boolean>;
export {};
