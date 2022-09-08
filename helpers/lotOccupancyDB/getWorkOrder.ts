import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { dateIntegerToString } from "@cityssm/expressjs-server-js/dateTimeFns.js";

import { getLots } from "./getLots.js";

import { getLotOccupancies } from "./getLotOccupancies.js";

import type * as recordTypes from "../../types/recordTypes";

const baseSQL =
    "select w.workOrderId," +
    " w.workOrderTypeId, t.workOrderType," +
    " w.workOrderNumber, w.workOrderDescription," +
    " w.workOrderOpenDate, userFn_dateIntegerToString(w.workOrderOpenDate) as workOrderOpenDateString," +
    " w.workOrderCloseDate, userFn_dateIntegerToString(w.workOrderCloseDate) as workOrderCloseDateString" +
    " from WorkOrders w" +
    " left join WorkOrderTypes t on w.workOrderTypeId = t.workOrderTypeId" +
    " where w.recordDelete_timeMillis is null";

const _getWorkOrder = (
    sql: string,
    workOrderId_or_workOrderNumber: number | string
): recordTypes.WorkOrder => {
    const database = sqlite(databasePath, {
        readonly: true
    });

    database.function("userFn_dateIntegerToString", dateIntegerToString);

    const workOrder: recordTypes.WorkOrder = database
        .prepare(sql)
        .get(workOrderId_or_workOrderNumber);

    if (workOrder) {
        workOrder.workOrderLots = getLots(
            {
                workOrderId: workOrder.workOrderId
            },
            {
                limit: -1,
                offset: 0
            },
            database
        ).lots;

        workOrder.workOrderLotOccupancies = getLotOccupancies(
            {
                workOrderId: workOrder.workOrderId
            },
            {
                limit: -1,
                offset: 0,
                includeOccupants: true
            },
            database
        ).lotOccupancies;
    }

    database.close();

    return workOrder;
};

export const getWorkOrderByWorkOrderNumber = (
    workOrderNumber: string
): recordTypes.WorkOrder => {
    return _getWorkOrder(
        baseSQL + " and w.workOrderNumber = ?",
        workOrderNumber
    );
};

export const getWorkOrder = (
    workOrderId: number | string
): recordTypes.WorkOrder => {
    return _getWorkOrder(baseSQL + " and w.workOrderId = ?", workOrderId);
};

export default getWorkOrder;
