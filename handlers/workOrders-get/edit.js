import { getLotStatuses, getWorkOrderMilestoneTypes, getWorkOrderTypes } from '../../helpers/functions.cache.js';
import * as configFunctions from '../../helpers/functions.config.js';
import { getWorkOrder } from '../../database/getWorkOrder.js';
export async function handler(request, response) {
    const workOrder = await getWorkOrder(request.params.workOrderId, {
        includeLotsAndLotOccupancies: true,
        includeComments: true,
        includeMilestones: true
    });
    if (workOrder === undefined) {
        response.redirect(`${configFunctions.getProperty('reverseProxy.urlPrefix')}/workOrders/?error=workOrderIdNotFound`);
        return;
    }
    if (workOrder.workOrderCloseDate) {
        response.redirect(`${configFunctions.getProperty('reverseProxy.urlPrefix')}/workOrders/${workOrder.workOrderId.toString()}/?error=workOrderIsClosed`);
        return;
    }
    const workOrderTypes = await getWorkOrderTypes();
    const workOrderMilestoneTypes = await getWorkOrderMilestoneTypes();
    const lotStatuses = await getLotStatuses();
    response.render('workOrder-edit', {
        headTitle: `Work Order #${workOrder.workOrderNumber}`,
        workOrder,
        isCreate: false,
        workOrderTypes,
        workOrderMilestoneTypes,
        lotStatuses
    });
}
export default handler;
