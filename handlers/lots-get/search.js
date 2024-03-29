import { getMaps } from '../../database/getMaps.js';
import { getLotTypes, getLotStatuses } from '../../helpers/functions.cache.js';
import * as configFunctions from '../../helpers/functions.config.js';
export async function handler(request, response) {
    const maps = await getMaps();
    const lotTypes = await getLotTypes();
    const lotStatuses = await getLotStatuses();
    response.render('lot-search', {
        headTitle: `${configFunctions.getProperty('aliases.lot')} Search`,
        maps,
        lotTypes,
        lotStatuses,
        mapId: request.query.mapId,
        lotTypeId: request.query.lotTypeId,
        lotStatusId: request.query.lotStatusId
    });
}
export default handler;
