import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
interface UpdateFeeCategoryForm {
    feeCategoryId: number | string;
    feeCategory: string;
}
export declare const updateFeeCategory: (feeCategoryForm: UpdateFeeCategoryForm, requestSession: recordTypes.PartialSession) => boolean;
export declare const updateFeeCategoryOrderNumber: (feeCategoryId: number, orderNumber: number, connectedDatabase?: sqlite.Database) => boolean;
export default updateFeeCategory;
