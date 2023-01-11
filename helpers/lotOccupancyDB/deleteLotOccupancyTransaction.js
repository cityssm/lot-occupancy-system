import sqlite from 'better-sqlite3';
import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js';
export function deleteLotOccupancyTransaction(lotOccupancyId, transactionIndex, requestSession) {
    const database = sqlite(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update LotOccupancyTransactions
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where lotOccupancyId = ?
        and transactionIndex = ?`)
        .run(requestSession.user.userName, rightNowMillis, lotOccupancyId, transactionIndex);
    database.close();
    return result.changes > 0;
}
export default deleteLotOccupancyTransaction;
