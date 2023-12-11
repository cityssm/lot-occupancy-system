import type { PoolConnection } from 'better-sqlite-pool';
import type { LotOccupancyFee } from '../types/recordTypes.js';
export declare function getLotOccupancyFees(lotOccupancyId: number | string, connectedDatabase?: PoolConnection): Promise<LotOccupancyFee[]>;
export default getLotOccupancyFees;
