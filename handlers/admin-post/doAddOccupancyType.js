import { addRecord } from '../../database/addRecord.js';
import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
export default async function handler(request, response) {
    const occupancyTypeId = await addRecord('OccupancyTypes', request.body.occupancyType, request.body.orderNumber ?? -1, request.session.user);
    const occupancyTypes = await getOccupancyTypes();
    const allOccupancyTypeFields = await getAllOccupancyTypeFields();
    response.json({
        success: true,
        occupancyTypeId,
        occupancyTypes,
        allOccupancyTypeFields
    });
}
