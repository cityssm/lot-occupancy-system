import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearOccupancyTypesCache } from "../functions.cache.js";

export function moveOccupancyTypeUp(occupancyTypeId: number | string): boolean {
    const database = sqlite(databasePath);

    const currentOrderNumber: number = database
        .prepare("select orderNumber from OccupancyTypes where occupancyTypeId = ?")
        .get(occupancyTypeId).orderNumber;

    if (currentOrderNumber <= 0) {
        database.close();
        return true;
    }

    database
        .prepare(
            `update OccupancyTypes
                set orderNumber = orderNumber + 1
                where recordDelete_timeMillis is null
                and orderNumber = ? - 1`
        )
        .run(currentOrderNumber);

    const result = database
        .prepare("update OccupancyTypes set orderNumber = ? - 1 where occupancyTypeId = ?")
        .run(currentOrderNumber, occupancyTypeId);

    database.close();

    clearOccupancyTypesCache();

    return result.changes > 0;
}

export function moveOccupancyTypeUpToTop(occupancyTypeId: number | string): boolean {
    const database = sqlite(databasePath);

    const currentOrderNumber: number = database
        .prepare("select orderNumber from OccupancyTypes where occupancyTypeId = ?")
        .get(occupancyTypeId).orderNumber;

    if (currentOrderNumber > 0) {
        database
            .prepare("update OccupancyTypes set orderNumber = -1 where occupancyTypeId = ?")
            .run(occupancyTypeId);

        database
            .prepare(
                `update OccupancyTypes
                    set orderNumber = orderNumber + 1
                    where recordDelete_timeMillis is null
                    and orderNumber < ?`
            )
            .run(currentOrderNumber);
    }

    database.close();

    clearOccupancyTypesCache();

    return true;
}

export default moveOccupancyTypeUp;
