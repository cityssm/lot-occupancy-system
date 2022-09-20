import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

export const deleteLot = (
    lotId: number | string,
    requestSession: recordTypes.PartialSession
): boolean => {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            "update Lots" +
                " set recordDelete_userName = ?," +
                " recordDelete_timeMillis = ?" +
                " where lotId = ?"
        )
        .run(requestSession.user.userName, rightNowMillis, lotId);

    database
        .prepare(
            "update LotComments" +
                " set recordDelete_userName = ?," +
                " recordDelete_timeMillis = ?" +
                " where lotId = ?"
        )
        .run(requestSession.user.userName, rightNowMillis, lotId);

    database
        .prepare(
            "update LotFields" +
                " set recordDelete_userName = ?," +
                " recordDelete_timeMillis = ?" +
                " where lotId = ?"
        )
        .run(requestSession.user.userName, rightNowMillis, lotId);

    database.close();

    return result.changes > 0;
};

export default deleteLot;
