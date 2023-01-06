import { deleteRecord } from "../../helpers/lotOccupancyDB/deleteRecord.js";
import { getWorkOrderMilestoneTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = deleteRecord("WorkOrderMilestoneTypes", request.body.workOrderMilestoneTypeId, request.session);
    const workOrderMilestoneTypes = getWorkOrderMilestoneTypes();
    response.json({
        success,
        workOrderMilestoneTypes
    });
};
export default handler;
