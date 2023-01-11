import { getLotStatuses, getWorkOrderMilestoneTypes, getWorkOrderTypes } from '../../helpers/functions.cache.js';
import * as configFunctions from '../../helpers/functions.config.js';
import { getWorkOrder } from '../../helpers/lotOccupancyDB/getWorkOrder.js';
export const handler = (request, response) => {
    const workOrder = getWorkOrder(request.params.workOrderId, {
        includeLotsAndLotOccupancies: true,
        includeComments: true,
        includeMilestones: true
    });
    if (!workOrder) {
        response.redirect(configFunctions.getProperty('reverseProxy.urlPrefix') +
            '/workOrders/?error=workOrderIdNotFound');
        return;
    }
    if (workOrder.workOrderCloseDate) {
        response.redirect(configFunctions.getProperty('reverseProxy.urlPrefix') +
            '/workOrders/' +
            workOrder.workOrderId.toString() +
            '/?error=workOrderIsClosed');
        return;
    }
    const workOrderTypes = getWorkOrderTypes();
    const workOrderMilestoneTypes = getWorkOrderMilestoneTypes();
    const lotStatuses = getLotStatuses();
    response.render('workOrder-edit', {
        headTitle: `Work Order #${workOrder.workOrderNumber}`,
        workOrder,
        isCreate: false,
        workOrderTypes,
        workOrderMilestoneTypes,
        lotStatuses
    });
};
export default handler;
