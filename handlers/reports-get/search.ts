import type { RequestHandler } from "express";

import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";

import { getMaps } from "../../helpers/lotOccupancyDB/getMaps.js";

export const handler: RequestHandler = (_request, response) => {
    const rightNow = new Date();

    const maps = getMaps();

    response.render("report-search", {
        headTitle: "Reports",
        todayDateString: dateTimeFunctions.dateToString(rightNow),
        maps
    });
};

export default handler;
