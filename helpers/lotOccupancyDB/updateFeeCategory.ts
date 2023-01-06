import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { updateRecord } from "./updateRecord.js";

import type * as recordTypes from "../../types/recordTypes";

interface UpdateFeeCategoryForm {
    feeCategoryId: number | string;
    feeCategory: string;
}

export function updateFeeCategory(
    feeCategoryForm: UpdateFeeCategoryForm,
    requestSession: recordTypes.PartialSession
): boolean {
    const success = updateRecord(
        "FeeCategories",
        feeCategoryForm.feeCategoryId,
        feeCategoryForm.feeCategory,
        requestSession
    );
    return success;
}

export function updateFeeCategoryOrderNumber(
    feeCategoryId: number,
    orderNumber: number,
    connectedDatabase?: sqlite.Database
) {
    const database =
        connectedDatabase ||
        sqlite(databasePath, {
            readonly: true
        });

    const result = database
        .prepare("update FeeCategories set orderNumber = ? where feeCategoryId = ?")
        .run(orderNumber, feeCategoryId);

    if (!connectedDatabase) {
        database.close();
    }

    return result.changes > 0;
}

export default updateFeeCategory;
