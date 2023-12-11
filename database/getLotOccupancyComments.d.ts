import type { PoolConnection } from 'better-sqlite-pool';
import type { LotOccupancyComment } from '../types/recordTypes.js';
export declare function getLotOccupancyComments(lotOccupancyId: number | string, connectedDatabase?: PoolConnection): Promise<LotOccupancyComment[]>;
export default getLotOccupancyComments;
