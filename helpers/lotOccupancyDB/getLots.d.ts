import type * as recordTypes from "../../types/recordTypes";
interface GetLotsFilters {
    mapId?: number | string;
}
interface GetLotsOptions {
    limit: number;
    offset: number;
}
export declare const getLots: (filters?: GetLotsFilters, options?: GetLotsOptions) => recordTypes.Lot[];
export default getLots;
