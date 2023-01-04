import { moveOccupancyTypeUp, moveOccupancyTypeUpToTop } from "../../helpers/lotOccupancyDB/moveOccupancyTypeUp.js";
import { getAllOccupancyTypeFields, getOccupancyTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = request.body.moveToEnd === "1"
        ? moveOccupancyTypeUpToTop(request.body.occupancyTypeId)
        : moveOccupancyTypeUp(request.body.occupancyTypeId);
    const occupancyTypes = getOccupancyTypes();
    const allOccupancyTypeFields = getAllOccupancyTypeFields();
    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
};
export default handler;
