import type { LotOccupancyOccupant } from '../types/recordTypes.js';
interface GetPastLotOccupancyOccupantsFilters {
    searchFilter: string;
}
interface GetPastLotOccupancyOccupantsOptions {
    limit: number;
}
export default function getPastLotOccupancyOccupants(filters: GetPastLotOccupancyOccupantsFilters, options: GetPastLotOccupancyOccupantsOptions): Promise<LotOccupancyOccupant[]>;
export {};
