import { deleteWorkOrderMilestoneType } from "../../helpers/lotOccupancyDB/deleteWorkOrderMilestoneType.js";
import { getWorkOrderMilestoneTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = deleteWorkOrderMilestoneType(request.body.workOrderMilestoneTypeId, request.session);
    const workOrderMilestoneTypes = getWorkOrderMilestoneTypes();
    response.json({
        success,
        workOrderMilestoneTypes
    });
};
export default handler;
