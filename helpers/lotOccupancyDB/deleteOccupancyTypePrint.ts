import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearOccupancyTypesCache } from "../functions.cache.js";

import type * as recordTypes from "../../types/recordTypes";

export const deleteOccupancyTypePrint = (
    occupancyTypeId: number | string,
    printEJS: string,
    requestSession: recordTypes.PartialSession
): boolean => {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            "update OccupancyTypePrints" +
                " set recordDelete_userName = ?," +
                " recordDelete_timeMillis = ?" +
                " where occupancyTypeId = ?" +
                " and printEJS = ?"
        )
        .run(requestSession.user.userName, rightNowMillis, occupancyTypeId, printEJS);

    database.close();

    clearOccupancyTypesCache();

    return result.changes > 0;
};

export default deleteOccupancyTypePrint;