import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearCacheByTableName } from "../functions.cache.js";

export function moveOccupancyTypePrintUp(
    occupancyTypeId: number | string,
    printEJS: string
): boolean {
    const database = sqlite(databasePath);

    const currentOrderNumber = database
        .prepare(
            `select orderNumber from OccupancyTypePrints where occupancyTypeId = ? and printEJS = ?`
        )
        .get(occupancyTypeId, printEJS).orderNumber;

    if (currentOrderNumber <= 0) {
        database.close();
        return true;
    }

    database
        .prepare(
            `update OccupancyTypePrints
                set orderNumber = orderNumber + 1
                where recordDelete_timeMillis is null
                and occupancyTypeId = ?
                and orderNumber = ? - 1`
        )
        .run(occupancyTypeId, currentOrderNumber);

    const result = database
        .prepare(
            `update OccupancyTypePrints set orderNumber = ? - 1 where occupancyTypeId = ? and printEJS = ?`
        )
        .run(currentOrderNumber, occupancyTypeId, printEJS);

    database.close();

    clearCacheByTableName("OccupancyTypePrints");

    return result.changes > 0;
}

export function moveOccupancyTypePrintUpToTop(
    occupancyTypeId: number | string,
    printEJS: string
): boolean {
    const database = sqlite(databasePath);

    const currentOrderNumber = database
        .prepare(
            `select orderNumber from OccupancyTypePrints where occupancyTypeId = ? and printEJS = ?`
        )
        .get(occupancyTypeId, printEJS).orderNumber;

    if (currentOrderNumber > 0) {
        database
            .prepare(
                `update OccupancyTypePrints
                    set orderNumber = -1
                    where occupancyTypeId = ?
                    and printEJS = ?`
            )
            .run(occupancyTypeId, printEJS);

        database
            .prepare(
                `update OccupancyTypePrints
                    set orderNumber = orderNumber + 1
                    where recordDelete_timeMillis is null
                    and occupancyTypeId = ?
                    and orderNumber < ?`
            )
            .run(occupancyTypeId, currentOrderNumber);
    }

    database.close();

    clearCacheByTableName("OccupancyTypePrints");

    return true;
}

export default moveOccupancyTypePrintUp;
