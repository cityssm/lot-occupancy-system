import { acquireConnection } from './pool.js';
export async function addFee(feeForm, user) {
    const database = await acquireConnection();
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`insert into Fees (
        feeCategoryId,
        feeName, feeDescription, feeAccount,
        occupancyTypeId, lotTypeId,
        feeAmount, feeFunction,
        taxAmount, taxPercentage,
        includeQuantity, quantityUnit,
        isRequired, orderNumber,
        recordCreate_userName, recordCreate_timeMillis,
        recordUpdate_userName, recordUpdate_timeMillis)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .run(feeForm.feeCategoryId, feeForm.feeName, feeForm.feeDescription, feeForm.feeAccount, feeForm.occupancyTypeId === '' ? undefined : feeForm.occupancyTypeId, feeForm.lotTypeId === '' ? undefined : feeForm.lotTypeId, feeForm.feeAmount ?? undefined, feeForm.feeFunction ?? undefined, feeForm.taxAmount ?? undefined, feeForm.taxPercentage ?? undefined, (feeForm.includeQuantity ?? '') === '' ? 0 : 1, feeForm.quantityUnit, (feeForm.isRequired ?? '') === '' ? 0 : 1, feeForm.orderNumber ?? -1, user.userName, rightNowMillis, user.userName, rightNowMillis);
    database.release();
    return result.lastInsertRowid;
}
export default addFee;
