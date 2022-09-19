import { deleteOccupancyType } from "../../helpers/lotOccupancyDB/deleteOccupancyType.js";
import { getAllOccupancyTypeFields, getOccupancyTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = deleteOccupancyType(request.body.occupancyTypeId, request.session);
    const occupancyTypes = getOccupancyTypes();
    const allOccupancyTypeFields = getAllOccupancyTypeFields();
    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
};
export default handler;
