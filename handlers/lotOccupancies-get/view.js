import getLotOccupancy from '../../database/getLotOccupancy.js';
import { getOccupancyTypePrintsById } from '../../helpers/functions.cache.js';
import { getConfigProperty } from '../../helpers/functions.config.js';
export default async function handler(request, response) {
    const lotOccupancy = await getLotOccupancy(request.params.lotOccupancyId);
    if (lotOccupancy === undefined) {
        response.redirect(`${getConfigProperty('reverseProxy.urlPrefix')}/lotOccupancies/?error=lotOccupancyIdNotFound`);
        return;
    }
    const occupancyTypePrints = await getOccupancyTypePrintsById(lotOccupancy.occupancyTypeId);
    response.render('lotOccupancy-view', {
        headTitle: `${getConfigProperty('aliases.occupancy')} View`,
        lotOccupancy,
        occupancyTypePrints
    });
}
