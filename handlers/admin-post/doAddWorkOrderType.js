import { addRecord } from "../../helpers/lotOccupancyDB/addRecord.js";
import { getWorkOrderTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const workOrderTypeId = addRecord("WorkOrderTypes", request.body.workOrderType, request.body.orderNumber || -1, request.session);
    const workOrderTypes = getWorkOrderTypes();
    response.json({
        success: true,
        workOrderTypeId,
        workOrderTypes
    });
};
export default handler;
