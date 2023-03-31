import type * as recordTypes from '../types/recordTypes';
export declare function getLotOccupantTypes(): Promise<recordTypes.LotOccupantType[]>;
export declare function getLotOccupantTypeById(lotOccupantTypeId: number): Promise<recordTypes.LotOccupantType | undefined>;
export declare function getLotOccupantTypeByLotOccupantType(lotOccupantType: string): Promise<recordTypes.LotOccupantType | undefined>;
export declare function getLotStatuses(): Promise<recordTypes.LotStatus[]>;
export declare function getLotStatusById(lotStatusId: number): Promise<recordTypes.LotStatus | undefined>;
export declare function getLotStatusByLotStatus(lotStatus: string): Promise<recordTypes.LotStatus | undefined>;
export declare function getLotTypes(): Promise<recordTypes.LotType[]>;
export declare function getLotTypeById(lotTypeId: number): Promise<recordTypes.LotType | undefined>;
export declare function getLotTypesByLotType(lotType: string): Promise<recordTypes.LotType | undefined>;
export declare function getOccupancyTypes(): Promise<recordTypes.OccupancyType[]>;
export declare function getAllOccupancyTypeFields(): Promise<recordTypes.OccupancyTypeField[]>;
export declare function getOccupancyTypeById(occupancyTypeId: number): Promise<recordTypes.OccupancyType | undefined>;
export declare function getOccupancyTypeByOccupancyType(occupancyTypeString: string): Promise<recordTypes.OccupancyType | undefined>;
export declare function getOccupancyTypePrintsById(occupancyTypeId: number): Promise<string[]>;
export declare function getWorkOrderTypes(): Promise<recordTypes.WorkOrderType[]>;
export declare function getWorkOrderTypeById(workOrderTypeId: number): Promise<recordTypes.WorkOrderType | undefined>;
export declare function getWorkOrderMilestoneTypes(): Promise<recordTypes.WorkOrderMilestoneType[]>;
export declare function getWorkOrderMilestoneTypeById(workOrderMilestoneTypeId: number): Promise<recordTypes.WorkOrderMilestoneType | undefined>;
export declare function getWorkOrderMilestoneTypeByWorkOrderMilestoneType(workOrderMilestoneTypeString: string): Promise<recordTypes.WorkOrderMilestoneType | undefined>;
export declare function preloadCaches(): Promise<void>;
export declare function clearCacheByTableName(tableName: string, relayMessage?: boolean): void;
