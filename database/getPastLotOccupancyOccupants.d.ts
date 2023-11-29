import type * as recordTypes from '../types/recordTypes.js';
interface GetPastLotOccupancyOccupantsFilters {
    searchFilter: string;
}
interface GetPastLotOccupancyOccupantsOptions {
    limit: number;
}
export declare function getPastLotOccupancyOccupants(filters: GetPastLotOccupancyOccupantsFilters, options: GetPastLotOccupancyOccupantsOptions): Promise<recordTypes.LotOccupancyOccupant[]>;
export default getPastLotOccupancyOccupants;
