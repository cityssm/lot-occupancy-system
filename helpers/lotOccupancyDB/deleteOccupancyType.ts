import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearOccupancyTypesCache } from "../functions.cache.js";

import type * as recordTypes from "../../types/recordTypes";

export const deleteOccupancyType = (
    occupancyTypeId: number | string,
    requestSession: recordTypes.PartialSession
): boolean => {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            "update OccupancyTypes" +
                " set recordDelete_userName = ?," +
                " recordDelete_timeMillis = ?" +
                " where occupancyTypeId = ?"
        )
        .run(requestSession.user.userName, rightNowMillis, occupancyTypeId);

    database
        .prepare(
            "update OccupancyTypeFields" +
                " set recordDelete_userName = ?," +
                " recordDelete_timeMillis = ?" +
                " where occupancyTypeId = ?"
        )
        .run(requestSession.user.userName, rightNowMillis, occupancyTypeId)

    database.close();

    clearOccupancyTypesCache();

    return result.changes > 0;
};

export default deleteOccupancyType;
