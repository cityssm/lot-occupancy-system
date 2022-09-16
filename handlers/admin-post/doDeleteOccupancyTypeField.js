import { deleteOccupancyTypeField } from "../../helpers/lotOccupancyDB/deleteOccupancyTypeField.js";
import { getOccupancyTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = deleteOccupancyTypeField(request.body.occupancyTypeFieldId, request.session);
    const occupancyTypes = getOccupancyTypes();
    response.json({
        success,
        occupancyTypes
    });
};
export default handler;
