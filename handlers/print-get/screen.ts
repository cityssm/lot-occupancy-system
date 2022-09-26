import type { RequestHandler } from "express";

import * as configFunctions from "../../helpers/functions.config.js";
import { getScreenPrintConfig } from "../../helpers/functions.print.js";

import { getLotOccupancy } from "../../helpers/lotOccupancyDB/getLotOccupancy.js";

export const handler: RequestHandler = (request, response) => {
    const printName = request.params.printName;

    const printConfig = getScreenPrintConfig(printName);

    if (!printConfig) {
        return response.redirect(
            configFunctions.getProperty("reverseProxy.urlPrefix") +
                "/dashboard/?error=printConfigNotFound"
        );
    }

    const reportData: { [dataName: string]: unknown } = {
        headTitle: printConfig.title
    };

    if (
        printConfig.params.includes("lotOccupancyId") &&
        typeof request.query.lotOccupancyId === "string"
    ) {
        reportData.lotOccupancy = getLotOccupancy(request.query.lotOccupancyId);
    }

    return response.render("print/screen/" + printName, reportData);
};

export default handler;
