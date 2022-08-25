import { moveWorkOrderTypeDown } from "../../helpers/lotOccupancyDB/moveWorkOrderTypeDown.js";
import { getWorkOrderTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = moveWorkOrderTypeDown(request.body.workOrderTypeId);
    const workOrderTypes = getWorkOrderTypes();
    response.json({
        success,
        workOrderTypes
    });
};
export default handler;
