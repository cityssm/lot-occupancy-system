import * as configFunctions from '../../helpers/functions.config.js';
import { getReportData, getScreenPrintConfig } from '../../helpers/functions.print.js';
export const handler = (request, response) => {
    const printName = request.params.printName;
    if (!configFunctions
        .getProperty('settings.lotOccupancy.prints')
        .includes('screen/' + printName) &&
        !configFunctions
            .getProperty('settings.workOrders.prints')
            .includes('screen/' + printName)) {
        response.redirect(configFunctions.getProperty('reverseProxy.urlPrefix') +
            '/dashboard/?error=printConfigNotAllowed');
        return;
    }
    const printConfig = getScreenPrintConfig(printName);
    if (!printConfig) {
        response.redirect(configFunctions.getProperty('reverseProxy.urlPrefix') +
            '/dashboard/?error=printConfigNotFound');
        return;
    }
    const reportData = getReportData(printConfig, request.query);
    response.render('print/screen/' + printName, reportData);
};
export default handler;
