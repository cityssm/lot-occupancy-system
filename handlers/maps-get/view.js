import { getLotStatusSummary } from '../../database/getLotStatusSummary.js';
import { getLotTypeSummary } from '../../database/getLotTypeSummary.js';
import { getMap } from '../../database/getMap.js';
import * as configFunctions from '../../helpers/functions.config.js';
export async function handler(request, response) {
    const map = await getMap(request.params.mapId);
    if (map === undefined) {
        response.redirect(`${configFunctions.getConfigProperty('reverseProxy.urlPrefix')}/maps/?error=mapIdNotFound`);
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
