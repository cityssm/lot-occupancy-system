import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
import { updateOccupancyTypeField } from '../../helpers/lotOccupancyDB/updateOccupancyTypeField.js';
export async function handler(request, response) {
    const success = await updateOccupancyTypeField(request.body, request.session.user);
    const occupancyTypes = await getOccupancyTypes();
    const allOccupancyTypeFields = await getAllOccupancyTypeFields();
    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
}
export default handler;
