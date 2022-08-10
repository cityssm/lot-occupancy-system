import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
interface LotOccupancyFieldForm {
    lotOccupancyId: string | number;
    occupancyTypeFieldId: string | number;
    lotOccupancyFieldValue: string;
}
export declare const addOrUpdateLotOccupancyField: (lotOccupancyFieldForm: LotOccupancyFieldForm, requestSession: recordTypes.PartialSession, connectedDatabase?: sqlite.Database) => boolean;
export default addOrUpdateLotOccupancyField;
