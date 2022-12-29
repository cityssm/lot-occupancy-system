import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearLotStatusesCache } from "../functions.cache.js";

import type * as recordTypes from "../../types/recordTypes";

export function deleteLotStatus(
    lotStatusId: number | string,
    requestSession: recordTypes.PartialSession
): boolean {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            `update LotStatuses
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where lotStatusId = ?`
        )
        .run(requestSession.user.userName, rightNowMillis, lotStatusId);

    database.close();

    clearLotStatusesCache();

    return result.changes > 0;
}

export default deleteLotStatus;
