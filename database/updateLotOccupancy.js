import { dateStringToInteger } from '@cityssm/utils-datetime';
import { addOrUpdateLotOccupancyField } from './addOrUpdateLotOccupancyField.js';
import { deleteLotOccupancyField } from './deleteLotOccupancyField.js';
import { acquireConnection } from './pool.js';
export async function updateLotOccupancy(lotOccupancyForm, user) {
    const database = await acquireConnection();
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
        : dateStringToInteger(lotOccupancyForm.occupancyEndDateString), user.userName, Date.now(), lotOccupancyForm.lotOccupancyId);
    if (result.changes > 0) {
        const occupancyTypeFieldIds = (lotOccupancyForm.occupancyTypeFieldIds ?? '').split(',');
        for (const occupancyTypeFieldId of occupancyTypeFieldIds) {
            const lotOccupancyFieldValue = lotOccupancyForm[`lotOccupancyFieldValue_${occupancyTypeFieldId}`];
            await ((lotOccupancyFieldValue ?? '') === ''
                ? deleteLotOccupancyField(lotOccupancyForm.lotOccupancyId, occupancyTypeFieldId, user, database)
                : addOrUpdateLotOccupancyField({
                    lotOccupancyId: lotOccupancyForm.lotOccupancyId,
                    occupancyTypeFieldId,
                    lotOccupancyFieldValue
                }, user, database));
        }
    }
    database.release();
    return result.changes > 0;
}
export default updateLotOccupancy;
