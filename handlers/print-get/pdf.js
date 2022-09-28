import path from "path";
import * as ejs from "ejs";
import * as configFunctions from "../../helpers/functions.config.js";
import * as dateTimeFunctions from "@cityssm/expressjs-server-js/dateTimeFns.js";
import { getReportData, getPdfPrintConfig } from "../../helpers/functions.print.js";
import convertHTMLToPDF from "pdf-puppeteer";
import camelcase from "camelcase";
export const handler = async (request, response, next) => {
    const printName = request.params.printName;
    const printConfig = getPdfPrintConfig(printName);
    if (!printConfig) {
        return response.redirect(configFunctions.getProperty("reverseProxy.urlPrefix") +
            "/dashboard/?error=printConfigNotFound");
    }
    const reportData = getReportData(printConfig, request.query);
    const reportPath = path.join("views", "print", "pdf", printName + ".ejs");
    const pdfCallbackFunction = (pdf) => {
        response.setHeader("Content-Disposition", "inline;" + " filename=" + camelcase(printConfig.title) + ".pdf");
        response.setHeader("Content-Type", "application/pdf");
        response.send(pdf);
    };
    reportData.configFunctions = configFunctions;
    reportData.dateTimeFunctions = dateTimeFunctions;
    await ejs.renderFile(reportPath, reportData, {}, async (ejsError, ejsData) => {
        if (ejsError) {
            return next(ejsError);
        }
        await convertHTMLToPDF(ejsData, pdfCallbackFunction, {
            format: "letter",
            printBackground: true,
            preferCSSPageSize: true
        });
        return;
    });
};
export default handler;
