import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
interface GetLotOccupanciesFilters {
    lotId?: number | string;
}
interface GetLotOccupanciesOptions {
    limit: -1 | number;
    offset: number;
    includeOccupants: boolean;
}
export declare const getLotOccupancies: (filters: GetLotOccupanciesFilters, options: GetLotOccupanciesOptions, connectedDatabase?: sqlite.Database) => {
    count: number;
    lotOccupancies: recordTypes.LotOccupancy[];
};
export default getLotOccupancies;
