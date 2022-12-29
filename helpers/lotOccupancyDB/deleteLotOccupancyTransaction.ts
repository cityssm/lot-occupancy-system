import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

export function deleteLotOccupancyTransaction(
    lotOccupancyId: number | string,
    transactionIndex: number | string,
    requestSession: recordTypes.PartialSession
): boolean {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            `update LotOccupancyTransactions
                set recordDelete_userName = ?,
                recordDelete_timeMillis = ?
                where lotOccupancyId = ?
                and transactionIndex = ?`
        )
        .run(requestSession.user.userName, rightNowMillis, lotOccupancyId, transactionIndex);

    database.close();

    return result.changes > 0;
}

export default deleteLotOccupancyTransaction;
