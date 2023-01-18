import { acquireConnection } from './pool.js';
export async function updateLotOccupancyOccupant(lotOccupancyOccupantForm, requestSession) {
    const database = await acquireConnection();
    const rightNowMillis = Date.now();
    const results = database
        .prepare(`update LotOccupancyOccupants
        set occupantName = ?,
        occupantAddress1 = ?,
        occupantAddress2 = ?,
        occupantCity = ?,
        occupantProvince = ?,
        occupantPostalCode = ?,
        occupantPhoneNumber = ?,
        occupantEmailAddress = ?,
        occupantComment = ?,
        lotOccupantTypeId = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where recordDelete_timeMillis is null
        and lotOccupancyId = ?
        and lotOccupantIndex = ?`)
        .run(lotOccupancyOccupantForm.occupantName, lotOccupancyOccupantForm.occupantAddress1, lotOccupancyOccupantForm.occupantAddress2, lotOccupancyOccupantForm.occupantCity, lotOccupancyOccupantForm.occupantProvince, lotOccupancyOccupantForm.occupantPostalCode, lotOccupancyOccupantForm.occupantPhoneNumber, lotOccupancyOccupantForm.occupantEmailAddress, lotOccupancyOccupantForm.occupantComment, lotOccupancyOccupantForm.lotOccupantTypeId, requestSession.user.userName, rightNowMillis, lotOccupancyOccupantForm.lotOccupancyId, lotOccupancyOccupantForm.lotOccupantIndex);
    database.release();
    return results.changes > 0;
}
export default updateLotOccupancyOccupant;
