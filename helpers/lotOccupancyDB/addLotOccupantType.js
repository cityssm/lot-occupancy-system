import { acquireConnection } from './pool.js';
import { clearCacheByTableName } from '../functions.cache.js';
export async function addLotOccupantType(lotOccupantTypeForm, requestSession) {
    const database = await acquireConnection();
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`insert into LotOccupantTypes (
        lotOccupantType, fontAwesomeIconClass, occupantCommentTitle, orderNumber,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(lotOccupantTypeForm.lotOccupantType, lotOccupantTypeForm.fontAwesomeIconClass ?? '', lotOccupantTypeForm.occupantCommentTitle ?? '', lotOccupantTypeForm.orderNumber ?? -1, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    database.release();
    clearCacheByTableName('LotOccupantTypes');
    return result.lastInsertRowid;
}
export default addLotOccupantType;
