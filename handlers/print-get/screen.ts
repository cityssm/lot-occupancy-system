import type { RequestHandler } from "express";

import * as configFunctions from "../../helpers/functions.config.js";
import { getReportData, getScreenPrintConfig } from "../../helpers/functions.print.js";

export const handler: RequestHandler = (request, response) => {
    const printName = request.params.printName;

    if (
        !configFunctions.getProperty("settings.lotOccupancy.prints").includes("screen/" + printName) &&
        !configFunctions.getProperty("settings.workOrders.prints").includes("screen/" + printName)
    ) {
        return response.redirect(
            configFunctions.getProperty("reverseProxy.urlPrefix") +
                "/dashboard/?error=printConfigNotAllowed"
        );
    }

    const printConfig = getScreenPrintConfig(printName);

    if (!printConfig) {
        return response.redirect(
            configFunctions.getProperty("reverseProxy.urlPrefix") +
                "/dashboard/?error=printConfigNotFound"
        );
    }

    const reportData = getReportData(printConfig, request.query);

    return response.render("print/screen/" + printName, reportData);
};

export default handler;
