import * as configFunctions from "../../helpers/functions.config.js";
import { getLotOccupancy } from "../../helpers/lotOccupancyDB/getLotOccupancy.js";
export const handler = (request, response) => {
    const lotOccupancy = getLotOccupancy(request.params.lotOccupancyId);
    if (!lotOccupancy) {
        return response.redirect(configFunctions.getProperty("reverseProxy.urlPrefix") + "/lotOccupancies/?error=lotOccupancyIdNotFound");
    }
    return response.render("lotOccupancy-print", {
        headTitle: configFunctions.getProperty("aliases.lot") + " " + configFunctions.getProperty("aliases.occupancy") + " Print",
        lotOccupancy
    });
};
export default handler;
