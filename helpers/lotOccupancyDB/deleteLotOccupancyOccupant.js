import { acquireConnection } from './pool.js';
export async function deleteLotOccupancyOccupant(lotOccupancyId, lotOccupantIndex, user) {
    const database = await acquireConnection();
    const result = database
        .prepare(`update LotOccupancyOccupants
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where lotOccupancyId = ?
        and lotOccupantIndex = ?`)
        .run(user.userName, Date.now(), lotOccupancyId, lotOccupantIndex);
    database.release();
    return result.changes > 0;
}
export default deleteLotOccupancyOccupant;
