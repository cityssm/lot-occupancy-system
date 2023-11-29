import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../types/recordTypes.js';
export declare function getLotOccupancyComments(lotOccupancyId: number | string, connectedDatabase?: PoolConnection): Promise<recordTypes.LotOccupancyComment[]>;
export default getLotOccupancyComments;
