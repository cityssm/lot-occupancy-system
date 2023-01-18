import { dateToString } from '@cityssm/expressjs-server-js/dateTimeFns.js';
import { getWorkOrderMilestones } from '../../helpers/lotOccupancyDB/getWorkOrderMilestones.js';
import { getWorkOrders } from '../../helpers/lotOccupancyDB/getWorkOrders.js';
export async function handler(_request, response) {
    const currentDateString = dateToString(new Date());
    const workOrderMilestones = await getWorkOrderMilestones({
        workOrderMilestoneDateFilter: 'date',
        workOrderMilestoneDateString: currentDateString
    }, {
        orderBy: 'completion',
        includeWorkOrders: true
    });
    const workOrderResults = await getWorkOrders({
        workOrderOpenDateString: currentDateString
    }, {
        limit: 1,
        offset: 0
    });
    response.render('dashboard', {
        headTitle: 'Dashboard',
        workOrderMilestones,
        workOrderCount: workOrderResults.count
    });
}
export default handler;
