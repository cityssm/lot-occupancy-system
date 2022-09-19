import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";

export const deleteWorkOrder = (
    workOrderId: number | string,
    requestSession: recordTypes.PartialSession
): boolean => {
    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
        .prepare(
            "update WorkOrders" +
                " set recordDelete_userName = ?," +
                " recordDelete_timeMillis = ?" +
                " where workOrderId = ?"
        )
        .run(requestSession.user.userName, rightNowMillis, workOrderId);

    database
        .prepare(
            "update WorkOrderComments" +
                " set recordDelete_userName = ?," +
                " recordDelete_timeMillis = ?" +
                " where workOrderId = ?"
        )
        .run(requestSession.user.userName, rightNowMillis, workOrderId);

    database
        .prepare(
            "update WorkOrderLotOccupancies" +
                " set recordDelete_userName = ?," +
                " recordDelete_timeMillis = ?" +
                " where workOrderId = ?"
        )
        .run(requestSession.user.userName, rightNowMillis, workOrderId);
    
    database
        .prepare(
            "update WorkOrderLots" +
                " set recordDelete_userName = ?," +
                " recordDelete_timeMillis = ?" +
                " where workOrderId = ?"
        )
        .run(requestSession.user.userName, rightNowMillis, workOrderId);    

    database
        .prepare(
            "update WorkOrderMilestones" +
                " set recordDelete_userName = ?," +
                " recordDelete_timeMillis = ?" +
                " where workOrderId = ?"
        )
        .run(requestSession.user.userName, rightNowMillis, workOrderId);

    database.close();

    return result.changes > 0;
};

export default deleteWorkOrder;
