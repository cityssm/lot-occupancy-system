import { getMaps } from '../../database/getMaps.js';
import * as cacheFunctions from '../../helpers/functions.cache.js';
import * as configFunctions from '../../helpers/functions.config.js';
export default async function handler(request, response) {
    const lot = {
        lotId: -1,
        lotOccupancies: []
    };
    const maps = await getMaps();
    if (request.query.mapId !== undefined) {
        const mapId = Number.parseInt(request.query.mapId, 10);
        const map = maps.find((possibleMap) => {
            return mapId === possibleMap.mapId;
        });
        if (map !== undefined) {
            lot.mapId = map.mapId;
            lot.mapName = map.mapName;
        }
    }
    const lotTypes = await cacheFunctions.getLotTypes();
    const lotStatuses = await cacheFunctions.getLotStatuses();
    response.render('lot-edit', {
        headTitle: `Create a New ${configFunctions.getConfigProperty('aliases.lot')}`,
        lot,
        isCreate: true,
        maps,
        lotTypes,
        lotStatuses
    });
}
