import type * as recordTypes from "../../types/recordTypes";
interface GetFilters {
    mapId?: number | string;
}
interface LotTypeSummary extends recordTypes.LotType {
    lotCount: number;
}
export declare const getLotTypeSummary: (filters?: GetFilters) => LotTypeSummary[];
export default getLotTypeSummary;
