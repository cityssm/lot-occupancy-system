import { getOccupancyTypePrintsById } from '../../helpers/functions.cache.js';
import * as configFunctions from '../../helpers/functions.config.js';
import { getLotOccupancy } from '../../helpers/lotOccupancyDB/getLotOccupancy.js';
export async function handler(request, response) {
    const lotOccupancy = await getLotOccupancy(request.params.lotOccupancyId);
    if (!lotOccupancy) {
        response.redirect(configFunctions.getProperty('reverseProxy.urlPrefix') +
            '/lotOccupancies/?error=lotOccupancyIdNotFound');
        return;
    }
    const occupancyTypePrints = await getOccupancyTypePrintsById(lotOccupancy.occupancyTypeId);
    response.render('lotOccupancy-view', {
        headTitle: `${configFunctions.getProperty('aliases.occupancy')} View`,
        lotOccupancy,
        occupancyTypePrints
    });
}
export default handler;
