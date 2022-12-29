import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearLotTypesCache } from "../functions.cache.js";

import type * as recordTypes from "../../types/recordTypes";

interface AddLotTypeForm {
    lotType: string;
    orderNumber?: number;
}

export function addLotType(
    lotTypeForm: AddLotTypeForm,
    requestSession: recordTypes.PartialSession
): number {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            `insert into LotTypes (
                lotType, orderNumber,
                recordCreate_userName, recordCreate_timeMillis,
                recordUpdate_userName, recordUpdate_timeMillis)
                values (?, ?, ?, ?, ?, ?)`
        )
        .run(
            lotTypeForm.lotType,
            lotTypeForm.orderNumber || -1,
            requestSession.user.userName,
            rightNowMillis,
            requestSession.user.userName,
            rightNowMillis
        );

    database.close();

    clearLotTypesCache();

    return result.lastInsertRowid as number;
}

export default addLotType;
