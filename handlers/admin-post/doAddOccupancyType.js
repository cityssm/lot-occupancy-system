import { addRecord } from '../../helpers/lotOccupancyDB/addRecord.js';
import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const occupancyTypeId = await addRecord('OccupancyTypes', request.body.occupancyType, request.body.orderNumber ?? -1, request.session);
    const occupancyTypes = await getOccupancyTypes();
    const allOccupancyTypeFields = await getAllOccupancyTypeFields();
    response.json({
        success: true,
        occupancyTypeId,
        occupancyTypes,
        allOccupancyTypeFields
    });
}
export default handler;
