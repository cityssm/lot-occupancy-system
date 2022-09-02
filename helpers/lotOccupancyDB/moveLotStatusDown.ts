import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearLotStatusesCache } from "../functions.cache.js";

export const moveLotStatusDown = (lotStatusId: number | string): boolean => {
    const database = sqlite(databasePath);

    const currentOrderNumber: number = database
        .prepare(
            "select orderNumber" +
                " from LotStatuses" +
                " where lotStatusId = ?"
        )
        .get(lotStatusId).orderNumber;

    database
        .prepare(
            "update LotStatuses" +
                " set orderNumber = orderNumber - 1" +
                " where recordDelete_timeMillis is null" +
                " and orderNumber = ? + 1"
        )
        .run(currentOrderNumber);

    const result = database
        .prepare(
            "update LotStatuses" +
                " set orderNumber = ? + 1" +
                " where lotStatusId = ?"
        )
        .run(currentOrderNumber, lotStatusId);

    database.close();

    clearLotStatusesCache();

    return result.changes > 0;
};

export default moveLotStatusDown;
