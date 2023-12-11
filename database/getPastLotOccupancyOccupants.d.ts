import type { LotOccupancyOccupant } from '../types/recordTypes.js';
interface GetPastLotOccupancyOccupantsFilters {
    searchFilter: string;
}
interface GetPastLotOccupancyOccupantsOptions {
    limit: number;
}
export declare function getPastLotOccupancyOccupants(filters: GetPastLotOccupancyOccupantsFilters, options: GetPastLotOccupancyOccupantsOptions): Promise<LotOccupancyOccupant[]>;
export default getPastLotOccupancyOccupants;
