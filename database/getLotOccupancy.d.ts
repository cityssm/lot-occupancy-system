import type { PoolConnection } from 'better-sqlite-pool';
import type { LotOccupancy } from '../types/recordTypes.js';
export declare function getLotOccupancy(lotOccupancyId: number | string, connectedDatabase?: PoolConnection): Promise<LotOccupancy | undefined>;
export default getLotOccupancy;
