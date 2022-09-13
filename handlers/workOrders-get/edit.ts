import type { RequestHandler } from "express";

import {
    getLotStatuses,
    getWorkOrderMilestoneTypes,
    getWorkOrderTypes
} from "../../helpers/functions.cache.js";

import * as configFunctions from "../../helpers/functions.config.js";

import { getWorkOrder } from "../../helpers/lotOccupancyDB/getWorkOrder.js";

export const handler: RequestHandler = (request, response) => {
    const workOrder = getWorkOrder(request.params.workOrderId);

    if (!workOrder) {
        return response.redirect(
            configFunctions.getProperty("reverseProxy.urlPrefix") +
                "/workOrders/?error=workOrderIdNotFound"
        );
    }

    if (workOrder.workOrderCloseDate) {
        return response.redirect(
            configFunctions.getProperty("reverseProxy.urlPrefix") +
                "/workOrders/" +
                workOrder.workOrderId.toString() +
                "/?error=workOrderIsClosed"
        );
    }

    const workOrderTypes = getWorkOrderTypes();

    const workOrderMilestoneTypes = getWorkOrderMilestoneTypes();

    const lotStatuses = getLotStatuses();

    response.render("workOrder-edit", {
        headTitle: "Work Order #" + workOrder.workOrderNumber,
        workOrder,
        isCreate: false,
        workOrderTypes,
        workOrderMilestoneTypes,
        lotStatuses
    });
};

export default handler;
