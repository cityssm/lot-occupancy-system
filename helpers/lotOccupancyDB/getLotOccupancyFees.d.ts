import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
export declare const getLotOccupancyFees: (lotOccupancyId: number | string, connectedDatabase?: sqlite.Database) => recordTypes.LotOccupancyFee[];
export default getLotOccupancyFees;
