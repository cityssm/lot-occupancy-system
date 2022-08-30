import sqlite from "better-sqlite3";

import {
    lotOccupancyDB as databasePath
} from "../../data/databasePaths.js";


export const getPreviousLotId = (lotId: number | string): number => {

    const database = sqlite(databasePath, {
        readonly: true
    });

    const result: {
            lotId: number
        } = database
        .prepare("select lotId from Lots" +
            " where recordDelete_timeMillis is null" +
            " and lotName < (select lotName from Lots where lotId = ?)" +
            " order by lotName desc" +
            " limit 1")
        .get(lotId);

    database.close();

    if (result) {
        return result.lotId;
    }

    return undefined;
};


export default getPreviousLotId;