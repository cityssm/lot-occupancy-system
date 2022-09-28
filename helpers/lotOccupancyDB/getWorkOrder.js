import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { dateIntegerToString } from "@cityssm/expressjs-server-js/dateTimeFns.js";
import { getLots } from "./getLots.js";
import { getLotOccupancies } from "./getLotOccupancies.js";
import { getWorkOrderComments } from "./getWorkOrderComments.js";
import { getWorkOrderMilestones } from "./getWorkOrderMilestones.js";
const baseSQL = "select w.workOrderId," +
    " w.workOrderTypeId, t.workOrderType," +
    " w.workOrderNumber, w.workOrderDescription," +
    " w.workOrderOpenDate, userFn_dateIntegerToString(w.workOrderOpenDate) as workOrderOpenDateString," +
    " w.workOrderCloseDate, userFn_dateIntegerToString(w.workOrderCloseDate) as workOrderCloseDateString," +
    " w.recordCreate_timeMillis, w.recordUpdate_timeMillis" +
    " from WorkOrders w" +
    " left join WorkOrderTypes t on w.workOrderTypeId = t.workOrderTypeId" +
    " where w.recordDelete_timeMillis is null";
const _getWorkOrder = (sql, workOrderId_or_workOrderNumber, options, connectedDatabase) => {
    const database = connectedDatabase ||
        sqlite(databasePath, {
            readonly: true
        });
    database.function("userFn_dateIntegerToString", dateIntegerToString);
    const workOrder = database
        .prepare(sql)
        .get(workOrderId_or_workOrderNumber);
    if (workOrder) {
        if (options.includeLotsAndLotOccupancies) {
            workOrder.workOrderLots = getLots({
                workOrderId: workOrder.workOrderId
            }, {
                limit: -1,
                offset: 0
            }, database).lots;
            workOrder.workOrderLotOccupancies = getLotOccupancies({
                workOrderId: workOrder.workOrderId
            }, {
                limit: -1,
                offset: 0,
                includeOccupants: true
            }, database).lotOccupancies;
        }
        if (options.includeComments) {
            workOrder.workOrderComments = getWorkOrderComments(workOrder.workOrderId, database);
        }
        if (options.includeMilestones) {
            workOrder.workOrderMilestones = getWorkOrderMilestones({
                workOrderId: workOrder.workOrderId
            }, {
                includeWorkOrders: false,
                orderBy: "completion"
            }, database);
        }
    }
    if (!connectedDatabase) {
        database.close();
    }
    return workOrder;
};
export const getWorkOrderByWorkOrderNumber = (workOrderNumber) => {
    return _getWorkOrder(baseSQL + " and w.workOrderNumber = ?", workOrderNumber, {
        includeLotsAndLotOccupancies: true,
        includeComments: true,
        includeMilestones: true
    });
};
export const getWorkOrder = (workOrderId, options, connectedDatabase) => {
    return _getWorkOrder(baseSQL + " and w.workOrderId = ?", workOrderId, options, connectedDatabase);
};
export default getWorkOrder;
