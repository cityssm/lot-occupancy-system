import { dateStringToInteger } from "@cityssm/expressjs-server-js/dateTimeFns.js";
import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export function updateWorkOrder(workOrderForm, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update WorkOrders
                set workOrderNumber = ?,
                workOrderTypeId = ?,
                workOrderDescription = ?,
                workOrderOpenDate = ?,
                recordUpdate_userName = ?,
                recordUpdate_timeMillis = ?
                where workOrderId = ?
                and recordDelete_timeMillis is null`)
        .run(workOrderForm.workOrderNumber, workOrderForm.workOrderTypeId, workOrderForm.workOrderDescription, dateStringToInteger(workOrderForm.workOrderOpenDateString), requestSession.user.userName, rightNowMillis, workOrderForm.workOrderId);
    database.close();
    return result.changes > 0;
}
export default updateWorkOrder;
