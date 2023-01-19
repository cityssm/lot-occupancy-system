import { acquireConnection } from './pool.js';
export async function addLotOccupancyOccupant(lotOccupancyOccupantForm, requestSession, connectedDatabase) {
    const database = connectedDatabase ?? (await acquireConnection());
    let lotOccupantIndex = 0;
    const maxIndexResult = database
        .prepare(`select lotOccupantIndex
        from LotOccupancyOccupants
        where lotOccupancyId = ?
        order by lotOccupantIndex desc
        limit 1`)
        .get(lotOccupancyOccupantForm.lotOccupancyId);
    if (maxIndexResult !== undefined) {
        lotOccupantIndex = maxIndexResult.lotOccupantIndex + 1;
    }
    const rightNowMillis = Date.now();
    database
        .prepare(`insert into LotOccupancyOccupants (
        lotOccupancyId, lotOccupantIndex,
        occupantName,
        occupantAddress1, occupantAddress2,
        occupantCity, occupantProvince, occupantPostalCode,
        occupantPhoneNumber, occupantEmailAddress,
        occupantComment,
        lotOccupantTypeId,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(lotOccupancyOccupantForm.lotOccupancyId, lotOccupantIndex, lotOccupancyOccupantForm.occupantName, lotOccupancyOccupantForm.occupantAddress1, lotOccupancyOccupantForm.occupantAddress2, lotOccupancyOccupantForm.occupantCity, lotOccupancyOccupantForm.occupantProvince, lotOccupancyOccupantForm.occupantPostalCode, lotOccupancyOccupantForm.occupantPhoneNumber, lotOccupancyOccupantForm.occupantEmailAddress, lotOccupancyOccupantForm.occupantComment ?? '', lotOccupancyOccupantForm.lotOccupantTypeId, requestSession.user.userName, rightNowMillis, requestSession.user.userName, rightNowMillis);
    if (connectedDatabase === undefined) {
        database.release();
    }
    return lotOccupantIndex;
}
export default addLotOccupancyOccupant;
