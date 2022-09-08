import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { dateIntegerToString, timeIntegerToString } from "@cityssm/expressjs-server-js/dateTimeFns.js";
export const getWorkOrderMilestones = (workOrderId, connectedDatabase) => {
    const database = connectedDatabase ||
        sqlite(databasePath, {
            readonly: true
        });
    database.function("userFn_dateIntegerToString", dateIntegerToString);
    database.function("userFn_timeIntegerToString", timeIntegerToString);
    const workOrderMilestones = database
        .prepare("select m.workOrderMilestoneId," +
        " m.workOrderMilestoneTypeId, t.workORderMilestoneType," +
        " m.workOrderMilestoneDate, userFn_dateIntegerToString(m.workOrderMilestoneDate) as workOrderMilestoneDateString," +
        " m.workOrderMilestoneTime, userFn_timeIntegerToString(m.workOrderMilestoneTime) as workOrderMilestoneTimeString," +
        " m.workOrderMilestoneDescription," +
        " m.recordCreate_userName, m.recordUpdate_userName" +
        " from WorkOrderMilestones m" +
        " left join WorkOrderMilestoneTypes t on m.workOrderMilestoneTypeId = t.workOrderMilestoneTypeId" +
        " where m.recordDelete_timeMillis is null" +
        " and m.workOrderId = ?" +
        " order by workOrderMilestoneDate desc, workOrderMilestoneTime desc, workOrderMilestoneId desc")
        .all(workOrderId);
    if (!connectedDatabase) {
        database.close();
    }
    return workOrderMilestones;
};
export default getWorkOrderMilestones;
