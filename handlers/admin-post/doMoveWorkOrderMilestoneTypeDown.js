import { moveWorkOrderMilestoneTypeDown } from "../../helpers/lotOccupancyDB/moveWorkOrderMilestoneTypeDown.js";
import { getWorkOrderMilestoneTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = moveWorkOrderMilestoneTypeDown(request.body.workOrderMilestoneTypeId);
    const workOrderMilestoneTypes = getWorkOrderMilestoneTypes();
    response.json({
        success,
        workOrderMilestoneTypes
    });
};
export default handler;
