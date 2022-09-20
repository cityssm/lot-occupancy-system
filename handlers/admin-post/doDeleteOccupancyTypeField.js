import { deleteOccupancyTypeField } from "../../helpers/lotOccupancyDB/deleteOccupancyTypeField.js";
import { getAllOccupancyTypeFields, getOccupancyTypes } from "../../helpers/functions.cache.js";
export const handler = async (request, response) => {
    const success = deleteOccupancyTypeField(request.body.occupancyTypeFieldId, request.session);
    const occupancyTypes = getOccupancyTypes();
    const allOccupancyTypeFields = getAllOccupancyTypeFields();
    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
};
export default handler;