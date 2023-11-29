import * as configFunctions from '../../helpers/functions.config.js';
import { getMapSVGs } from '../../helpers/functions.map.js';
import { getLotStatusSummary } from '../../helpers/lotOccupancyDB/getLotStatusSummary.js';
import { getLotTypeSummary } from '../../helpers/lotOccupancyDB/getLotTypeSummary.js';
import { getMap } from '../../helpers/lotOccupancyDB/getMap.js';
export async function handler(request, response) {
    const map = await getMap(request.params.mapId);
    if (map === undefined) {
        response.redirect(configFunctions.getProperty('reverseProxy.urlPrefix') +
            '/maps/?error=mapIdNotFound');
        return;
    }
    const mapSVGs = await getMapSVGs();
    const lotTypeSummary = await getLotTypeSummary({
        mapId: map.mapId
    });
    const lotStatusSummary = await getLotStatusSummary({
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
}
export default handler;
