import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
export declare function getLotTypeFields(lotTypeId: number, connectedDatabase?: sqlite.Database): recordTypes.LotTypeField[];
export default getLotTypeFields;
