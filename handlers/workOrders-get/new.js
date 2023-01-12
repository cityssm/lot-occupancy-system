import { dateToInteger, dateToString } from '@cityssm/expressjs-server-js/dateTimeFns.js';
import { getWorkOrderTypes } from '../../helpers/functions.cache.js';
export const handler = (request, response) => {
    const currentDate = new Date();
    const workOrder = {
        workOrderOpenDate: dateToInteger(currentDate),
        workOrderOpenDateString: dateToString(currentDate)
    };
    const workOrderTypes = getWorkOrderTypes();
    response.render('workOrder-edit', {
        headTitle: 'New Work Order',
        workOrder,
        isCreate: true,
        workOrderTypes
    });
};
export default handler;
