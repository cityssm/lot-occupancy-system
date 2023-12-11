import type { PoolConnection } from 'better-sqlite-pool';
import type { Fee } from '../types/recordTypes.js';
interface GetFeesFilters {
    occupancyTypeId?: number | string;
    lotTypeId?: number | string;
}
export declare function getFees(feeCategoryId: number, additionalFilters: GetFeesFilters, connectedDatabase?: PoolConnection): Promise<Fee[]>;
export default getFees;
