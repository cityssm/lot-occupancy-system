import { moveOccupancyTypePrintDown, moveOccupancyTypePrintDownToBottom } from '../../helpers/lotOccupancyDB/moveOccupancyTypePrintDown.js';
import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
export const handler = (request, response) => {
    const success = request.body.moveToEnd === '1'
        ? moveOccupancyTypePrintDownToBottom(request.body.occupancyTypeId, request.body.printEJS)
        : moveOccupancyTypePrintDown(request.body.occupancyTypeId, request.body.printEJS);
    const occupancyTypes = getOccupancyTypes();
    const allOccupancyTypeFields = getAllOccupancyTypeFields();
    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
};
export default handler;
