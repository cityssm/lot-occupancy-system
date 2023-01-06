import { addRecord } from "../../helpers/lotOccupancyDB/addRecord.js";
import { getAllOccupancyTypeFields, getOccupancyTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const occupancyTypeId = addRecord("OccupancyTypes", request.body.occupancyType, request.body.orderNumber || -1, request.session);
    const occupancyTypes = getOccupancyTypes();
    const allOccupancyTypeFields = getAllOccupancyTypeFields();
    response.json({
        success: true,
        occupancyTypeId,
        occupancyTypes,
        allOccupancyTypeFields
    });
};
export default handler;
