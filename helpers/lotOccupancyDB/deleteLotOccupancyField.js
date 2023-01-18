import { acquireConnection } from './pool.js';
export async function deleteLotOccupancyField(lotOccupancyId, occupancyTypeFieldId, requestSession, connectedDatabase) {
    const database = connectedDatabase ?? (await acquireConnection());
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update LotOccupancyFields
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where lotOccupancyId = ?
        and occupancyTypeFieldId = ?`)
        .run(requestSession.user.userName, rightNowMillis, lotOccupancyId, occupancyTypeFieldId);
    if (connectedDatabase === undefined) {
        database.release();
    }
    return result.changes > 0;
}
export default deleteLotOccupancyField;
