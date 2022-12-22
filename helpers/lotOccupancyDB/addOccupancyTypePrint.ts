import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearOccupancyTypesCache } from "../functions.cache.js";

import type * as recordTypes from "../../types/recordTypes";

interface OccupancyTypePrintForm {
    occupancyTypeId: string | number;
    printEJS: string;
    orderNumber?: number;
}

export const addOccupancyTypePrint = (
    occupancyTypePrintForm: OccupancyTypePrintForm,
    requestSession: recordTypes.PartialSession
): boolean => {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    let result = database
        .prepare(
            "update OccupancyTypePrints" +
                " set recordUpdate_userName = ?," +
                " recordUpdate_timeMillis = ?," +
                " recordDelete_userName = null," +
                " recordDelete_timeMillis = null" +
                " where occupancyTypeId = ?" +
                " and printEJS = ?"
        )
        .run(
            requestSession.user.userName,
            rightNowMillis,
            occupancyTypePrintForm.occupancyTypeId,
            occupancyTypePrintForm.printEJS
        );

    if (result.changes === 0) {
        result = database
            .prepare(
                "insert into OccupancyTypePrints (" +
                    "occupancyTypeId, printEJS," +
                    " orderNumber," +
                    " recordCreate_userName, recordCreate_timeMillis," +
                    " recordUpdate_userName, recordUpdate_timeMillis)" +
                    " values (?, ?, ?, ?, ?, ?, ?)"
            )
            .run(
                occupancyTypePrintForm.occupancyTypeId,
                occupancyTypePrintForm.printEJS,
                occupancyTypePrintForm.orderNumber || -1,
                requestSession.user.userName,
                rightNowMillis,
                requestSession.user.userName,
                rightNowMillis
            );
    }

    database.close();

    clearOccupancyTypesCache();

    return result.changes > 0;
};

export default addOccupancyTypePrint;