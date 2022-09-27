import type * as recordTypes from "../../types/recordTypes";
interface GetFilters {
    mapId?: number | string;
}
interface LotStatusSummary extends recordTypes.LotStatus {
    lotCount: number;
}
export declare const getLotStatusSummary: (filters?: GetFilters) => LotStatusSummary[];
export default getLotStatusSummary;
