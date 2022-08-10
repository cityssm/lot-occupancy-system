import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
export declare const deleteLotOccupancyField: (lotOccupancyId: number | string, occupancyTypeFieldId: number | string, requestSession: recordTypes.PartialSession, connectedDatabase?: sqlite.Database) => boolean;
export default deleteLotOccupancyField;
