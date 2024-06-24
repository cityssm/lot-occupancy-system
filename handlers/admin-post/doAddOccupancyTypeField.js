import addOccupancyTypeField from '../../database/addOccupancyTypeField.js';
import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
export default async function handler(request, response) {
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
