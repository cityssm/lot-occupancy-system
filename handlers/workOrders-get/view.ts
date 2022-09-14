import type { RequestHandler } from "express";

import * as configFunctions from "../../helpers/functions.config.js";

import { getWorkOrder } from "../../helpers/lotOccupancyDB/getWorkOrder.js";

export const handler: RequestHandler = (request, response) => {
    const workOrder = getWorkOrder(request.params.workOrderId, {
        includeLotsAndLotOccupancies: true,
        includeComments: true,
        includeMilestones: true
    });

    if (!workOrder) {
        return response.redirect(
            configFunctions.getProperty("reverseProxy.urlPrefix") +
                "/workOrders/?error=workOrderIdNotFound"
        );
    }

    response.render("workOrder-view", {
        headTitle: "Work Order #" + workOrder.workOrderNumber,
        workOrder
    });
};

export default handler;
