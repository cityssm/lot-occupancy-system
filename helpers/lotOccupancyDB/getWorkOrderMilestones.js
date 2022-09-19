import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { getWorkOrder } from "./getWorkOrder.js";
import { dateIntegerToString, dateStringToInteger, dateToInteger, timeIntegerToString } from "@cityssm/expressjs-server-js/dateTimeFns.js";
import * as configFunctions from "../functions.config.js";
const commaSeparatedNumbersRegex = /^\d+(,\d+)*$/;
export const getWorkOrderMilestones = (filters, options, connectedDatabase) => {
    const database = connectedDatabase ||
        sqlite(databasePath, {
            readonly: true
        });
    database.function("userFn_dateIntegerToString", dateIntegerToString);
    database.function("userFn_timeIntegerToString", timeIntegerToString);
    let sqlWhereClause = " where m.recordDelete_timeMillis is null and w.recordDelete_timeMillis is null";
    const sqlParameters = [];
    if (filters.workOrderId) {
        sqlWhereClause += " and m.workOrderId = ?";
        sqlParameters.push(filters.workOrderId);
    }
    const date = new Date();
    const currentDateNumber = dateToInteger(date);
    date.setDate(date.getDate() -
        configFunctions.getProperty("settings.workOrders.workOrderMilestoneDateRecentBeforeDays"));
    const recentBeforeDateNumber = dateToInteger(date);
    date.setDate(date.getDate() +
        configFunctions.getProperty("settings.workOrders.workOrderMilestoneDateRecentBeforeDays") +
        configFunctions.getProperty("settings.workOrders.workOrderMilestoneDateRecentAfterDays"));
    const recentAfterDateNumber = dateToInteger(date);
    switch (filters.workOrderMilestoneDateFilter) {
        case "upcomingMissed":
            sqlWhereClause +=
                " and (m.workOrderMilestoneCompletionDate is null or m.workOrderMilestoneDate >= ?)";
            sqlParameters.push(currentDateNumber);
            break;
        case "recent":
            sqlWhereClause +=
                " and m.workOrderMilestoneDate >= ? and m.workOrderMilestoneDate <= ?";
            sqlParameters.push(recentBeforeDateNumber, recentAfterDateNumber);
            break;
    }
    if (filters.workOrderMilestoneDateString) {
        sqlWhereClause += " and m.workOrderMilestoneDate = ?";
        sqlParameters.push(dateStringToInteger(filters.workOrderMilestoneDateString));
    }
    if (filters.workOrderTypeIds &&
        commaSeparatedNumbersRegex.test(filters.workOrderTypeIds)) {
        sqlWhereClause +=
            " and w.workOrderTypeId in (" + filters.workOrderTypeIds + ")";
    }
    if (filters.workOrderMilestoneTypeIds &&
        commaSeparatedNumbersRegex.test(filters.workOrderMilestoneTypeIds)) {
        sqlWhereClause +=
            " and m.workOrderMilestoneTypeId in (" +
                filters.workOrderMilestoneTypeIds +
                ")";
    }
    let orderByClause = "";
    switch (options.orderBy) {
        case "completion":
            orderByClause =
                " order by" +
                    " m.workOrderMilestoneCompletionDate, m.workOrderMilestoneCompletionTime," +
                    " m.workOrderMilestoneDate, case when m.workOrderMilestoneTime = 0 then 9999 else m.workOrderMilestoneTime end," +
                    " t.orderNumber, m.workOrderMilestoneId";
            break;
        case "date":
            orderByClause =
                " order by m.workOrderMilestoneDate, case when m.workOrderMilestoneTime = 0 then 9999 else m.workOrderMilestoneTime end," +
                    " t.orderNumber, m.workOrderId, m.workOrderMilestoneId";
    }
    const workOrderMilestones = database
        .prepare("select m.workOrderId, m.workOrderMilestoneId," +
        " m.workOrderMilestoneTypeId, t.workOrderMilestoneType," +
        " m.workOrderMilestoneDate, userFn_dateIntegerToString(m.workOrderMilestoneDate) as workOrderMilestoneDateString," +
        " m.workOrderMilestoneTime, userFn_timeIntegerToString(m.workOrderMilestoneTime) as workOrderMilestoneTimeString," +
        " m.workOrderMilestoneDescription," +
        " m.workOrderMilestoneCompletionDate, userFn_dateIntegerToString(m.workOrderMilestoneCompletionDate) as workOrderMilestoneCompletionDateString," +
        " m.workOrderMilestoneCompletionTime, userFn_timeIntegerToString(m.workOrderMilestoneCompletionTime) as workOrderMilestoneCompletionTimeString," +
        " m.recordCreate_userName, m.recordCreate_timeMillis," +
        " m.recordUpdate_userName, m.recordUpdate_timeMillis" +
        " from WorkOrderMilestones m" +
        " left join WorkOrderMilestoneTypes t on m.workOrderMilestoneTypeId = t.workOrderMilestoneTypeId" +
        " left join WorkOrders w on m.workOrderId = w.workOrderId" +
        sqlWhereClause +
        orderByClause)
        .all(sqlParameters);
    if (options.includeWorkOrders) {
        for (const workOrderMilestone of workOrderMilestones) {
            workOrderMilestone.workOrder = getWorkOrder(workOrderMilestone.workOrderId, {
                includeLotsAndLotOccupancies: true,
                includeComments: false,
                includeMilestones: false
            }, database);
        }
    }
    if (!connectedDatabase) {
        database.close();
    }
    return workOrderMilestones;
};
export default getWorkOrderMilestones;
