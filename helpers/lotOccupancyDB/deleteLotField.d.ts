import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
export declare const deleteLotField: (lotId: number | string, lotTypeFieldId: number | string, requestSession: recordTypes.PartialSession, connectedDatabase?: sqlite.Database) => boolean;
export default deleteLotField;
