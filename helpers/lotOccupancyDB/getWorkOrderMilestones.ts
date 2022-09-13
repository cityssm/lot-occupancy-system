import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import {
    dateIntegerToString,
    timeIntegerToString
} from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as recordTypes from "../../types/recordTypes";

export const getWorkOrderMilestones = (
    workOrderId: number | string,
    connectedDatabase?: sqlite.Database
): recordTypes.WorkOrderMilestone[] => {
    const database =
        connectedDatabase ||
        sqlite(databasePath, {
            readonly: true
        });

    database.function("userFn_dateIntegerToString", dateIntegerToString);
    database.function("userFn_timeIntegerToString", timeIntegerToString);

    const workOrderMilestones = database
        .prepare(
            "select m.workOrderMilestoneId," +
                " m.workOrderMilestoneTypeId, t.workORderMilestoneType," +
                " m.workOrderMilestoneDate, userFn_dateIntegerToString(m.workOrderMilestoneDate) as workOrderMilestoneDateString," +
                " m.workOrderMilestoneTime, userFn_timeIntegerToString(m.workOrderMilestoneTime) as workOrderMilestoneTimeString," +
                " m.workOrderMilestoneDescription," +
                " m.workOrderMilestoneCompletionDate, userFn_dateIntegerToString(m.workOrderMilestoneCompletionDate) as workOrderMilestoneCompletionDateString," +
                " m.workOrderMilestoneCompletionTime, userFn_timeIntegerToString(m.workOrderMilestoneCompletionTime) as workOrderMilestoneCompletionTimeString," +
                " m.recordCreate_userName, m.recordUpdate_userName" +
                " from WorkOrderMilestones m" +
                " left join WorkOrderMilestoneTypes t on m.workOrderMilestoneTypeId = t.workOrderMilestoneTypeId" +
                " where m.recordDelete_timeMillis is null" +
                " and m.workOrderId = ?" +
                " order by" +
                " m.workOrderMilestoneCompletionDate, m.workOrderMilestoneCompletionTime," +
                " m.workOrderMilestoneDate, case when m.workOrderMilestoneTime = 0 then 9999 else m.workOrderMilestoneTime end," +
                " t.orderNumber, m.workOrderMilestoneId"
        )
        .all(workOrderId);

    if (!connectedDatabase) {
        database.close();
    }

    return workOrderMilestones;
};

export default getWorkOrderMilestones;
