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

    const row: { recordDelete_timeMillis?: number } = database
        .prepare(
            "select recordDelete_timeMillis" +
                " from WorkOrderLotOccupancies" +
                " where workOrderId = ?" +
                " and lotOccupancyId = ?"
        )
        .get(workOrderLotOccupancyForm.workOrderId, workOrderLotOccupancyForm.lotOccupancyId);

    if (row) {
        if (row.recordDelete_timeMillis) {
            database
                .prepare(
                    "update WorkOrderLotOccupancies" +
                        " set recordCreate_userName = ?," +
                        " recordCreate_timeMillis = ?," +
                        " recordUpdate_userName = ?," +
                        " recordUpdate_timeMillis = ?," +
                        " recordDelete_userName = null," +
                        " recordDelete_timeMillis = null" +
                        " where workOrderId = ?" +
                        " and lotOccupancyId = ?"
                )
                .run(
                    requestSession.user.userName,
                    rightNowMillis,
                    requestSession.user.userName,
                    rightNowMillis,
                    workOrderLotOccupancyForm.workOrderId,
                    workOrderLotOccupancyForm.lotOccupancyId
                );
        }
    } else {
        database
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
    }

    database.close();

    return true;
};

export default addWorkOrderLotOccupancy;
