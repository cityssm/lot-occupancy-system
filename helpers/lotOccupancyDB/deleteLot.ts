import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

export function deleteLot(
    lotId: number | string,
    requestSession: recordTypes.PartialSession
): boolean {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    let result: sqlite.RunResult;

    for (const tableName of ["LotFields", "LotComments", "Lots"]) {
        result = database
            .prepare(
                `update ${tableName}
                    set recordDelete_userName = ?,
                    recordDelete_timeMillis = ?
                    where lotId = ?`
            )
            .run(requestSession.user.userName, rightNowMillis, lotId);
    }

    database.close();

    return result.changes > 0;
}

export default deleteLot;
