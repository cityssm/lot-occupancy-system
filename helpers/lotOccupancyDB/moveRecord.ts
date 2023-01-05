import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

type RecordTable =
    | "FeeCategories"
    | "LotOccupantTypes"
    | "LotStatuses"
    | "LotTypes"
    | "OccupancyTypes"
    | "WorkOrderMilestoneTypes"
    | "WorkOrderTypes";

const recordIdColumns: Map<RecordTable, string> = new Map();
recordIdColumns.set("FeeCategories", "feeCategoryId");
recordIdColumns.set("LotOccupantTypes", "lotOccupantTypeId");
recordIdColumns.set("LotStatuses", "lotStatusId");
recordIdColumns.set("LotTypes", "lotTypeId");
recordIdColumns.set("OccupancyTypes", "occupancyTypeId");
recordIdColumns.set("WorkOrderMilestoneTypes", "workOrderMilestoneTypeId");
recordIdColumns.set("WorkOrderTypes", "workOrderTypeId");

function getCurrentOrderNumber(
    recordTable: RecordTable,
    recordId: number | string,
    database: sqlite.Database
): number {
    const currentOrderNumber: number = database
        .prepare(
            `select orderNumber
                from ${recordTable}
                where ${recordIdColumns.get(recordTable)} = ?`
        )
        .get(recordId).orderNumber;

    return currentOrderNumber;
}

export function moveRecordDown(recordTable: RecordTable, recordId: number | string): boolean {
    const database = sqlite(databasePath);

    const currentOrderNumber = getCurrentOrderNumber(recordTable, recordId, database);

    database
        .prepare(
            `update ${recordTable}
                set orderNumber = orderNumber - 1
                where recordDelete_timeMillis is null
                and orderNumber = ? + 1`
        )
        .run(currentOrderNumber);

    const result = database
        .prepare(
            `update ${recordTable}
                set orderNumber = ? + 1
                where ${recordIdColumns.get(recordTable)} = ?`
        )
        .run(currentOrderNumber, recordId);

    database.close();

    return result.changes > 0;
}

export function moveRecordDownToBottom(recordTable: RecordTable, recordId: number | string): boolean {
    const database = sqlite(databasePath);

    const currentOrderNumber = getCurrentOrderNumber(recordTable, recordId, database);

    const maxOrderNumber: number = database
        .prepare(
            `select max(orderNumber) as maxOrderNumber
                from ${recordTable}
                where recordDelete_timeMillis is null`
        )
        .get().maxOrderNumber;

    if (currentOrderNumber !== maxOrderNumber) {
        database
            .prepare(
                `update ${recordTable} set orderNumber = ? + 1 where ${recordIdColumns.get(recordTable)} = ?`
            )
            .run(maxOrderNumber, recordId);

        database
            .prepare(
                `update ${recordTable}
                    set orderNumber = orderNumber - 1
                    where recordDelete_timeMillis is null
                    and orderNumber > ?`
            )
            .run(currentOrderNumber);
    }

    database.close();

    return true;
}

export function moveRecordUp(recordTable: RecordTable, recordId: number | string): boolean {
    const database = sqlite(databasePath);

    const currentOrderNumber = getCurrentOrderNumber(recordTable, recordId, database);

    if (currentOrderNumber <= 0) {
        database.close();
        return true;
    }

    database
        .prepare(
            `update ${recordTable}
                set orderNumber = orderNumber + 1
                where recordDelete_timeMillis is null
                and orderNumber = ? - 1`
        )
        .run(currentOrderNumber);

    const result = database
        .prepare(
            `update ${recordTable}
                set orderNumber = ? - 1
                where ${recordIdColumns.get(recordTable)} = ?`
        )
        .run(currentOrderNumber, recordId);

    database.close();

    return result.changes > 0;
}

export function moveRecordUpToTop(recordTable: RecordTable, recordId: number | string): boolean {
    const database = sqlite(databasePath);

    const currentOrderNumber = getCurrentOrderNumber(recordTable, recordId, database);

    if (currentOrderNumber > 0) {
        database
            .prepare(
                `update ${recordTable} set orderNumber = -1 where ${recordIdColumns.get(recordTable)} = ?`
            )
            .run(recordId);

        database
            .prepare(
                `update ${recordTable}
                    set orderNumber = orderNumber + 1
                    where recordDelete_timeMillis is null
                    and orderNumber < ?`
            )
            .run(currentOrderNumber);
    }

    database.close();

    return true;
}
