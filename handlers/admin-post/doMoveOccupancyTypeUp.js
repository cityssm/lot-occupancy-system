import { moveOccupancyTypeUp } from "../../helpers/lotOccupancyDB/moveOccupancyTypeUp.js";
import { getOccupancyTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = moveOccupancyTypeUp(request.body.occupancyTypeId);
    const occupancyTypes = getOccupancyTypes();
    response.json({
        success,
        occupancyTypes
    });
};
export default handler;
