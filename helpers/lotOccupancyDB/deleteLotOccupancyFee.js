import { acquireConnection } from './pool.js';
export async function deleteLotOccupancyFee(lotOccupancyId, feeId, requestSession) {
    const database = await acquireConnection();
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update LotOccupancyFees
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where lotOccupancyId = ?
        and feeId = ?`)
        .run(requestSession.user.userName, rightNowMillis, lotOccupancyId, feeId);
    database.release();
    return result.changes > 0;
}
export default deleteLotOccupancyFee;
