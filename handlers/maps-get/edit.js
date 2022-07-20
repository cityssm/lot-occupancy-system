import * as configFunctions from "../../helpers/functions.config.js";
import { getMap } from "../../helpers/lotOccupancyDB/getMap.js";
import { getMapSVGs } from "../../helpers/functions.map.js";
export const handler = async (request, response) => {
    const map = getMap(request.params.mapId);
    if (!map) {
        return response.redirect(configFunctions.getProperty("reverseProxy.urlPrefix") + "/maps/?error=mapIdNotFound");
    }
    const mapSVGs = await getMapSVGs();
    response.render("map-edit", {
        headTitle: map.mapName,
        isCreate: false,
        map,
        mapSVGs
    });
};
export default handler;
