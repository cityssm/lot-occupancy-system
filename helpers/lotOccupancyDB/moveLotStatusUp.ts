import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { getLotStatusById, clearLotStatusesCache } from "../functions.cache.js";

export function moveLotStatusUp(lotStatusId: number | string): boolean {
    const database = sqlite(databasePath);

    const currentOrderNumber: number = getLotStatusById(
        typeof lotStatusId === "string" ? Number.parseInt(lotStatusId) : lotStatusId
    ).orderNumber;

    if (currentOrderNumber <= 0) {
        database.close();
        return true;
    }

    database
        .prepare(
            `update LotStatuses
                set orderNumber = orderNumber + 1
                where recordDelete_timeMillis is null
                and orderNumber = ? - 1`
        )
        .run(currentOrderNumber);

    const result = database
        .prepare("update LotStatuses set orderNumber = ? - 1 where lotStatusId = ?")
        .run(currentOrderNumber, lotStatusId);

    database.close();

    clearLotStatusesCache();

    return result.changes > 0;
}

export function moveLotStatusUpToTop(lotStatusId: number | string): boolean {
    const database = sqlite(databasePath);

    const currentOrderNumber: number = getLotStatusById(
        typeof lotStatusId === "string" ? Number.parseInt(lotStatusId) : lotStatusId
    ).orderNumber;

    if (currentOrderNumber > 0) {
        database
            .prepare("update LotStatuses set orderNumber = -1 where lotStatusId = ?")
            .run(lotStatusId);

        database
            .prepare(
                `update LotStatuses
                    set orderNumber = orderNumber + 1
                    where recordDelete_timeMillis is null
                    and orderNumber < ?`
            )
            .run(currentOrderNumber);
    }

    database.close();

    clearLotStatusesCache();

    return true;
}

export default moveLotStatusUp;
