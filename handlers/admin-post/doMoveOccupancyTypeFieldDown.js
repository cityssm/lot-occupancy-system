import { moveOccupancyTypeFieldDown, moveOccupancyTypeFieldDownToBottom } from '../../database/moveOccupancyTypeField.js';
import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
export default async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveOccupancyTypeFieldDownToBottom(request.body.occupancyTypeFieldId)
        : await moveOccupancyTypeFieldDown(request.body.occupancyTypeFieldId);
    const occupancyTypes = await getOccupancyTypes();
    const allOccupancyTypeFields = await getAllOccupancyTypeFields();
    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
}
