import { dateStringToInteger, timeStringToInteger } from "@cityssm/expressjs-server-js/dateTimeFns.js";
import sqlite from "better-sqlite3";
import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


interface AddLotOccupancyCommentForm {
    lotOccupancyId: string | number;
    lotOccupancyCommentDateString: string;
    lotOccupancyCommentTimeString: string;
    lotOccupancyComment: string;
}


export const addLotOccupancyComment =
  (commentForm: AddLotOccupancyCommentForm, requestSession: recordTypes.PartialSession): number => {

    const database = sqlite(databasePath);

    const rightNowMillis = Date.now();

    const result = database
      .prepare("insert into LotOccupancyComments (" +
        "lotOccupancyId, lotOccupancyCommentDate, lotOccupancyCommentTime, lotOccupancyComment," +
        " recordCreate_userName, recordCreate_timeMillis," +
        " recordUpdate_userName, recordUpdate_timeMillis)" +
        " values (?, ?, ?, ?, ?, ?, ?, ?)")
      .run(commentForm.lotOccupancyId,
        dateStringToInteger(commentForm.lotOccupancyCommentDateString),
        timeStringToInteger(commentForm.lotOccupancyCommentTimeString),
        commentForm.lotOccupancyComment,
        requestSession.user.userName,
        rightNowMillis,
        requestSession.user.userName,
        rightNowMillis);

    database.close();

    return result.lastInsertRowid as number;
  };


export default addLotOccupancyComment;