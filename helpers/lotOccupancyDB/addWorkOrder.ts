import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import {
    dateStringToInteger,
    dateToInteger
} from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as recordTypes from "../../types/recordTypes";

interface AddWorkOrderForm {
    workOrderTypeId: number | string;
    workOrderNumber: string;
    workOrderDescription: string;
    workOrderOpenDateString?: string;
    workOrderCloseDateString?: string;
}

export const addWorkOrder = (
    workOrderForm: AddWorkOrderForm,
    requestSession: recordTypes.PartialSession
): number => {
    const database = sqlite(databasePath);

    const rightNow = new Date();

    const result = database
        .prepare(
            "insert into WorkOrders (" +
                "workOrderTypeId, workOrderNumber, workOrderDescription," +
                " workOrderOpenDate, workOrderCloseDate," +
                " recordCreate_userName, recordCreate_timeMillis," +
                " recordUpdate_userName, recordUpdate_timeMillis)" +
                " values (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        )
        .run(
            workOrderForm.workOrderTypeId,
            workOrderForm.workOrderNumber,
            workOrderForm.workOrderDescription,
            workOrderForm.workOrderOpenDateString
                ? dateStringToInteger(workOrderForm.workOrderOpenDateString)
                : dateToInteger(rightNow),
            workOrderForm.workOrderCloseDateString
                ? dateStringToInteger(workOrderForm.workOrderCloseDateString)
                : undefined,
            requestSession.user.userName,
            rightNow.getTime(),
            requestSession.user.userName,
            rightNow.getTime()
        );

    database.close();

    return result.lastInsertRowid as number;
};

export default addWorkOrder;
