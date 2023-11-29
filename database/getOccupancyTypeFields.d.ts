import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../types/recordTypes.js';
export declare function getOccupancyTypeFields(occupancyTypeId?: number, connectedDatabase?: PoolConnection): Promise<recordTypes.OccupancyTypeField[]>;
export default getOccupancyTypeFields;
