import { moveOccupancyTypeFieldDown, moveOccupancyTypeFieldDownToBottom } from '../../helpers/lotOccupancyDB/moveOccupancyTypeField.js';
import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
export const handler = (request, response) => {
    const occupancyTypeFieldId = Number.parseInt(request.body.occupancyTypeFieldId, 10);
    const success = request.body.moveToEnd === '1'
        ? moveOccupancyTypeFieldDownToBottom(occupancyTypeFieldId)
        : moveOccupancyTypeFieldDown(occupancyTypeFieldId);
    const occupancyTypes = getOccupancyTypes();
    const allOccupancyTypeFields = getAllOccupancyTypeFields();
    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
};
export default handler;
