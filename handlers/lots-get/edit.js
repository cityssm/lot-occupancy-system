import * as configFunctions from '../../helpers/functions.config.js';
import { getLot } from '../../helpers/lotOccupancyDB/getLot.js';
import { getMaps } from '../../helpers/lotOccupancyDB/getMaps.js';
import * as cacheFunctions from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const lot = await getLot(request.params.lotId);
    if (!lot) {
        response.redirect(configFunctions.getProperty('reverseProxy.urlPrefix') +
            '/lots/?error=lotIdNotFound');
        return;
    }
    const maps = await getMaps();
    const lotTypes = await cacheFunctions.getLotTypes();
    const lotStatuses = await cacheFunctions.getLotStatuses();
    response.render('lot-edit', {
        headTitle: lot.lotName,
        lot,
        isCreate: false,
        maps,
        lotTypes,
        lotStatuses
    });
}
export default handler;
