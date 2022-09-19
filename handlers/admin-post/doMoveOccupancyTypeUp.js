import { moveOccupancyTypeUp } from "../../helpers/lotOccupancyDB/moveOccupancyTypeUp.js";
import { getAllOccupancyTypeFields, getOccupancyTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = moveOccupancyTypeUp(request.body.occupancyTypeId);
    const occupancyTypes = getOccupancyTypes();
    const allOccupancyTypeFields = getAllOccupancyTypeFields();
    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
};
export default handler;
