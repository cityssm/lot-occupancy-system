import * as configFunctions from "../../helpers/functions.config.js";
import { getLot } from "../../helpers/lotOccupancyDB/getLot.js";
import { getMaps } from "../../helpers/lotOccupancyDB/getMaps.js";
import * as cacheFunctions from "../../helpers/functions.cache.js";
export const handler = (request, response) => {
    const lot = getLot(request.params.lotId);
    if (!lot) {
        return response.redirect(configFunctions.getProperty("reverseProxy.urlPrefix") + "/lots/?error=lotIdNotFound");
    }
    const maps = getMaps();
    const lotTypes = cacheFunctions.getLotTypes();
    const lotStatuses = cacheFunctions.getLotStatuses();
    return response.render("lot-edit", {
        headTitle: lot.lotName,
        lot,
        isCreate: false,
        maps,
        lotTypes,
        lotStatuses
    });
};
export default handler;
