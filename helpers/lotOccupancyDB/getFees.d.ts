import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
interface GetFeesFilters {
    occupancyTypeId?: number | string;
    lotTypeId?: number | string;
}
export declare function getFees(feeCategoryId: number, additionalFilters: GetFeesFilters, connectedDatabase?: sqlite.Database): recordTypes.Fee[];
export default getFees;
