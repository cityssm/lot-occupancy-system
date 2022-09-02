import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

interface AddWorkOrderLotOccupancyForm {
    workOrderId: number | string;
    lotOccupancyId: number | string;
}

export const addWorkOrderLotOccupancy = (
    workOrderLotOccupancyForm: AddWorkOrderLotOccupancyForm,
    requestSession: recordTypes.PartialSession
): boolean => {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            "insert into WorkOrderLotOccupancies (" +
                "workOrderId, lotOccupancyId," +
                " recordCreate_userName, recordCreate_timeMillis," +
                " recordUpdate_userName, recordUpdate_timeMillis)" +
                " values (?, ?, ?, ?, ?, ?)"
        )
        .run(
            workOrderLotOccupancyForm.workOrderId,
            workOrderLotOccupancyForm.lotOccupancyId,
            requestSession.user.userName,
            rightNowMillis,
            requestSession.user.userName,
            rightNowMillis
        );

    database.close();

    return result.changes > 0;
};

export default addWorkOrderLotOccupancy;
