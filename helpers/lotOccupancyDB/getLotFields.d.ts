import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
export declare const getLotFields: (lotId: number | string, connectedDatabase?: sqlite.Database) => recordTypes.LotField[];
export default getLotFields;
