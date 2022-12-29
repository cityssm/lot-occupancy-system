import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

export function deleteMap(
    mapId: number | string,
    requestSession: recordTypes.PartialSession
): boolean {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    let result: sqlite.RunResult;

    for (const tableName of ["Lots", "Maps"]) {
        result = database
            .prepare(
                `update ${tableName}
                    set recordDelete_userName = ?,
                    recordDelete_timeMillis = ?
                    where mapId = ?`
            )
            .run(requestSession.user.userName, rightNowMillis, mapId);
    }

    database.close();

    return result.changes > 0;
}

export default deleteMap;
