import { deleteRecord } from "../../helpers/lotOccupancyDB/deleteRecord.js";
import { getWorkOrderComments } from "../../helpers/lotOccupancyDB/getWorkOrderComments.js";
export const handler = async (request, response) => {
    const success = deleteRecord("WorkOrderComments", request.body.workOrderCommentId, request.session);
    const workOrderComments = getWorkOrderComments(request.body.workOrderId);
    response.json({
        success,
        workOrderComments
    });
};
export default handler;
