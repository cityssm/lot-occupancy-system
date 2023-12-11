import type { PoolConnection } from 'better-sqlite-pool';
import type { OccupancyTypeField } from '../types/recordTypes.js';
export declare function getOccupancyTypeFields(occupancyTypeId?: number, connectedDatabase?: PoolConnection): Promise<OccupancyTypeField[]>;
export default getOccupancyTypeFields;
