import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearWorkOrderTypesCache } from "../functions.cache.js";

import type * as recordTypes from "../../types/recordTypes";

interface UpdateWorkOrderTypeForm {
    workOrderTypeId: number | string;
    workOrderType: string;
}

export function updateWorkOrderType(
    workOrderTypeForm: UpdateWorkOrderTypeForm,
    requestSession: recordTypes.PartialSession
): boolean {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            `update WorkOrderTypes
                set workOrderType = ?,
                recordUpdate_userName = ?,
                recordUpdate_timeMillis = ?
                where workOrderTypeId = ?
                and recordDelete_timeMillis is null`
        )
        .run(
            workOrderTypeForm.workOrderType,
            requestSession.user.userName,
            rightNowMillis,
            workOrderTypeForm.workOrderTypeId
        );

    database.close();

    clearWorkOrderTypesCache();

    return result.changes > 0;
}

export default updateWorkOrderType;
