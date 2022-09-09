import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import { dateIntegerToString } from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as recordTypes from "../../types/recordTypes";

interface GetWorkOrdersFilters {
    workOrderTypeId?: number | string;
    workOrderOpenStatus?: "" | "open" | "closed";
}

interface GetWorkOrdersOptions {
    limit: number;
    offset: number;
}

export const getWorkOrders = (
    filters?: GetWorkOrdersFilters,
    options?: GetWorkOrdersOptions
): {
    count: number;
    workOrders: recordTypes.WorkOrder[];
} => {
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
    
    if (filters.workOrderOpenStatus) {
        if (filters.workOrderOpenStatus === "open") {
            sqlWhereClause += " and w.workOrderCloseDate is null";
        } else if (filters.workOrderOpenStatus === "closed") {
            sqlWhereClause += " and w.workOrderCloseDate is not null";
        }
    }

    const count: number = database
        .prepare(
            "select count(*) as recordCount" +
                " from WorkOrders w" +
                sqlWhereClause
        )
        .get(sqlParameters).recordCount;

    let workOrders: recordTypes.WorkOrder[] = [];

    if (count > 0) {
        workOrders = database
            .prepare(
                "select w.workOrderId," +
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
                        : "")
            )
            .all(sqlParameters);
    }

    database.close();

    return {
        count,
        workOrders
    };
};

export default getWorkOrders;
