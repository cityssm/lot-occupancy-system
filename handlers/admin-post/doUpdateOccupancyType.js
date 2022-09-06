import { updateOccupancyType } from "../../helpers/lotOccupancyDB/updateOccupancyType.js";
import { getOccupancyTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = updateOccupancyType(request.body, request.session);
    const occupancyTypes = getOccupancyTypes();
    response.json({
        success,
        occupancyTypes
    });
};
export default handler;
