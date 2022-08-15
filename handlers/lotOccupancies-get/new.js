import { getOccupancyTypes } from "../../helpers/functions.cache.js";
import * as configFunctions from "../../helpers/functions.config.js";
export const handler = (request, response) => {
    const lotOccupancy = {};
    const occupancyTypes = getOccupancyTypes();
    return response.render("lotOccupancy-edit", {
        headTitle: "Create a New " + configFunctions.getProperty("aliases.lot") + " " + configFunctions.getProperty("aliases.occupancy") + "  Record",
        lotOccupancy,
        occupancyTypes,
        isCreate: true
    });
};
export default handler;
