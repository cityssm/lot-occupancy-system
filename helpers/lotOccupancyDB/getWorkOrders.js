import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";
import { dateIntegerToString } from "@cityssm/expressjs-server-js/dateTimeFns.js";
export const getWorkOrders = (filters, options) => {
    const database = sqlite(databasePath, {
        readonly: true
    });
    database.function("userFn_dateIntegerToString", dateIntegerToString);
    let sqlWhereClause = " where w.recordDelete_timeMillis is null";
    const sqlParameters = [];
    if (filters.workOrderTypeId) {
        sqlWhereClause += " and w.workOrderTypeId = ?";
        sqlParameters.push(filters.workOrderTypeId);
    }
    const count = database
        .prepare("select count(*) as recordCount" +
        " from WorkOrders w" +
        sqlWhereClause)
        .get(sqlParameters).recordCount;
    let workOrders = [];
    if (count > 0) {
        workOrders = database
            .prepare("select w.workOrderId," +
            " w.workOrderTypeId, t.workOrderType," +
            " w.workOrderNumber, w.workOrderDescription," +
            " w.workOrderOpenDate, userFn_dateIntegerToString(w.workOrderOpenDate) as workOrderOpenDateString," +
            " w.workOrderCloseDate, userFn_dateIntegerToString(w.workOrderCloseDate) as workOrderCloseDateString" +
            " from WorkOrders w" +
            " left join WorkOrderTypes t on w.workOrderTypeId = t.workOrderTypeId" +
            sqlWhereClause +
            " order by w.workOrderOpenDate desc, w.workOrderNumber" +
            (options
                ? " limit " +
                    options.limit +
                    " offset " +
                    options.offset
                : ""))
            .all(sqlParameters);
    }
    database.close();
    return {
        count,
        workOrders
    };
};
export default getWorkOrders;
