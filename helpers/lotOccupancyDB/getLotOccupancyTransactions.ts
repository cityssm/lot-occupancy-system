import sqlite from "better-sqlite3";

import { lotOccupancyDB as databasePath } from "../../data/databasePaths.js";

import {
    dateIntegerToString,
    timeIntegerToString
} from "@cityssm/expressjs-server-js/dateTimeFns.js";

import type * as recordTypes from "../../types/recordTypes";

export const getLotOccupancyTransactions = (
    lotOccupancyId: number | string,
    connectedDatabase?: sqlite.Database
): recordTypes.LotOccupancyTransaction[] => {
    const database =
        connectedDatabase ||
        sqlite(databasePath, {
            readonly: true
        });

    database.function("userFn_dateIntegerToString", dateIntegerToString);
    database.function("userFn_timeIntegerToString", timeIntegerToString);

    const lotOccupancyTransactions: recordTypes.LotOccupancyTransaction[] =
        database
            .prepare(
                "select lotOccupancyId, transactionIndex," +
                    " transactionDate, userFn_dateIntegerToString(transactionDate) as transactionDateString," +
                    " transactionTime, userFn_timeIntegerToString(transactionTime) as transactionTimeString," +
                    " transactionAmount, externalReceiptNumber, transactionNote" +
                    " from LotOccupancyTransactions" +
                    " where recordDelete_timeMillis is null" +
                    " and lotOccupancyId = ?" +
                    " order by transactionDate, transactionTime, transactionIndex"
            )
            .all(lotOccupancyId);

    if (!connectedDatabase) {
        database.close();
    }

    return lotOccupancyTransactions;
};

export default getLotOccupancyTransactions;
