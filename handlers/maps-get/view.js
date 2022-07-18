import * as configFunctions from "../../helpers/functions.config.js";
import { getMap } from "../../helpers/lotOccupancyDB/getMap.js";
export const handler = (request, response) => {
    const map = getMap(request.params.mapId);
    if (!map) {
        return response.redirect(configFunctions.getProperty("reverseProxy.urlPrefix") + "/maps/?error=mapIdNotFound");
    }
    response.render("map-view", {
        headTitle: map.mapName,
        map
    });
};
export default handler;
