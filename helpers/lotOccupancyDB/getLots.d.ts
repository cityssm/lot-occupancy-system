import type * as recordTypes from "../../types/recordTypes";
interface GetLotsFilters {
    lotName?: string;
    mapId?: number | string;
    lotTypeId?: number | string;
    lotStatusId?: number | string;
    occupancyStatus?: "" | "occupied" | "unoccupied";
}
interface GetLotsOptions {
    limit: number;
    offset: number;
}
export declare const getLots: (filters?: GetLotsFilters, options?: GetLotsOptions) => {
    count: number;
    lots: recordTypes.Lot[];
};
export default getLots;
