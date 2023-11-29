import type { PoolConnection } from 'better-sqlite-pool';
type RecordTable = 'FeeCategories' | 'Fees' | 'LotOccupantTypes' | 'LotStatuses' | 'LotTypes' | 'LotTypeFields' | 'OccupancyTypes' | 'OccupancyTypeFields' | 'WorkOrderMilestoneTypes' | 'WorkOrderTypes';
export declare function updateRecordOrderNumber(recordTable: RecordTable, recordId: number | string, orderNumber: number | string, connectedDatabase: PoolConnection): boolean;
export {};
