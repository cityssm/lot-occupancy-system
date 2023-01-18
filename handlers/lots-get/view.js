import * as configFunctions from '../../helpers/functions.config.js';
import { getLot } from '../../helpers/lotOccupancyDB/getLot.js';
export async function handler(request, response) {
    const lot = await getLot(request.params.lotId);
    if (!lot) {
        response.redirect(configFunctions.getProperty('reverseProxy.urlPrefix') +
            '/lots/?error=lotIdNotFound');
        return;
    }
    response.render('lot-view', {
        headTitle: lot.lotName,
        lot
    });
}
export default handler;
