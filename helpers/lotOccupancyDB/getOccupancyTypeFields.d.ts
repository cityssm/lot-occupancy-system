import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
export declare function getOccupancyTypeFields(occupancyTypeId?: number, connectedDatabase?: sqlite.Database): recordTypes.OccupancyTypeField[];
export default getOccupancyTypeFields;
