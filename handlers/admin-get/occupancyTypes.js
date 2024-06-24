import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
import * as configFunctions from '../../helpers/functions.config.js';
import * as printFunctions from '../../helpers/functions.print.js';
export async function handler(_request, response) {
    const occupancyTypes = await getOccupancyTypes();
    const allOccupancyTypeFields = await getAllOccupancyTypeFields();
    const occupancyTypePrints = configFunctions.getConfigProperty('settings.lotOccupancy.prints');
    const occupancyTypePrintTitles = {};
    for (const printEJS of occupancyTypePrints) {
        const printConfig = printFunctions.getPrintConfig(printEJS);
        if (printConfig !== undefined) {
            occupancyTypePrintTitles[printEJS] = printConfig.title;
        }
    }
    response.render('admin-occupancyTypes', {
        headTitle: `${configFunctions.getConfigProperty('aliases.occupancy')} Type Management`,
        occupancyTypes,
        allOccupancyTypeFields,
        occupancyTypePrintTitles
    });
}
export default handler;
