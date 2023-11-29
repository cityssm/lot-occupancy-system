import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../types/recordTypes.js';
export declare function getLotOccupancy(lotOccupancyId: number | string, connectedDatabase?: PoolConnection): Promise<recordTypes.LotOccupancy | undefined>;
export default getLotOccupancy;
