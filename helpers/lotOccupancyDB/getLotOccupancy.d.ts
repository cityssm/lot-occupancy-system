import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
export declare const getLotOccupancy: (lotOccupancyId: number | string, connectedDatabase?: sqlite.Database) => recordTypes.LotOccupancy;
export default getLotOccupancy;
