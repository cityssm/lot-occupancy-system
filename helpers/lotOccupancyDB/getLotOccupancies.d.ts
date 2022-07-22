import type * as recordTypes from "../../types/recordTypes";
interface GetLotOccupanciesFilters {
    lotId?: number | string;
}
interface GetLotOccupanciesOptions {
    limit: number;
    offset: number;
}
export declare const getLotOccupancies: (filters: GetLotOccupanciesFilters, options?: GetLotOccupanciesOptions) => {
    count: number;
    lotOccupancies: recordTypes.LotOccupancy[];
};
export default getLotOccupancies;
