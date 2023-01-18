import type * as recordTypes from '../../types/recordTypes';
declare type RecordTable = 'FeeCategories' | 'LotStatuses' | 'LotTypes' | 'OccupancyTypes' | 'WorkOrderMilestoneTypes' | 'WorkOrderTypes';
export declare function addRecord(recordTable: RecordTable, recordName: string, orderNumber: number | string, requestSession: recordTypes.PartialSession): Promise<number>;
export {};
