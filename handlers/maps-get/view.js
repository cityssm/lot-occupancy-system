import * as configFunctions from '../../helpers/functions.config.js';
import { getMap } from '../../helpers/lotOccupancyDB/getMap.js';
import { getLotStatusSummary } from '../../helpers/lotOccupancyDB/getLotStatusSummary.js';
import { getLotTypeSummary } from '../../helpers/lotOccupancyDB/getLotTypeSummary.js';
export async function handler(request, response) {
    const map = await getMap(request.params.mapId);
    if (map === undefined) {
        response.redirect(configFunctions.getProperty('reverseProxy.urlPrefix') +
            '/maps/?error=mapIdNotFound');
        return;
    }
    const lotTypeSummary = await getLotTypeSummary({
        mapId: map.mapId
    });
    const lotStatusSummary = await getLotStatusSummary({
        mapId: map.mapId
    });
    response.render('map-view', {
        headTitle: map.mapName,
        map,
        lotTypeSummary,
        lotStatusSummary
    });
}
export default handler;
