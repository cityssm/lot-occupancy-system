import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

interface UpdateFeeCategoryForm {
    feeCategoryId: number | string;
    feeCategory: string;
}

export const updateFeeCategory = (
    feeCategoryForm: UpdateFeeCategoryForm,
    requestSession: recordTypes.PartialSession
): boolean => {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            "update FeeCategories" +
                " set feeCategory = ?," +
                " recordUpdate_userName = ?," +
                " recordUpdate_timeMillis = ?" +
                " where recordDelete_timeMillis is null" +
                " and feeCategoryId = ?"
        )
        .run(
            feeCategoryForm.feeCategory,
            requestSession.user.userName,
            rightNowMillis,
            feeCategoryForm.feeCategoryId
        );

    database.close();

    return result.changes > 0;
};

export const updateFeeCategoryOrderNumber = (
    feeCategoryId: number,
    orderNumber: number,
    connectedDatabase?: sqlite.Database
) => {
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
};

export default updateFeeCategory;
