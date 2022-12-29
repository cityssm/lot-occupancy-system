import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";
import { clearLotTypesCache } from "../functions.cache.js";

interface AddLotTypeFieldForm {
    lotTypeId: string | number;
    lotTypeField: string;
    lotTypeFieldValues?: string;
    isRequired?: string;
    pattern?: string;
    minimumLength: string | number;
    maximumLength: string | number;
    orderNumber?: number;
}

export function addLotTypeField(
    lotTypeFieldForm: AddLotTypeFieldForm,
    requestSession: recordTypes.PartialSession
): number {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            `insert into LotTypeFields (
                lotTypeId, lotTypeField, lotTypeFieldValues,
                isRequired, pattern,
                minimumLength, maximumLength,
                orderNumber,
                recordCreate_userName, recordCreate_timeMillis,
                recordUpdate_userName, recordUpdate_timeMillis)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
            lotTypeFieldForm.lotTypeId,
            lotTypeFieldForm.lotTypeField,
            lotTypeFieldForm.lotTypeFieldValues || "",
            lotTypeFieldForm.isRequired ? 1 : 0,
            lotTypeFieldForm.pattern || "",
            lotTypeFieldForm.minimumLength || 0,
            lotTypeFieldForm.maximumLength || 100,
            lotTypeFieldForm.orderNumber || -1,
            requestSession.user.userName,
            rightNowMillis,
            requestSession.user.userName,
            rightNowMillis
        );

    database.close();

    clearLotTypesCache();

    return result.lastInsertRowid as number;
}

export default addLotTypeField;
