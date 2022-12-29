import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

export function deleteLotOccupancyFee(
    lotOccupancyId: number | string,
    feeId: number | string,
    requestSession: recordTypes.PartialSession
): boolean {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            `update LotOccupancyFees
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where lotOccupancyId = ?
                and feeId = ?`
        )
        .run(requestSession.user.userName, rightNowMillis, lotOccupancyId, feeId);

    database.close();

    return result.changes > 0;
}

export default deleteLotOccupancyFee;
