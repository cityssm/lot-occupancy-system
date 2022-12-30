import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import {
    dateIntegerToString,
    timeIntegerToString
} from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as recordTypes from "../../types/recordTypes";

export function getWorkOrderComments(
    workOrderId: number | string,
    connectedDatabase?: sqlite.Database
): recordTypes.WorkOrderComment[] {
    const database =
        connectedDatabase ||
        sqlite(databasePath, {
            readonly: true
        });

    database.function("userFn_dateIntegerToString", dateIntegerToString);
    database.function("userFn_timeIntegerToString", timeIntegerToString);

    const workOrderComments = database
        .prepare(
            `select workOrderCommentId,
                workOrderCommentDate, userFn_dateIntegerToString(workOrderCommentDate) as workOrderCommentDateString,
                workOrderCommentTime, userFn_timeIntegerToString(workOrderCommentTime) as workOrderCommentTimeString,
                workOrderComment,
                recordCreate_userName, recordUpdate_userName
                from WorkOrderComments
                where recordDelete_timeMillis is null
                and workOrderId = ?
                order by workOrderCommentDate desc, workOrderCommentTime desc, workOrderCommentId desc`
        )
        .all(workOrderId);

    if (!connectedDatabase) {
        database.close();
    }

    return workOrderComments;
}

export default getWorkOrderComments;
