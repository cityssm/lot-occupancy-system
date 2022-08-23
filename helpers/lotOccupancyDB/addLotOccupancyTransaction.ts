import {
    dateStringToInteger,
    dateToInteger,
    dateToTimeInteger,
    timeStringToInteger
} from "@cityssm/expressjs-server-js/dateTimeFns.js";
import sqlite from "better-sqlite3";

import {
    lotOccupancyDB as databasePath
} from "../../data/databasePaths.js";

import type * as recordTypes from "../../types/recordTypes";


interface AddLotOccupancyTransactionForm {
    lotOccupancyId: string | number;
    transactionDateString ? : string;
    transactionTimeString ? : string;
    transactionAmount: string | number;
    externalReceiptNumber: string;
    transactionNote: string;
}


export const addLotOccupancyTransaction =
    (lotOccupancyTransactionForm: AddLotOccupancyTransactionForm, requestSession: recordTypes.PartialSession): number => {

        const database = sqlite(databasePath);

        let transactionIndex = 0;

        const maxIndexResult = database.prepare("select transactionIndex" +
                " from LotOccupancyTransactions" +
                " where lotOccupancyId = ?" +
                " order by transactionIndex desc" +
                " limit 1")
            .get(lotOccupancyTransactionForm.lotOccupancyId);

        if (maxIndexResult) {
            transactionIndex = maxIndexResult.transactionIndex + 1;
        }

        const rightNow = new Date();

        const transactionDate = lotOccupancyTransactionForm.transactionDateString ?
            dateStringToInteger(lotOccupancyTransactionForm.transactionDateString) :
            dateToInteger(rightNow);

        const transactionTime = lotOccupancyTransactionForm.transactionTimeString ?
            timeStringToInteger(lotOccupancyTransactionForm.transactionTimeString) :
            dateToTimeInteger(rightNow);

        database
            .prepare("insert into LotOccupancyTransactions (" +
                "lotOccupancyId, transactionIndex," +
                " transactionDate, transactionTime," +
                " transactionAmount, externalReceiptNumber," +
                " transactionNote," +
                " recordCreate_userName, recordCreate_timeMillis," +
                " recordUpdate_userName, recordUpdate_timeMillis)" +
                " values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
            .run(lotOccupancyTransactionForm.lotOccupancyId,
                transactionIndex,
                transactionDate,
                transactionTime,
                lotOccupancyTransactionForm.transactionAmount,
                lotOccupancyTransactionForm.externalReceiptNumber,
                lotOccupancyTransactionForm.transactionNote,
                requestSession.user.userName,
                rightNow.getTime(),
                requestSession.user.userName,
                rightNow.getTime());

        database.close();

        return transactionIndex;
    };


export default addLotOccupancyTransaction;