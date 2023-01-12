import { getWorkOrderTypes } from '../../helpers/functions.cache.js';
export const handler = (request, response) => {
    const workOrderOpenDateString = request.query.workOrderOpenDateString;
    const workOrderTypes = getWorkOrderTypes();
    response.render('workOrder-search', {
        headTitle: 'Work Order Search',
        workOrderTypes,
        workOrderOpenDateString
    });
};
export default handler;
