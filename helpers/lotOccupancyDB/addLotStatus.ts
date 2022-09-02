import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";
import { clearLotStatusesCache } from "../functions.cache.js";

interface AddLotStatusForm {
    lotStatus: string;
    orderNumber?: number;
}

export const addLotStatus = (
    lotStatusForm: AddLotStatusForm,
    requestSession: recordTypes.PartialSession
): number => {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            "insert into LotStatuses (" +
                "lotStatus, orderNumber," +
                " recordCreate_userName, recordCreate_timeMillis," +
                " recordUpdate_userName, recordUpdate_timeMillis)" +
                " values (?, ?, ?, ?, ?, ?)"
        )
        .run(
            lotStatusForm.lotStatus,
            lotStatusForm.orderNumber || -1,
            requestSession.user.userName,
            rightNowMillis,
            requestSession.user.userName,
            rightNowMillis
        );

    database.close();

    clearLotStatusesCache();

    return result.lastInsertRowid as number;
};

export default addLotStatus;
