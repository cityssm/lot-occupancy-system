import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
export declare const getLotOccupancyComments: (lotOccupancyId: number | string, connectedDatabase?: sqlite.Database) => recordTypes.LotOccupancyComment[];
export default getLotOccupancyComments;
