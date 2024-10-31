import { moveOccupancyTypeFieldUp, moveOccupancyTypeFieldUpToTop } from '../../database/moveOccupancyTypeField.js';
import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
export default async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveOccupancyTypeFieldUpToTop(request.body.occupancyTypeFieldId)
        : await moveOccupancyTypeFieldUp(request.body.occupancyTypeFieldId);
    const occupancyTypes = await getOccupancyTypes();
    const allOccupancyTypeFields = await getAllOccupancyTypeFields();
    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
}
