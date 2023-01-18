import { acquireConnection } from './pool.js';
export async function updateFee(feeForm, requestSession) {
    const database = await acquireConnection();
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update Fees
        set feeCategoryId = ?,
        feeName = ?,
        feeDescription = ?,
        occupancyTypeId = ?,
        lotTypeId = ?,
        feeAmount = ?,
        feeFunction = ?,
        taxAmount = ?,
        taxPercentage = ?,
        includeQuantity = ?,
        quantityUnit = ?,
        isRequired = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where recordDelete_timeMillis is null
        and feeId = ?`)
        .run(feeForm.feeCategoryId, feeForm.feeName, feeForm.feeDescription, feeForm.occupancyTypeId === '' ? undefined : feeForm.occupancyTypeId, feeForm.lotTypeId === '' ? undefined : feeForm.lotTypeId, feeForm.feeAmount ?? undefined, feeForm.feeFunction ?? undefined, feeForm.taxAmount ?? undefined, feeForm.taxPercentage ?? undefined, feeForm.includeQuantity === '' ? 0 : 1, feeForm.quantityUnit, feeForm.isRequired === '' ? 0 : 1, requestSession.user.userName, rightNowMillis, feeForm.feeId);
    database.release();
    return result.changes > 0;
}
export default updateFee;
