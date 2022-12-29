import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

export function deleteLotOccupancyField(
    lotOccupancyId: number | string,
    occupancyTypeFieldId: number | string,
    requestSession: recordTypes.PartialSession,
    connectedDatabase?: sqlite.Database
): boolean {
    const database = connectedDatabase || sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            `update LotOccupancyFields
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where lotOccupancyId = ?
                and occupancyTypeFieldId = ?`
        )
        .run(requestSession.user.userName, rightNowMillis, lotOccupancyId, occupancyTypeFieldId);

    if (!connectedDatabase) {
        database.close();
    }

    return result.changes > 0;
}

export default deleteLotOccupancyField;
