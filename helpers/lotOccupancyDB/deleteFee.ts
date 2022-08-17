import sqlite from "better-sqlite3";

import {
    lotOccupancyDB as databasePath
} from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


export const deleteFee =
    (feeId: number | string,
        requestSession: recordTypes.PartialSession): boolean => {

        const database = sqlite(databasePath);

        const rightNowMillis = Date.now();

        const result = database
            .prepare("update Fees" +
                " set recordDelete_userName = ?," +
                " recordDelete_timeMillis = ?" +
                " where feeId = ?")
            .run(requestSession.user.userName,
                rightNowMillis,
                feeId);

        database.close();

        return (result.changes > 0);
    };


export default deleteFee;