import { moveRecordDown, moveRecordDownToBottom } from '../../helpers/lotOccupancyDB/moveRecord.js';
import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
export async function handler(request, response) {
    const success = request.body.moveToEnd === '1'
        ? await moveRecordDownToBottom('OccupancyTypes', request.body.occupancyTypeId)
        : await moveRecordDown('OccupancyTypes', request.body.occupancyTypeId);
    const occupancyTypes = await getOccupancyTypes();
    const allOccupancyTypeFields = await getAllOccupancyTypeFields();
    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
}
export default handler;
