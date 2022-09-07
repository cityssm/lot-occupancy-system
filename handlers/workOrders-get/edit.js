import * as configFunctions from "../../helpers/functions.config.js";
import { getWorkOrder } from "../../helpers/lotOccupancyDB/getWorkOrder.js";
export const handler = (request, response) => {
    const workOrder = getWorkOrder(request.params.workOrderId);
    if (!workOrder) {
        return response.redirect(configFunctions.getProperty("reverseProxy.urlPrefix") +
            "/workOrders/?error=workOrderIdNotFound");
    }
    response.render("workOrder-edit", {
        headTitle: "Work Order #" + workOrder.workOrderNumber,
        workOrder
    });
};
export default handler;
