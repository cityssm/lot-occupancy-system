import type { PoolConnection } from 'better-sqlite-pool';
import type { Lot } from '../types/recordTypes.js';
interface GetLotsFilters {
    lotNameSearchType?: '' | 'startsWith' | 'endsWith';
    lotName?: string;
    mapId?: number | string;
    lotTypeId?: number | string;
    lotStatusId?: number | string;
    occupancyStatus?: '' | 'occupied' | 'unoccupied';
    workOrderId?: number | string;
}
interface GetLotsOptions {
    limit: -1 | number;
    offset: number;
    includeLotOccupancyCount?: boolean;
}
export default function getLots(filters: GetLotsFilters, options: GetLotsOptions, connectedDatabase?: PoolConnection): Promise<{
    count: number;
    lots: Lot[];
}>;
export {};
