import type { PoolConnection } from 'better-sqlite-pool';
import type { LotOccupancy } from '../types/recordTypes.js';
interface GetLotOccupanciesFilters {
    lotId?: number | string;
    occupancyTime?: '' | 'past' | 'current' | 'future';
    occupancyStartDateString?: string;
    occupancyEffectiveDateString?: string;
    occupantName?: string;
    occupancyTypeId?: number | string;
    mapId?: number | string;
    lotNameSearchType?: '' | 'startsWith' | 'endsWith';
    lotName?: string;
    lotTypeId?: number | string;
    workOrderId?: number | string;
    notWorkOrderId?: number | string;
}
interface GetLotOccupanciesOptions {
    limit: -1 | number;
    offset: number;
    includeOccupants: boolean;
    includeFees: boolean;
    includeTransactions: boolean;
}
export declare function getLotOccupancies(filters: GetLotOccupanciesFilters, options: GetLotOccupanciesOptions, connectedDatabase?: PoolConnection): Promise<{
    count: number;
    lotOccupancies: LotOccupancy[];
}>;
export default getLotOccupancies;
