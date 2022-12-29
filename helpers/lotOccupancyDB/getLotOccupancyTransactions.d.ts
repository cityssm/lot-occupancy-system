import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
export declare function getLotOccupancyTransactions(lotOccupancyId: number | string, connectedDatabase?: sqlite.Database): recordTypes.LotOccupancyTransaction[];
export default getLotOccupancyTransactions;
