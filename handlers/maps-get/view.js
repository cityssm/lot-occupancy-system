import * as configFunctions from '../../helpers/functions.config.js';
import { getMap } from '../../helpers/lotOccupancyDB/getMap.js';
import { getLotStatusSummary } from '../../helpers/lotOccupancyDB/getLotStatusSummary.js';
import { getLotTypeSummary } from '../../helpers/lotOccupancyDB/getLotTypeSummary.js';
export const handler = (request, response) => {
    const map = getMap(request.params.mapId);
    if (!map) {
        response.redirect(configFunctions.getProperty('reverseProxy.urlPrefix') +
            '/maps/?error=mapIdNotFound');
        return;
    }
    const lotTypeSummary = getLotTypeSummary({
        mapId: map.mapId
    });
    const lotStatusSummary = getLotStatusSummary({
        mapId: map.mapId
    });
    response.render('map-view', {
        headTitle: map.mapName,
        map,
        lotTypeSummary,
        lotStatusSummary
    });
};
export default handler;
