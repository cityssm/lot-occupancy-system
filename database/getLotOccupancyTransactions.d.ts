import type { PoolConnection } from 'better-sqlite-pool';
import type { LotOccupancyTransaction } from '../types/recordTypes.js';
export default function getLotOccupancyTransactions(lotOccupancyId: number | string, options: {
    includeIntegrations: boolean;
}, connectedDatabase?: PoolConnection): Promise<LotOccupancyTransaction[]>;
