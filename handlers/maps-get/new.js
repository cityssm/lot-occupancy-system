import * as configFunctions from '../../helpers/functions.config.js';
import { getMapSVGs } from '../../helpers/functions.map.js';
export async function handler(_request, response) {
    const map = {
        mapCity: configFunctions.getProperty('settings.map.mapCityDefault'),
        mapProvince: configFunctions.getProperty('settings.map.mapProvinceDefault')
    };
    const mapSVGs = await getMapSVGs();
    response.render('map-edit', {
        headTitle: `${configFunctions.getProperty('aliases.map')} Create`,
        isCreate: true,
        map,
        mapSVGs
    });
}
export default handler;
