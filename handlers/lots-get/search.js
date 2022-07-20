import * as configFunctions from "../../helpers/functions.config.js";
import { getMaps } from "../../helpers/lotOccupancyDB/getMaps.js";
import { getLotTypes, getLotStatuses } from "../../helpers/functions.cache.js";
export const handler = (request, response) => {
    const maps = getMaps();
    const lotTypes = getLotTypes();
    const lotStatuses = getLotStatuses();
    response.render("lot-search", {
        headTitle: configFunctions.getProperty("aliases.lot") + " Search",
        maps,
        lotTypes,
        lotStatuses,
        mapId: request.query.mapId
    });
};
export default handler;
