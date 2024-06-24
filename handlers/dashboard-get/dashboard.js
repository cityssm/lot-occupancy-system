import { dateToString } from '@cityssm/utils-datetime';
import getLotOccupancies from '../../database/getLotOccupancies.js';
import getWorkOrderMilestones from '../../database/getWorkOrderMilestones.js';
import { getWorkOrders } from '../../database/getWorkOrders.js';
export default async function handler(_request, response) {
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
    const lotOccupancyResults = await getLotOccupancies({
        occupancyStartDateString: currentDateString
    }, {
        limit: 1,
        offset: 0,
        includeFees: false,
        includeOccupants: false,
        includeTransactions: false
    });
    response.render('dashboard', {
        headTitle: 'Dashboard',
        workOrderMilestones,
        workOrderCount: workOrderResults.count,
        lotOccupancyCount: lotOccupancyResults.count
    });
}
