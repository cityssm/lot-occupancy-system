import sqlite from "better-sqlite3";

import {
    lotOccupancyDB as databasePath
} from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


export const deleteLotOccupancyOccupant =
    (lotOccupancyId: number | string,
        lotOccupantIndex: number | string,
        requestSession: recordTypes.PartialSession): boolean => {

        const database = sqlite(databasePath);

        const rightNowMillis = Date.now();

        const result = database
            .prepare("update LotOccupancyOccupants" +
                " set recordDelete_userName = ?," +
                " recordDelete_timeMillis = ?" +
                " where lotOccupancyId = ?" +
                " and lotOccupantIndex = ?")
            .run(requestSession.user.userName,
                rightNowMillis,
                lotOccupancyId,
                lotOccupantIndex);

        database.close();

        return (result.changes > 0);
    };


export default deleteLotOccupancyOccupant;