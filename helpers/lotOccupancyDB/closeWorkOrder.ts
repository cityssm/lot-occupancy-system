import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import {
    dateStringToInteger,
    dateToInteger
} from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as recordTypes from "../../types/recordTypes";

interface AddWorkOrderForm {
    workOrderId: number | string;
    workOrderCloseDateString?: string;
}

export const closeWorkOrder = (
    workOrderForm: AddWorkOrderForm,
    requestSession: recordTypes.PartialSession
): boolean => {
    const database = sqlite(databasePath);

    const rightNow = new Date();

    const result = database
        .prepare(
            "update WorkOrders" +
            " set workOrderCloseDate = ?," +
            " recordUpdate_userName = ?," +
            " recordUpdate_timeMillis = ?" +
            " where workOrderId = ?"
        )
        .run(
            workOrderForm.workOrderCloseDateString
                ? dateStringToInteger(workOrderForm.workOrderCloseDateString)
                : dateToInteger(new Date()),
            requestSession.user.userName,
            rightNow.getTime(),
            workOrderForm.workOrderId
        );

    database.close();

    return result.changes > 0;
};

export default closeWorkOrder;
