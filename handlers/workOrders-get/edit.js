import { getLotStatuses, getWorkOrderTypes } from "../../helpers/functions.cache.js";
import * as configFunctions from "../../helpers/functions.config.js";
import { getWorkOrder } from "../../helpers/lotOccupancyDB/getWorkOrder.js";
export const handler = (request, response) => {
    const workOrder = getWorkOrder(request.params.workOrderId);
    if (!workOrder) {
        return response.redirect(configFunctions.getProperty("reverseProxy.urlPrefix") +
            "/workOrders/?error=workOrderIdNotFound");
    }
    if (workOrder.workOrderCloseDate) {
        return response.redirect(configFunctions.getProperty("reverseProxy.urlPrefix") +
            "/workOrders/" +
            workOrder.workOrderId.toString() +
            "/?error=workOrderIsClosed");
    }
    const workOrderTypes = getWorkOrderTypes();
    const lotStatuses = getLotStatuses();
    response.render("workOrder-edit", {
        headTitle: "Work Order #" + workOrder.workOrderNumber,
        workOrder,
        isCreate: false,
        workOrderTypes,
        lotStatuses
    });
};
export default handler;
