import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearLotTypesCache } from "../functions.cache.js";

import type * as recordTypes from "../../types/recordTypes";

export const deleteLotType = (
    lotTypeId: number | string,
    requestSession: recordTypes.PartialSession
): boolean => {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            "update LotTypes" +
                " set recordDelete_userName = ?," +
                " recordDelete_timeMillis = ?" +
                " where lotTypeId = ?"
        )
        .run(requestSession.user.userName, rightNowMillis, lotTypeId);

    database
        .prepare(
            "update LotTypeFields" +
                " set recordDelete_userName = ?," +
                " recordDelete_timeMillis = ?" +
                " where lotTypeId = ?"
        )
        .run(requestSession.user.userName, rightNowMillis, lotTypeId)

    database.close();

    clearLotTypesCache();

    return result.changes > 0;
};

export default deleteLotType;
