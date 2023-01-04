import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { getLotStatusById, clearLotStatusesCache } from "../functions.cache.js";

export function moveLotStatusDown(lotStatusId: number | string): boolean {
    const database = sqlite(databasePath);

    const currentOrderNumber: number = getLotStatusById(
        typeof lotStatusId === "string" ? Number.parseInt(lotStatusId) : lotStatusId
    ).orderNumber;

    database
        .prepare(
            `update LotStatuses
                set orderNumber = orderNumber - 1
                where recordDelete_timeMillis is null
                and orderNumber = ? + 1`
        )
        .run(currentOrderNumber);

    const result = database
        .prepare(`update LotStatuses set orderNumber = ? + 1 where lotStatusId = ?`)
        .run(currentOrderNumber, lotStatusId);

    database.close();

    clearLotStatusesCache();

    return result.changes > 0;
}

export function moveLotStatusDownToBottom(lotStatusId: number | string): boolean {
    const database = sqlite(databasePath);

    const currentOrderNumber: number = getLotStatusById(
        typeof lotStatusId === "string" ? Number.parseInt(lotStatusId) : lotStatusId
    ).orderNumber;

    const maxOrderNumber: number = database
        .prepare(
            `select max(orderNumber) as maxOrderNumber
                from LotStatuses
                where recordDelete_timeMillis is null`
        )
        .get().maxOrderNumber;

    if (currentOrderNumber !== maxOrderNumber) {
        database
            .prepare("update LotStatuses set orderNumber = ? + 1 where lotStatusId = ?")
            .run(maxOrderNumber, lotStatusId);

        database
            .prepare(
                `update LotStatuses
                    set orderNumber = orderNumber - 1
                    where recordDelete_timeMillis is null
                    and orderNumber > ?`
            )
            .run(currentOrderNumber);
    }

    database.close();

    clearLotStatusesCache();

    return true;
}

export default moveLotStatusDown;
