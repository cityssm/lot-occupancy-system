import { addWorkOrderComment } from "../../helpers/lotOccupancyDB/addWorkOrderComment.js";
import { getWorkOrderComments } from "../../helpers/lotOccupancyDB/getWorkOrderComments.js";
export const handler = async (request, response) => {
    addWorkOrderComment(request.body, request.session);
    const workOrderComments = getWorkOrderComments(request.body.workOrderId);
    response.json({
        success: true,
        workOrderComments
    });
};
export default handler;
