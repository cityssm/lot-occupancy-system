import { acquireConnection } from './pool.js';
import { dateStringToInteger } from '@cityssm/expressjs-server-js/dateTimeFns.js';
import { addOrUpdateLotOccupancyField } from './addOrUpdateLotOccupancyField.js';
import { deleteLotOccupancyField } from './deleteLotOccupancyField.js';
export async function updateLotOccupancy(lotOccupancyForm, requestSession) {
    const database = await acquireConnection();
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update LotOccupancies
        set occupancyTypeId = ?,
        lotId = ?,
        occupancyStartDate = ?,
        occupancyEndDate = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where lotOccupancyId = ?
        and recordDelete_timeMillis is null`)
        .run(lotOccupancyForm.occupancyTypeId, lotOccupancyForm.lotId === '' ? undefined : lotOccupancyForm.lotId, dateStringToInteger(lotOccupancyForm.occupancyStartDateString), lotOccupancyForm.occupancyEndDateString === ''
        ? undefined
        : dateStringToInteger(lotOccupancyForm.occupancyEndDateString), requestSession.user.userName, rightNowMillis, lotOccupancyForm.lotOccupancyId);
    if (result.changes > 0) {
        const occupancyTypeFieldIds = (lotOccupancyForm.occupancyTypeFieldIds ?? '').split(',');
        for (const occupancyTypeFieldId of occupancyTypeFieldIds) {
            const lotOccupancyFieldValue = lotOccupancyForm['lotOccupancyFieldValue_' + occupancyTypeFieldId];
            await ((lotOccupancyFieldValue ?? '') === ''
                ? deleteLotOccupancyField(lotOccupancyForm.lotOccupancyId, occupancyTypeFieldId, requestSession, database)
                : addOrUpdateLotOccupancyField({
                    lotOccupancyId: lotOccupancyForm.lotOccupancyId,
                    occupancyTypeFieldId,
                    lotOccupancyFieldValue
                }, requestSession, database));
        }
    }
    database.release();
    return result.changes > 0;
}
export default updateLotOccupancy;
