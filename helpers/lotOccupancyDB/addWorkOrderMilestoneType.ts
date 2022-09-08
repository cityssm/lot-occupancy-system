import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { clearWorkOrderMilestoneTypesCache } from "../functions.cache.js";

import type * as recordTypes from "../../types/recordTypes";

interface AddWorkOrderMilestoneTypeForm {
    workOrderMilestoneType: string;
    orderNumber?: number;
}

export const addWorkOrderMilestoneType = (
    workOrderMilestoneTypeForm: AddWorkOrderMilestoneTypeForm,
    requestSession: recordTypes.PartialSession
): number => {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            "insert into WorkOrderMilestoneTypes (" +
                "workOrderMilestoneType, orderNumber," +
                " recordCreate_userName, recordCreate_timeMillis," +
                " recordUpdate_userName, recordUpdate_timeMillis)" +
                " values (?, ?, ?, ?, ?, ?)"
        )
        .run(
            workOrderMilestoneTypeForm.workOrderMilestoneType,
            workOrderMilestoneTypeForm.orderNumber || -1,
            requestSession.user.userName,
            rightNowMillis,
            requestSession.user.userName,
            rightNowMillis
        );

    database.close();

    clearWorkOrderMilestoneTypesCache();

    return result.lastInsertRowid as number;
};

export default addWorkOrderMilestoneType;
