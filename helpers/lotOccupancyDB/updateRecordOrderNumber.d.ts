import sqlite from 'better-sqlite3';
declare type RecordTable = 'FeeCategories' | 'Fees' | 'LotOccupantTypes' | 'LotStatuses' | 'LotTypes' | 'LotTypeFields' | 'OccupancyTypes' | 'OccupancyTypeFields' | 'WorkOrderMilestoneTypes' | 'WorkOrderTypes';
export declare function updateRecordOrderNumber(recordTable: RecordTable, recordId: number | string, orderNumber: number | string, connectedDatabase: sqlite.Database): boolean;
export {};
