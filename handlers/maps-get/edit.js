import * as configFunctions from '../../helpers/functions.config.js';
import { getMap } from '../../helpers/lotOccupancyDB/getMap.js';
import { getMapSVGs } from '../../helpers/functions.map.js';
import { getLotTypeSummary } from '../../helpers/lotOccupancyDB/getLotTypeSummary.js';
import { getLotStatusSummary } from '../../helpers/lotOccupancyDB/getLotStatusSummary.js';
export const handler = async (request, response) => {
    const map = getMap(request.params.mapId);
    if (!map) {
        response.redirect(configFunctions.getProperty('reverseProxy.urlPrefix') +
            '/maps/?error=mapIdNotFound');
        return;
    }
    const mapSVGs = await getMapSVGs();
    const lotTypeSummary = getLotTypeSummary({
        mapId: map.mapId
    });
    const lotStatusSummary = getLotStatusSummary({
        mapId: map.mapId
    });
    response.render('map-edit', {
        headTitle: map.mapName,
        isCreate: false,
        map,
        mapSVGs,
        lotTypeSummary,
        lotStatusSummary
    });
};
export default handler;
