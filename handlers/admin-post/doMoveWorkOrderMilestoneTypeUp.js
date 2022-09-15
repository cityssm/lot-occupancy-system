import { moveWorkOrderMilestoneTypeUp } from "../../helpers/lotOccupancyDB/moveWorkOrderMilestoneTypeUp.js";
import { getWorkOrderMilestoneTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = moveWorkOrderMilestoneTypeUp(request.body.workOrderMilestoneTypeId);
    const workOrderMilestoneTypes = getWorkOrderMilestoneTypes();
    response.json({
        success,
        workOrderMilestoneTypes
    });
};
export default handler;
