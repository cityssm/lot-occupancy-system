import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
import { addOccupancyTypeField } from '../../helpers/lotOccupancyDB/addOccupancyTypeField.js';
export async function handler(request, response) {
    const occupancyTypeFieldId = await addOccupancyTypeField(request.body, request.session.user);
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
