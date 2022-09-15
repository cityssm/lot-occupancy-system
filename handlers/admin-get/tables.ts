import type { RequestHandler } from "express";

import {
    getLotOccupantTypes,
    getLotStatuses,
    getWorkOrderMilestoneTypes,
    getWorkOrderTypes
} from "../../helpers/functions.cache.js";

export const handler: RequestHandler = (_request, response) => {
    const workOrderTypes = getWorkOrderTypes();
    const workOrderMilestoneTypes = getWorkOrderMilestoneTypes();
    const lotStatuses = getLotStatuses();
    const lotOccupantTypes = getLotOccupantTypes();

    response.render("admin-tables", {
        headTitle: "Config Table Management",
        workOrderTypes,
        workOrderMilestoneTypes,
        lotStatuses,
        lotOccupantTypes
    });
};

export default handler;
