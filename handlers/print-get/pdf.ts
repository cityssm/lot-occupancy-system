import type { RequestHandler } from "express";

import path from "path";
import * as ejs from "ejs";

import * as configFunctions from "../../helpers/functions.config.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
import * as lotOccupancyFunctions from "../../helpers/functions.lotOccupancy.js";

import { getReportData, getPdfPrintConfig } from "../../helpers/functions.print.js";

import { convertHTMLToPDF } from "@cityssm/pdf-puppeteer";
import camelcase from "camelcase";

const attachmentOrInline = configFunctions.getProperty("settings.printPdf.contentDisposition");

export const handler: RequestHandler = async (request, response, next) => {
    const printName = request.params.printName;

    if (
        !configFunctions.getProperty("settings.lotOccupancy.prints").includes("pdf/" + printName) &&
        !configFunctions.getProperty("settings.workOrders.prints").includes("pdf/" + printName)
    ) {
        return response.redirect(
            configFunctions.getProperty("reverseProxy.urlPrefix") +
                "/dashboard/?error=printConfigNotAllowed"
        );
    }

    const printConfig = getPdfPrintConfig(printName);

    if (!printConfig) {
        return response.redirect(
            configFunctions.getProperty("reverseProxy.urlPrefix") +
                "/dashboard/?error=printConfigNotFound"
        );
    }

    const reportData = getReportData(printConfig, request.query);

    const reportPath = path.join("views", "print", "pdf", printName + ".ejs");

    const pdfCallbackFunction = (pdf: Buffer) => {
        response.setHeader(
            "Content-Disposition",
            attachmentOrInline + ";" + " filename=" + camelcase(printConfig.title) + ".pdf"
        );

        response.setHeader("Content-Type", "application/pdf");

        response.send(pdf);
    };

    const ejsCallbackFunction = async (ejsError: Error, ejsData: string) => {
        if (ejsError) {
            return next(ejsError);
        }

        await convertHTMLToPDF(
            ejsData,
            pdfCallbackFunction,
            {
                format: "letter",
                printBackground: true,
                preferCSSPageSize: true
            },
            undefined,
            {
                cacheBrowser: true,
                remoteContent: false
            }
        );

        return;
    };

    reportData.configFunctions = configFunctions;
    reportData.dateTimeFunctions = dateTimeFunctions;
    reportData.lotOccupancyFunctions = lotOccupancyFunctions;

    await ejs.renderFile(reportPath, reportData, {}, ejsCallbackFunction);
};

export default handler;
