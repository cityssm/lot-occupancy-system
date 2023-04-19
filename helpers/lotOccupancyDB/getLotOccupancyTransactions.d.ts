import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../../types/recordTypes';
export declare function getLotOccupancyTransactions(lotOccupancyId: number | string, options: {
    includeIntegrations: boolean;
}, connectedDatabase?: PoolConnection): Promise<recordTypes.LotOccupancyTransaction[]>;
export default getLotOccupancyTransactions;
