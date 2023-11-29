import { moveOccupancyTypeFieldUp, moveOccupancyTypeFieldUpToTop } from '../../database/moveOccupancyTypeField.js';
import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const occupancyTypeFieldId = Number.parseInt(request.body.occupancyTypeFieldId, 10);
    const success = request.body.moveToEnd === '1'
        ? await moveOccupancyTypeFieldUpToTop(occupancyTypeFieldId)
        : await moveOccupancyTypeFieldUp(occupancyTypeFieldId);
    const occupancyTypes = await getOccupancyTypes();
    const allOccupancyTypeFields = await getAllOccupancyTypeFields();
    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
}
export default handler;
