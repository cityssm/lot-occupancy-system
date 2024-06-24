import getMaps from '../../database/getMaps.js';
import { getConfigProperty } from '../../helpers/functions.config.js';
export default async function handler(_request, response) {
    const maps = await getMaps();
    response.render('map-search', {
        headTitle: `${getConfigProperty('aliases.map')} Search`,
        maps
    });
}
