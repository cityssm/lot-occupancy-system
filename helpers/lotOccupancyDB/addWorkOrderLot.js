import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
export const addWorkOrderLot = (workOrderLotForm, requestSession) => {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare("insert into WorkOrderLots (" +
        "workOrderId, lotId," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?)")
        .run(workOrderLotForm.workOrderId, workOrderLotForm.lotId, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.close();
    return result.changes > 0;
};
export default addWorkOrderLot;
