import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

export function deleteLotOccupancy(
    lotOccupancyId: number | string,
    requestSession: recordTypes.PartialSession
): boolean {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    let result: sqlite.RunResult;

    // Do not auto-delete Fees or Transactions.  Maintain financials.
    for (const tableName of [
        "LotOccupancyOccupants",
        "LotOccupancyFields",
        "LotOccupancyComments",
        "LotOccupancies"
    ]) {
        result = database
            .prepare(
                `update ${tableName}
                    set recordDelete_userName = ?,
                    recordDelete_timeMillis = ?
                    where lotOccupancyId = ?`
            )
            .run(requestSession.user.userName, rightNowMillis, lotOccupancyId);
    }

    database.close();

    return result.changes > 0;
}

export default deleteLotOccupancy;
