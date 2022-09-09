import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

export const deleteWorkOrderLot = (
    workOrderId: number | string,
    lotId: number | string,
    requestSession: recordTypes.PartialSession
): boolean => {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            "update WorkOrderLots" +
                " set recordDelete_userName = ?," +
                " recordDelete_timeMillis = ?" +
                " where workOrderId = ?" +
                " and lotId = ?"
        )
        .run(requestSession.user.userName, rightNowMillis, workOrderId, lotId);

    database.close();

    return result.changes > 0;
};

export default deleteWorkOrderLot;
