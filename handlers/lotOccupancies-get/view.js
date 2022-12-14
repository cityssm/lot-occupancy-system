import { getOccupancyTypePrintsById } from "../../helpers/functions.cache.js";
import * as configFunctions from "../../helpers/functions.config.js";
import { getLotOccupancy } from "../../helpers/lotOccupancyDB/getLotOccupancy.js";
export const handler = (request, response) => {
    const lotOccupancy = getLotOccupancy(request.params.lotOccupancyId);
    if (!lotOccupancy) {
        return response.redirect(configFunctions.getProperty("reverseProxy.urlPrefix") +
            "/lotOccupancies/?error=lotOccupancyIdNotFound");
    }
    const occupancyTypePrints = getOccupancyTypePrintsById(lotOccupancy.occupancyTypeId);
    return response.render("lotOccupancy-view", {
        headTitle: configFunctions.getProperty("aliases.lot") +
            " " +
            configFunctions.getProperty("aliases.occupancy") +
            " View",
        lotOccupancy,
        occupancyTypePrints
    });
};
export default handler;
