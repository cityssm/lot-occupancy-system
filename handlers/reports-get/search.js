import * as dateTimeFunctions from '@cityssm/expressjs-server-js/dateTimeFns.js';
import { getMaps } from '../../helpers/lotOccupancyDB/getMaps.js';
import { getLotStatuses, getLotTypes } from '../../helpers/functions.cache.js';
export async function handler(_request, response) {
    const rightNow = new Date();
    const maps = await getMaps();
    const lotTypes = await getLotTypes();
    const lotStatuses = await getLotStatuses();
    response.render('report-search', {
        headTitle: 'Reports',
        todayDateString: dateTimeFunctions.dateToString(rightNow),
        maps,
        lotTypes,
        lotStatuses
    });
}
export default handler;
