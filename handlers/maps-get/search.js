import * as configFunctions from '../../helpers/functions.config.js';
import { getMaps } from '../../helpers/lotOccupancyDB/getMaps.js';
export async function handler(_request, response) {
    const maps = await getMaps();
    response.render('map-search', {
        headTitle: `${configFunctions.getProperty('aliases.map')} Search`,
        maps
    });
}
export default handler;
