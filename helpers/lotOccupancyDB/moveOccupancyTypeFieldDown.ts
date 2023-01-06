import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearCacheByTableName } from "../functions.cache.js";

export function moveOccupancyTypeFieldDown(occupancyTypeFieldId: number | string): boolean {
    const database = sqlite(databasePath);

    const currentField: { occupancyTypeId?: number; orderNumber: number } = database
        .prepare(
            `select occupancyTypeId, orderNumber from OccupancyTypeFields where occupancyTypeFieldId = ?`
        )
        .get(occupancyTypeFieldId);

    database
        .prepare(
            "update OccupancyTypeFields" +
                " set orderNumber = orderNumber - 1" +
                " where recordDelete_timeMillis is null" +
                (currentField.occupancyTypeId
                    ? " and occupancyTypeId = '" + currentField.occupancyTypeId + "'"
                    : " and occupancyTypeId is null") +
                " and orderNumber = ? + 1"
        )
        .run(currentField.orderNumber);

    const result = database
        .prepare(
            `update OccupancyTypeFields set orderNumber = ? + 1 where occupancyTypeFieldId = ?`
        )
        .run(currentField.orderNumber, occupancyTypeFieldId);

    database.close();

    clearCacheByTableName("OccupancyTypeFields");

    return result.changes > 0;
}

export function moveOccupancyTypeFieldDownToBottom(occupancyTypeFieldId: number | string): boolean {
    const database = sqlite(databasePath);

    const currentField: { occupancyTypeId?: number; orderNumber: number } = database
        .prepare(
            `select occupancyTypeId, orderNumber
                from OccupancyTypeFields
                where occupancyTypeFieldId = ?`
        )
        .get(occupancyTypeFieldId);

    const occupancyTypeParameters = [];

    if (currentField.occupancyTypeId) {
        occupancyTypeParameters.push(currentField.occupancyTypeId);
    }

    const maxOrderNumber: number = database
        .prepare(
            "select max(orderNumber) as maxOrderNumber" +
                " from OccupancyTypeFields" +
                " where recordDelete_timeMillis is null" +
                (currentField.occupancyTypeId
                    ? " and occupancyTypeId = ?"
                    : " and occupancyTypeId is null")
        )
        .get(occupancyTypeParameters).maxOrderNumber;

    if (currentField.orderNumber !== maxOrderNumber) {
        database
            .prepare(
                "update OccupancyTypeFields set orderNumber = ? + 1 where occupancyTypeFieldId = ?"
            )
            .run(maxOrderNumber, occupancyTypeFieldId);

        occupancyTypeParameters.push(currentField.orderNumber);

        database
            .prepare(
                "update OccupancyTypeFields" +
                    " set orderNumber = orderNumber - 1" +
                    " where recordDelete_timeMillis is null" +
                    (currentField.occupancyTypeId
                        ? " and occupancyTypeId = ?"
                        : " and occupancyTypeId is null") +
                    " and orderNumber > ?"
            )
            .run(occupancyTypeParameters);
    }

    database.close();

    clearCacheByTableName("OccupancyTypeFields");

    return true;
}

export default moveOccupancyTypeFieldDown;
