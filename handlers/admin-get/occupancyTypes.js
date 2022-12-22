import * as configFunctions from "../../helpers/functions.config.js";
import * as printFunctions from "../../helpers/functions.print.js";
import { getAllOccupancyTypeFields, getOccupancyTypes } from "../../helpers/functions.cache.js";
export const handler = (_request, response) => {
    const occupancyTypes = getOccupancyTypes();
    const allOccupancyTypeFields = getAllOccupancyTypeFields();
    const occupancyTypePrints = configFunctions.getProperty("settings.lotOccupancy.prints");
    const occupancyTypePrintTitles = {};
    for (const printEJS of occupancyTypePrints) {
        const printConfig = printFunctions.getPrintConfig(printEJS);
        if (printConfig) {
            occupancyTypePrintTitles[printEJS] = printConfig.title;
        }
    }
    response.render("admin-occupancyTypes", {
        headTitle: configFunctions.getProperty("aliases.occupancy") + " Type Management",
        occupancyTypes,
        allOccupancyTypeFields,
        occupancyTypePrintTitles
    });
};
export default handler;
