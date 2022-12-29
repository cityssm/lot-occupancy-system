import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearLotTypesCache } from "../functions.cache.js";

import type * as recordTypes from "../../types/recordTypes";

export function deleteLotType(
    lotTypeId: number | string,
    requestSession: recordTypes.PartialSession
): boolean {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    let result: sqlite.RunResult;

    for (const tableName of ["LotTypeFields", "LotTypes"]) {
        result = database
            .prepare(
                `update ${tableName}
                    set recordDelete_userName = ?,
                    recordDelete_timeMillis = ?
                    where lotTypeId = ?`
            )
            .run(requestSession.user.userName, rightNowMillis, lotTypeId);
    }

    database.close();

    clearLotTypesCache();

    return result.changes > 0;
}

export default deleteLotType;
