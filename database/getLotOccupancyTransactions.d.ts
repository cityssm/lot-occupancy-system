import type { PoolConnection } from 'better-sqlite-pool';
import type { LotOccupancyTransaction } from '../types/recordTypes.js';
export declare function getLotOccupancyTransactions(lotOccupancyId: number | string, options: {
    includeIntegrations: boolean;
}, connectedDatabase?: PoolConnection): Promise<LotOccupancyTransaction[]>;
export default getLotOccupancyTransactions;
