import { moveOccupancyTypeDown } from "../../helpers/lotOccupancyDB/moveOccupancyTypeDown.js";
import { getOccupancyTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = moveOccupancyTypeDown(request.body.occupancyTypeId);
    const occupancyTypes = getOccupancyTypes();
    response.json({
        success,
        occupancyTypes
    });
};
export default handler;
