import { addOccupancyTypeField } from '../../helpers/lotOccupancyDB/addOccupancyTypeField.js';
import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const occupancyTypeFieldId = await addOccupancyTypeField(request.body, request.session);
    const occupancyTypes = await getOccupancyTypes();
    const allOccupancyTypeFields = await getAllOccupancyTypeFields();
    response.json({
        success: true,
        occupancyTypeFieldId,
        occupancyTypes,
        allOccupancyTypeFields
    });
}
export default handler;
