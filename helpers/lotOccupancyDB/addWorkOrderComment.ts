import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as recordTypes from "../../types/recordTypes";

interface AddWorkOrderCommentForm {
    workOrderId: string;
    workOrderComment: string;
}

export const addWorkOrderComment = (
    workOrderCommentForm: AddWorkOrderCommentForm,
    requestSession: recordTypes.PartialSession
): number => {
    const database = sqlite(databasePath);

    const rightNow = new Date();

    const result = database
        .prepare(
            "insert into WorkOrderComments (" +
                "workOrderId, workOrderCommentDate, workOrderCommentTime, workOrderComment," +
                " recordCreate_userName, recordCreate_timeMillis," +
                " recordUpdate_userName, recordUpdate_timeMillis)" +
                " values (?, ?, ?, ?, ?, ?, ?, ?)"
        )
        .run(
            workOrderCommentForm.workOrderId,
            dateTimeFunctions.dateToInteger(rightNow),
            dateTimeFunctions.dateToTimeInteger(rightNow),
            workOrderCommentForm.workOrderComment,
            requestSession.user.userName,
            rightNow.getTime(),
            requestSession.user.userName,
            rightNow.getTime()
        );

    database.close();

    return result.lastInsertRowid as number;
};

export default addWorkOrderComment;
