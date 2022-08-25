import { updateWorkOrderType } from "../../helpers/lotOccupancyDB/updateWorkOrderType.js";
import { getWorkOrderTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = updateWorkOrderType(request.body, request.session);
    const workOrderTypes = getWorkOrderTypes();
    response.json({
        success,
        workOrderTypes
    });
};
export default handler;
