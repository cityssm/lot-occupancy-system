import { getLotOccupantTypes, getLotStatuses, getWorkOrderMilestoneTypes, getWorkOrderTypes } from '../../helpers/functions.cache.js';
import { getSolidIconClasses } from '../../helpers/functions.icons.js';
export async function handler(_request, response) {
    const workOrderTypes = await getWorkOrderTypes();
    const workOrderMilestoneTypes = await getWorkOrderMilestoneTypes();
    const lotStatuses = await getLotStatuses();
    const lotOccupantTypes = await getLotOccupantTypes();
    const fontAwesomeIconClasses = await getSolidIconClasses();
    response.render('admin-tables', {
        headTitle: 'Config Table Management',
        workOrderTypes,
        workOrderMilestoneTypes,
        lotStatuses,
        lotOccupantTypes,
        fontAwesomeIconClasses
    });
}
export default handler;
