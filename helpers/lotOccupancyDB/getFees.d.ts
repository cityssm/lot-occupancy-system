import type { PoolConnection } from 'better-sqlite-pool';
import type * as recordTypes from '../../types/recordTypes';
interface GetFeesFilters {
    occupancyTypeId?: number | string;
    lotTypeId?: number | string;
}
export declare function getFees(feeCategoryId: number, additionalFilters: GetFeesFilters, connectedDatabase?: PoolConnection): Promise<recordTypes.Fee[]>;
export default getFees;
