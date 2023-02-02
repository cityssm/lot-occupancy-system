import path from 'node:path';
import * as ejs from 'ejs';
import * as configFunctions from '../../helpers/functions.config.js';
import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js';
import * as lotOccupancyFunctions from '../../helpers/functions.lotOccupancy.js';
import { getReportData, getPdfPrintConfig } from '../../helpers/functions.print.js';
import { convertHTMLToPDF } from '@cityssm/pdf-puppeteer';
import camelcase from 'camelcase';
const attachmentOrInline = configFunctions.getProperty('settings.printPdf.contentDisposition');
export async function handler(request, response, next) {
    const printName = request.params.printName;
    if (!configFunctions
        .getProperty('settings.lotOccupancy.prints')
        .includes('pdf/' + printName) &&
        !configFunctions
            .getProperty('settings.workOrders.prints')
            .includes('pdf/' + printName)) {
        response.redirect(configFunctions.getProperty('reverseProxy.urlPrefix') +
            '/dashboard/?error=printConfigNotAllowed');
        return;
    }
    const printConfig = getPdfPrintConfig(printName);
    if (printConfig === undefined) {
        response.redirect(configFunctions.getProperty('reverseProxy.urlPrefix') +
            '/dashboard/?error=printConfigNotFound');
        return;
    }
    const reportData = await getReportData(printConfig, request.query);
    console.log(reportData);
    const reportPath = path.join('views', 'print', 'pdf', printName + '.ejs');
    function pdfCallbackFunction(pdf) {
        response.setHeader('Content-Disposition', `${attachmentOrInline}; filename=${camelcase(printConfig.title)}.pdf`);
        response.setHeader('Content-Type', 'application/pdf');
        response.send(pdf);
    }
    async function ejsCallbackFunction(ejsError, ejsData) {
        if (ejsError) {
            next(ejsError);
            return;
        }
        await convertHTMLToPDF(ejsData, pdfCallbackFunction, {
            format: 'letter',
            printBackground: true,
            preferCSSPageSize: true
        }, undefined, {
            cacheBrowser: true,
            remoteContent: false
        });
    }
    reportData.configFunctions = configFunctions;
    reportData.dateTimeFunctions = dateTimeFunctions;
    reportData.lotOccupancyFunctions = lotOccupancyFunctions;
    await ejs.renderFile(reportPath, reportData, {}, ejsCallbackFunction);
}
export default handler;
