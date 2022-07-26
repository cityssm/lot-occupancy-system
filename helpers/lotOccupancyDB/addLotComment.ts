import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as recordTypes from "../../types/recordTypes";


interface AddLotCommentForm {
    lotId: string;
    lotComment: string;
}


export const addLotComment =
  (lotCommentForm: AddLotCommentForm, requestSession: recordTypes.PartialSession): number => {

    const database = sqlite(databasePath);

    const rightNow = new Date();

    const result = database
      .prepare("insert into LotComments (" +
        "lotId, lotCommentDate, lotCommentTime, lotComment," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?, ?, ?)")
      .run(lotCommentForm.lotId,
        dateTimeFunctions.dateToInteger(rightNow),
        dateTimeFunctions.dateToTimeInteger(rightNow),
        lotCommentForm.lotComment,
        requestSession.user.userName,
        rightNow.getTime(),
        requestSession.user.userName,
        rightNow.getTime());

    database.close();

    return result.lastInsertRowid as number;
  };


export default addLotComment;