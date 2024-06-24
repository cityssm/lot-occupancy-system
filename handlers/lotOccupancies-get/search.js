import { getMaps } from '../../database/getMaps.js';
import { getLotTypes, getOccupancyTypes } from '../../helpers/functions.cache.js';
import * as configFunctions from '../../helpers/functions.config.js';
export async function handler(request, response) {
    const maps = await getMaps();
    const lotTypes = await getLotTypes();
    const occupancyTypes = await getOccupancyTypes();
    response.render('lotOccupancy-search', {
        headTitle: `${configFunctions.getConfigProperty('aliases.occupancy')} Search`,
        maps,
        lotTypes,
        occupancyTypes,
        mapId: request.query.mapId
    });
}
export default handler;
