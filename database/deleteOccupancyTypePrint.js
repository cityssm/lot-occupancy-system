import { clearCacheByTableName } from '../helpers/functions.cache.js';
import { acquireConnection } from './pool.js';
export async function deleteOccupancyTypePrint(occupancyTypeId, printEJS, user) {
    const database = await acquireConnection();
    const result = database
        .prepare(`update OccupancyTypePrints
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where occupancyTypeId = ?
        and printEJS = ?`)
        .run(user.userName, Date.now(), occupancyTypeId, printEJS);
    database.release();
    clearCacheByTableName('OccupancyTypePrints');
    return result.changes > 0;
}
export default deleteOccupancyTypePrint;
