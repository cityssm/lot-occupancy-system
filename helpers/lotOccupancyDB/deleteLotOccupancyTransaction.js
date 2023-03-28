import { acquireConnection } from './pool.js';
export async function deleteLotOccupancyTransaction(lotOccupancyId, transactionIndex, requestSession) {
    const database = await acquireConnection();
    const result = database
        .prepare(`update LotOccupancyTransactions
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where lotOccupancyId = ?
        and transactionIndex = ?`)
        .run(requestSession.user.userName, Date.now(), lotOccupancyId, transactionIndex);
    database.release();
    return result.changes > 0;
}
export default deleteLotOccupancyTransaction;
