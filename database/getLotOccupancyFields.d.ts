import type { PoolConnection } from 'better-sqlite-pool';
import type { LotOccupancyField } from '../types/recordTypes.js';
export declare function getLotOccupancyFields(lotOccupancyId: number | string, connectedDatabase?: PoolConnection): Promise<LotOccupancyField[]>;
export default getLotOccupancyFields;
