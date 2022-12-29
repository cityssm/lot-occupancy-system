import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";
import { clearOccupancyTypesCache } from "../functions.cache.js";

interface AddOccupancyTypeFieldForm {
    occupancyTypeId?: string | number;
    occupancyTypeField: string;
    occupancyTypeFieldValues?: string;
    isRequired?: string;
    pattern?: string;
    minimumLength: string | number;
    maximumLength: string | number;
    orderNumber?: number;
}

export function addOccupancyTypeField(
    occupancyTypeFieldForm: AddOccupancyTypeFieldForm,
    requestSession: recordTypes.PartialSession
): number {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            `insert into OccupancyTypeFields (
                occupancyTypeId, occupancyTypeField,
                occupancyTypeFieldValues, isRequired, pattern,
                minimumLength, maximumLength,
                orderNumber,
                recordCreate_userName, recordCreate_timeMillis,
                recordUpdate_userName, recordUpdate_timeMillis)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
            occupancyTypeFieldForm.occupancyTypeId || undefined,
            occupancyTypeFieldForm.occupancyTypeField,
            occupancyTypeFieldForm.occupancyTypeFieldValues || "",
            occupancyTypeFieldForm.isRequired ? 1 : 0,
            occupancyTypeFieldForm.pattern || "",
            occupancyTypeFieldForm.minimumLength || 0,
            occupancyTypeFieldForm.maximumLength || 100,
            occupancyTypeFieldForm.orderNumber || -1,
            requestSession.user.userName,
            rightNowMillis,
            requestSession.user.userName,
            rightNowMillis
        );

    database.close();

    clearOccupancyTypesCache();

    return result.lastInsertRowid as number;
}

export default addOccupancyTypeField;
