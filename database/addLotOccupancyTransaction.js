import { dateStringToInteger, dateToInteger, dateToTimeInteger, timeStringToInteger } from '@cityssm/utils-datetime';
import { acquireConnection } from './pool.js';
export default async function addLotOccupancyTransaction(lotOccupancyTransactionForm, user) {
    const database = await acquireConnection();
    let transactionIndex = 0;
    const maxIndexResult = database
        .prepare(`select transactionIndex
        from LotOccupancyTransactions
        where lotOccupancyId = ?
        order by transactionIndex desc
        limit 1`)
        .get(lotOccupancyTransactionForm.lotOccupancyId);
    if (maxIndexResult !== undefined) {
        transactionIndex = maxIndexResult.transactionIndex + 1;
    }
    const rightNow = new Date();
    const transactionDate = lotOccupancyTransactionForm.transactionDateString
        ? dateStringToInteger(lotOccupancyTransactionForm.transactionDateString)
        : dateToInteger(rightNow);
    const transactionTime = lotOccupancyTransactionForm.transactionTimeString
        ? timeStringToInteger(lotOccupancyTransactionForm.transactionTimeString)
        : dateToTimeInteger(rightNow);
    database
        .prepare(`insert into LotOccupancyTransactions (
        lotOccupancyId, transactionIndex,
        transactionDate, transactionTime,
        transactionAmount, externalReceiptNumber, transactionNote,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(lotOccupancyTransactionForm.lotOccupancyId, transactionIndex, transactionDate, transactionTime, lotOccupancyTransactionForm.transactionAmount, lotOccupancyTransactionForm.externalReceiptNumber, lotOccupancyTransactionForm.transactionNote, user.userName, rightNow.getTime(), user.userName, rightNow.getTime());
    database.release();
    return transactionIndex;
}
