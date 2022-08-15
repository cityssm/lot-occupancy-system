import sqlite from "better-sqlite3";

import {
    lotOccupancyDB as databasePath
} from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


export const deleteLotOccupancyComment =
    (lotOccupancyCommentId: number | string,
        requestSession: recordTypes.PartialSession): boolean => {

        const database = sqlite(databasePath);

        const rightNowMillis = Date.now();

        const result = database
            .prepare("update LotOccupancyComments" +
                " set recordDelete_userName = ?," +
                " recordDelete_timeMillis = ?" +
                " where lotOccupancyCommentId = ?")
            .run(requestSession.user.userName,
                rightNowMillis,
                lotOccupancyCommentId);

        database.close();

        return (result.changes > 0);
    };


export default deleteLotOccupancyComment;