import { acquireConnection } from './pool.js';
export default async function deleteLotField(lotId, lotTypeFieldId, user, connectedDatabase) {
    const database = connectedDatabase ?? (await acquireConnection());
    const result = database
        .prepare(`update LotFields
        set recordDelete_userName = ?,
        recordDelete_timeMillis = ?
        where lotId = ?
        and lotTypeFieldId = ?`)
        .run(user.userName, Date.now(), lotId, lotTypeFieldId);
    if (connectedDatabase === undefined) {
        database.release();
    }
    return result.changes > 0;
}
