import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearOccupancyTypesCache } from "../functions.cache.js";

import type * as recordTypes from "../../types/recordTypes";

interface AddOccupancyTypeForm {
    occupancyType: string;
    orderNumber?: number;
}

export function addOccupancyType(
    occupancyTypeForm: AddOccupancyTypeForm,
    requestSession: recordTypes.PartialSession
): number {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            `insert into OccupancyTypes (
                occupancyType, orderNumber,
                recordCreate_userName, recordCreate_timeMillis,
                recordUpdate_userName, recordUpdate_timeMillis)
                values (?, ?, ?, ?, ?, ?)`
        )
        .run(
            occupancyTypeForm.occupancyType,
            occupancyTypeForm.orderNumber || -1,
            requestSession.user.userName,
            rightNowMillis,
            requestSession.user.userName,
            rightNowMillis
        );

    database.close();

    clearOccupancyTypesCache();

    return result.lastInsertRowid as number;
}

export default addOccupancyType;
