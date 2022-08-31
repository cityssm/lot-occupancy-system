import sqlite from "better-sqlite3";

import {
    lotOccupancyDB as databasePath
} from "../../data/databasePaths.js";

import {
    dateIntegerToString
} from "@cityssm/expressjs-server-js/dateTimeFns.js";

import {
    getLots
} from "./getLots.js";

import {
    getLotOccupancies
} from "./getLotOccupancies.js";

import type * as recordTypes from "../../types/recordTypes";



export const getWorkOrder = (workOrderId: number | string): recordTypes.WorkOrder => {

    const database = sqlite(databasePath, {
        readonly: true
    });

    database.function("userFn_dateIntegerToString", dateIntegerToString);

    const workOrder: recordTypes.WorkOrder = database
        .prepare("select w.workOrderId," +
            " w.workOrderTypeId, t.workOrderType," +
            " w.workOrderNumber, w.workOrderDescription," +
            " w.workOrderOpenDate, userFn_dateIntegerToString(w.workOrderOpenDate) as workOrderOpenDateString," +
            " w.workOrderCloseDate, userFn_dateIntegerToString(w.workOrderCloseDate) as workOrderCloseDateString" +
            " from WorkOrders w" +
            " left join WorkOrderTypes t on w.workOrderTypeId = t.workOrderTypeId" +
            " where w.recordDelete_timeMillis is null" +
            " and w.workOrderId = ?")
        .get(workOrderId);


    if (workOrder) {
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

    database.close();

    return workOrder;
};


export default getWorkOrder;