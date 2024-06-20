import { dateStringToInteger, dateToInteger } from '@cityssm/utils-datetime';
import { acquireConnection } from './pool.js';
export default async function closeWorkOrder(workOrderForm, user) {
    const database = await acquireConnection();
    const rightNow = new Date();
    const result = database
        .prepare(`update WorkOrders
        set workOrderCloseDate = ?,
        recordUpdate_userName = ?,
        recordUpdate_timeMillis = ?
        where workOrderId = ?`)
        .run(workOrderForm.workOrderCloseDateString
        ? dateStringToInteger(workOrderForm.workOrderCloseDateString)
        : dateToInteger(new Date()), user.userName, rightNow.getTime(), workOrderForm.workOrderId);
    database.release();
    return result.changes > 0;
}
