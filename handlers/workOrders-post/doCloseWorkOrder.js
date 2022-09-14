import { closeWorkOrder } from "../../helpers/lotOccupancyDB/closeWorkOrder.js";
export const handler = async (request, response) => {
    const success = closeWorkOrder(request.body, request.session);
    response.json({
        success
    });
};
export default handler;
