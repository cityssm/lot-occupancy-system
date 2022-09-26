import * as configFunctions from "../../helpers/functions.config.js";
import { getReportData, getScreenPrintConfig } from "../../helpers/functions.print.js";
export const handler = (request, response) => {
    const printName = request.params.printName;
    const printConfig = getScreenPrintConfig(printName);
    if (!printConfig) {
        return response.redirect(configFunctions.getProperty("reverseProxy.urlPrefix") +
            "/dashboard/?error=printConfigNotFound");
    }
    const reportData = getReportData(printConfig, request.query);
    return response.render("print/screen/" + printName, reportData);
};
export default handler;
