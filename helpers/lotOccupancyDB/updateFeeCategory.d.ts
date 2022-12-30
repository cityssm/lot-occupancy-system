import sqlite from "better-sqlite3";
import type * as recordTypes from "../../types/recordTypes";
interface UpdateFeeCategoryForm {
    feeCategoryId: number | string;
    feeCategory: string;
}
export declare function updateFeeCategory(feeCategoryForm: UpdateFeeCategoryForm, requestSession: recordTypes.PartialSession): boolean;
export declare function updateFeeCategoryOrderNumber(feeCategoryId: number, orderNumber: number, connectedDatabase?: sqlite.Database): boolean;
export default updateFeeCategory;
