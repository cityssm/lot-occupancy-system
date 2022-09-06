import { deleteOccupancyType } from "../../helpers/lotOccupancyDB/deleteOccupancyType.js";
import { getOccupancyTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = deleteOccupancyType(request.body.occupancyTypeId, request.session);
    const occupancyTypes = getOccupancyTypes();
    response.json({
        success,
        occupancyTypes
    });
};
export default handler;
