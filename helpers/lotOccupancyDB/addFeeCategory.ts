import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


interface AddFeeCategoryForm {
    feeCategory: string;
    orderNumber?: number;
}


export const addFeeCategory =
    (feeCategoryForm: AddFeeCategoryForm, requestSession: recordTypes.PartialSession): number => {

        const database = sqlite(databasePath);

        const rightNowMillis = Date.now();

        const result = database
            .prepare("insert into FeeCategories (" +
                "feeCategory, orderNumber," +
                " recordCreate_userName, recordCreate_timeMillis," +
                " recordUpdate_userName, recordUpdate_timeMillis)" +
                " values (?, ?, ?, ?, ?, ?)")
            .run(feeCategoryForm.feeCategory,
                (feeCategoryForm.orderNumber || 0),
                requestSession.user.userName,
                rightNowMillis,
                requestSession.user.userName,
                rightNowMillis);

        database.close();

        return result.lastInsertRowid as number;
    };


export default addFeeCategory;