import sqlite from 'better-sqlite3';
import { lotOccupancyDB as databasePath } from '../../data/databasePaths.js';
export function updateLotOccupancyOccupant(lotOccupancyOccupantForm, requestSession) {
    const database = sqlite(databasePath);
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
    database.close();
    return results.changes > 0;
}
export default updateLotOccupancyOccupant;
