import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
import { deleteRecord } from '../../database/deleteRecord.js';
export async function handler(request, response) {
    const success = await deleteRecord('OccupancyTypes', request.body.occupancyTypeId, request.session.user);
    const occupancyTypes = await getOccupancyTypes();
    const allOccupancyTypeFields = await getAllOccupancyTypeFields();
    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
}
export default handler;
