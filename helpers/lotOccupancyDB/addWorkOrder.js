import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { getNextWorkOrderNumber } from "./getNextWorkOrderNumber.js";
import { dateStringToInteger, dateToInteger } from "@cityssm/expressjs-server-js/dateTimeFns.js";
import addWorkOrderLotOccupancy from "./addWorkOrderLotOccupancy.js";
export const addWorkOrder = (workOrderForm, requestSession) => {
    const database = sqlite(databasePath);
    const rightNow = new Date();
    let workOrderNumber = workOrderForm.workOrderNumber;
    if (!workOrderNumber) {
        workOrderNumber = getNextWorkOrderNumber(database);
    }
    const result = database
        .prepare("insert into WorkOrders (" +
        "workOrderTypeId, workOrderNumber, workOrderDescription," +
        " workOrderOpenDate, workOrderCloseDate," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .run(workOrderForm.workOrderTypeId, workOrderNumber, workOrderForm.workOrderDescription, workOrderForm.workOrderOpenDateString
        ? dateStringToInteger(workOrderForm.workOrderOpenDateString)
        : dateToInteger(rightNow), workOrderForm.workOrderCloseDateString
        ? dateStringToInteger(workOrderForm.workOrderCloseDateString)
        : undefined, requestSession.user.userName, rightNow.getTime(), requestSession.user.userName, rightNow.getTime());
    const workOrderId = result.lastInsertRowid;
    if (workOrderForm.lotOccupancyId) {
        addWorkOrderLotOccupancy({
            workOrderId,
            lotOccupancyId: workOrderForm.lotOccupancyId
        }, requestSession, database);
    }
    database.close();
    return workOrderId;
};
export default addWorkOrder;
