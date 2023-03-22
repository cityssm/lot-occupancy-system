import { acquireConnection } from './pool.js';
import { dateStringToInteger } from '@cityssm/utils-datetime';
export async function updateWorkOrder(workOrderForm, requestSession) {
    const database = await acquireConnection();
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`update WorkOrders
        set workOrderNumber = ?,
        workOrderTypeId = ?,
        workOrderDescription = ?,
        workOrderOpenDate = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where workOrderId = ?
        and recordDelete_timeMillis is null`)
        .run(workOrderForm.workOrderNumber, workOrderForm.workOrderTypeId, workOrderForm.workOrderDescription, dateStringToInteger(workOrderForm.workOrderOpenDateString), requestSession.user.userName, rightNowMillis, workOrderForm.workOrderId);
    database.release();
    return result.changes > 0;
}
export default updateWorkOrder;
