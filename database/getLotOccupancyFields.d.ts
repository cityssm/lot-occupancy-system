import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../types/recordTypes.js';
export declare function getLotOccupancyFields(lotOccupancyId: number | string, connectedDatabase?: PoolConnection): Promise<recordTypes.LotOccupancyField[]>;
export default getLotOccupancyFields;
