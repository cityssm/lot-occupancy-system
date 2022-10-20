import type { RequestHandler } from "express";

import { dateToString } from "@cityssm/expressjs-server-js/dateTimeFns.js";

import { getWorkOrderMilestones } from "../../helpers/lotOccupancyDB/getWorkOrderMilestones.js";
import { getWorkOrders } from "../../helpers/lotOccupancyDB/getWorkOrders.js";

export const handler: RequestHandler = (_request, response) => {
    const currentDateString = dateToString(new Date());

    const workOrderMilestones = getWorkOrderMilestones(
        {
            workOrderMilestoneDateFilter: "date",
            workOrderMilestoneDateString: currentDateString
        },
        {
            orderBy: "completion",
            includeWorkOrders: true
        }
    );

    const workOrderCount = getWorkOrders(
        {
            workOrderOpenDateString: currentDateString
        },
        {
            limit: 1,
            offset: 0
        }
    ).count;

    response.render("dashboard", {
        headTitle: "Dashboard",
        workOrderMilestones,
        workOrderCount
    });
};

export default handler;
