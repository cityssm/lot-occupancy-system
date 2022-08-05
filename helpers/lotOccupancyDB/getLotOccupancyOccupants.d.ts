import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
export declare const getLotOccupancyOccupants: (lotOccupancyId: number | string, connectedDatabase?: sqlite.Database) => recordTypes.LotOccupancyOccupant[];
export default getLotOccupancyOccupants;
