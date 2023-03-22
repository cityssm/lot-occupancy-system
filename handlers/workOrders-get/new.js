import { dateToInteger, dateToString } from '@cityssm/utils-datetime';
import { getWorkOrderTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const currentDate = new Date();
    const workOrder = {
        workOrderOpenDate: dateToInteger(currentDate),
        workOrderOpenDateString: dateToString(currentDate)
    };
    const workOrderTypes = await getWorkOrderTypes();
    response.render('workOrder-edit', {
        headTitle: 'New Work Order',
        workOrder,
        isCreate: true,
        workOrderTypes
    });
}
export default handler;
