import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearOccupancyTypesCache } from "../functions.cache.js";

import type * as recordTypes from "../../types/recordTypes";

export function deleteOccupancyTypeField(
    occupancyTypeFieldId: number | string,
    requestSession: recordTypes.PartialSession
): boolean {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            `update OccupancyTypeFields
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where occupancyTypeFieldId = ?`
        )
        .run(requestSession.user.userName, rightNowMillis, occupancyTypeFieldId);

    database.close();

    clearOccupancyTypesCache();

    return result.changes > 0;
}

export default deleteOccupancyTypeField;
