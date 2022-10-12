import type * as recordTypes from "../../types/recordTypes";
interface GetPastLotOccupancyOccupantsFilters {
    searchFilter: string;
}
interface GetPastLotOccupancyOccupantsOptions {
    limit: number;
}
export declare const getPastLotOccupancyOccupants: (filters: GetPastLotOccupancyOccupantsFilters, options: GetPastLotOccupancyOccupantsOptions) => recordTypes.LotOccupancyOccupant[];
export default getPastLotOccupancyOccupants;
