import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
import { updateRecord } from '../../database/updateRecord.js';
export async function handler(request, response) {
    const success = await updateRecord('OccupancyTypes', request.body.occupancyTypeId, request.body.occupancyType, request.session.user);
    const occupancyTypes = await getOccupancyTypes();
    const allOccupancyTypeFields = await getAllOccupancyTypeFields();
    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
}
export default handler;
