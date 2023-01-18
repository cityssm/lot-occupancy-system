import { acquireConnection } from './pool.js';
import { clearCacheByTableName } from '../functions.cache.js';
export async function updateLotOccupantType(lotOccupantTypeForm, requestSession) {
    const database = await acquireConnection();
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update LotOccupantTypes
        set lotOccupantType = ?,
        fontAwesomeIconClass = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where lotOccupantTypeId = ?
        and recordDelete_timeMillis is null`)
        .run(lotOccupantTypeForm.lotOccupantType, lotOccupantTypeForm.fontAwesomeIconClass ?? '', requestSession.user.userName, rightNowMillis, lotOccupantTypeForm.lotOccupantTypeId);
    database.release();
    clearCacheByTableName('LotOccupantTypes');
    return result.changes > 0;
}
export default updateLotOccupantType;
