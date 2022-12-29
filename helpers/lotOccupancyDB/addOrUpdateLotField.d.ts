import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
interface LotFieldForm {
    lotId: string | number;
    lotTypeFieldId: string | number;
    lotFieldValue: string;
}
export declare function addOrUpdateLotField(lotFieldForm: LotFieldForm, requestSession: recordTypes.PartialSession, connectedDatabase?: sqlite.Database): boolean;
export default addOrUpdateLotField;
