import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { getWorkOrderTypeById, clearWorkOrderTypesCache } from "../functions.cache.js";

export function moveWorkOrderTypeUp(workOrderTypeId: number | string): boolean {
    const currentOrderNumber: number = getWorkOrderTypeById(
        typeof workOrderTypeId === "string" ? Number.parseInt(workOrderTypeId) : workOrderTypeId
    ).orderNumber;

    if (currentOrderNumber <= 0) {
        return true;
    }

    const database = sqlite(databasePath);

    database
        .prepare(
            `update WorkOrderTypes
                set orderNumber = orderNumber + 1
                where recordDelete_timeMillis is null
                and orderNumber = ? - 1`
        )
        .run(currentOrderNumber);

    const result = database
        .prepare(`update WorkOrderTypes set orderNumber = ? - 1 where workOrderTypeId = ?`)
        .run(currentOrderNumber, workOrderTypeId);

    database.close();

    clearWorkOrderTypesCache();

    return result.changes > 0;
}

export function moveWorkOrderTypeUpToTop(workOrderTypeId: number | string): boolean {
    const currentOrderNumber: number = getWorkOrderTypeById(
        typeof workOrderTypeId === "string" ? Number.parseInt(workOrderTypeId) : workOrderTypeId
    ).orderNumber;

    if (currentOrderNumber > 0) {
        const database = sqlite(databasePath);

        database
            .prepare("update WorkOrderTypes set orderNumber = -1 where workOrderTypeId = ?")
            .run(workOrderTypeId);

        database
            .prepare(
                `update WorkOrderTypes
                    set orderNumber = orderNumber + 1
                    where recordDelete_timeMillis is null
                    and orderNumber < ?`
            )
            .run(currentOrderNumber);

        database.close();

        clearWorkOrderTypesCache();
    }

    return true;
}

export default moveWorkOrderTypeUp;
