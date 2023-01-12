import { getWorkOrderMilestoneTypes } from '../../helpers/functions.cache.js';
import { addRecord } from '../../helpers/lotOccupancyDB/addRecord.js';
export const handler = (request, response) => {
    const workOrderMilestoneTypeId = addRecord('WorkOrderMilestoneTypes', request.body.workOrderMilestoneType, request.body.orderNumber ?? -1, request.session);
    const workOrderMilestoneTypes = getWorkOrderMilestoneTypes();
    response.json({
        success: true,
        workOrderMilestoneTypeId,
        workOrderMilestoneTypes
    });
};
export default handler;
