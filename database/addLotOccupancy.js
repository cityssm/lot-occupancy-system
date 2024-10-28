import { dateStringToInteger } from '@cityssm/utils-datetime';
import addLotOccupancyOccupant from './addLotOccupancyOccupant.js';
import addOrUpdateLotOccupancyField from './addOrUpdateLotOccupancyField.js';
import { acquireConnection } from './pool.js';
export default async function addLotOccupancy(lotOccupancyForm, user, connectedDatabase) {
    const database = connectedDatabase ?? (await acquireConnection());
    const rightNowMillis = Date.now();
    const occupancyStartDate = dateStringToInteger(lotOccupancyForm.occupancyStartDateString);
    if (occupancyStartDate <= 0) {
        console.error(lotOccupancyForm);
    }
    const result = database
        .prepare(`insert into LotOccupancies (
        occupancyTypeId, lotId,
        occupancyStartDate, occupancyEndDate,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(lotOccupancyForm.occupancyTypeId, lotOccupancyForm.lotId === '' ? undefined : lotOccupancyForm.lotId, occupancyStartDate, lotOccupancyForm.occupancyEndDateString === ''
        ? undefined
        : dateStringToInteger(lotOccupancyForm.occupancyEndDateString), user.userName, rightNowMillis, user.userName, rightNowMillis);
    const lotOccupancyId = result.lastInsertRowid;
    const occupancyTypeFieldIds = (lotOccupancyForm.occupancyTypeFieldIds ?? '').split(',');
    for (const occupancyTypeFieldId of occupancyTypeFieldIds) {
        const lotOccupancyFieldValue = lotOccupancyForm[`lotOccupancyFieldValue_${occupancyTypeFieldId}`];
        if ((lotOccupancyFieldValue ?? '') !== '') {
            await addOrUpdateLotOccupancyField({
                lotOccupancyId,
                occupancyTypeFieldId,
                lotOccupancyFieldValue: lotOccupancyFieldValue ?? ''
            }, user, database);
        }
    }
    if ((lotOccupancyForm.lotOccupantTypeId ?? '') !== '') {
        await addLotOccupancyOccupant({
            lotOccupancyId,
            lotOccupantTypeId: lotOccupancyForm.lotOccupantTypeId ?? '',
            occupantName: lotOccupancyForm.occupantName ?? '',
            occupantFamilyName: lotOccupancyForm.occupantFamilyName ?? '',
            occupantAddress1: lotOccupancyForm.occupantAddress1 ?? '',
            occupantAddress2: lotOccupancyForm.occupantAddress2 ?? '',
            occupantCity: lotOccupancyForm.occupantCity ?? '',
            occupantProvince: lotOccupancyForm.occupantProvince ?? '',
            occupantPostalCode: lotOccupancyForm.occupantPostalCode ?? '',
            occupantPhoneNumber: lotOccupancyForm.occupantPhoneNumber ?? '',
            occupantEmailAddress: lotOccupancyForm.occupantEmailAddress ?? '',
            occupantComment: lotOccupancyForm.occupantComment ?? ''
        }, user, database);
    }
    if (connectedDatabase === undefined) {
        database.release();
    }
    return lotOccupancyId;
}
