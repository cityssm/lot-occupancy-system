import sqlite from "better-sqlite3";

import {
    lotOccupancyDB as databasePath
} from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


export const getLotOccupancyFees = (lotOccupancyId: number | string,
    connectedDatabase ? : sqlite.Database): recordTypes.LotOccupancyFee[] => {

    const database = connectedDatabase || sqlite(databasePath, {
        readonly: true
    });

    const lotOccupancyFees: recordTypes.LotOccupancyFee[] = database
            .prepare("select o.lotOccupancyId, o.feeId, o.feeAmount," +
            " f.feeName" +
            " from LotOccupancyFees o" +
            " left join Fees f on o.feeId = f.feeId" +
            " where o.recordDelete_timeMillis is null" +
            " and o.lotOccupancyId = ?" +
            " order by o.recordCreate_timeMillis")
            .all(lotOccupancyId);

    if (!connectedDatabase) {
        database.close();
    }

    return lotOccupancyFees;
};


export default getLotOccupancyFees;