import type { PoolConnection } from 'better-sqlite-pool';
import type { LotOccupancyOccupant } from '../types/recordTypes.js';
export declare function getLotOccupancyOccupants(lotOccupancyId: number | string, connectedDatabase?: PoolConnection): Promise<LotOccupancyOccupant[]>;
export default getLotOccupancyOccupants;
