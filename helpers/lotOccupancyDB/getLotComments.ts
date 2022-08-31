import sqlite from "better-sqlite3";

import {
    lotOccupancyDB as databasePath
} from "../../data/databasePaths.js";

import {
    dateIntegerToString,
    timeIntegerToString
} from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as recordTypes from "../../types/recordTypes";


export const getLotComments = (lotId: number | string, connectedDatabase ? : sqlite.Database): recordTypes.LotComment[] => {

    const database = connectedDatabase || sqlite(databasePath, {
        readonly: true
    });

    database.function("userFn_dateIntegerToString", dateIntegerToString);
    database.function("userFn_timeIntegerToString", timeIntegerToString);

    const lotComments = database
        .prepare("select lotCommentId," +
            " lotCommentDate, userFn_dateIntegerToString(lotCommentDate) as lotCommentDateString," +
            " lotCommentTime, userFn_timeIntegerToString(lotCommentTime) as lotCommentTimeString," +
            " lotComment," +
            " recordCreate_userName, recordUpdate_userName" +
            " from LotComments" +
            " where recordDelete_timeMillis is null" +
            " and lotId = ?" +
            " order by lotCommentDate desc, lotCommentTime desc, lotCommentId desc")
        .all(lotId);

    if (!connectedDatabase) {
        database.close();
    }

    return lotComments;
};


export default getLotComments;