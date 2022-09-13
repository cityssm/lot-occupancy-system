import { addWorkOrder } from "../../helpers/lotOccupancyDB/addWorkOrder.js";
export const handler = async (request, response) => {
    const workOrderId = addWorkOrder(request.body, request.session);
    response.json({
        success: true,
        workOrderId
    });
};
export default handler;
