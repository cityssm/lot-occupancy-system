import { moveRecordUp, moveRecordUpToTop } from '../../database/moveRecord.js';
import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordUpToTop('OccupancyTypes', request.body.occupancyTypeId)
        : await moveRecordUp('OccupancyTypes', request.body.occupancyTypeId);
    const occupancyTypes = await getOccupancyTypes();
    const allOccupancyTypeFields = await getAllOccupancyTypeFields();
    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
}
export default handler;
