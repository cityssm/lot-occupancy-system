import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../types/recordTypes.js';
export declare function getLotOccupancyFees(lotOccupancyId: number | string, connectedDatabase?: PoolConnection): Promise<recordTypes.LotOccupancyFee[]>;
export default getLotOccupancyFees;
