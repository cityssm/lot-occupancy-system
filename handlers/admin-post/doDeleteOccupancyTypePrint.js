import { deleteOccupancyTypePrint } from '../../helpers/lotOccupancyDB/deleteOccupancyTypePrint.js';
import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
export const handler = (request, response) => {
    const success = deleteOccupancyTypePrint(request.body.occupancyTypeId, request.body.printEJS, request.session);
    const occupancyTypes = getOccupancyTypes();
    const allOccupancyTypeFields = getAllOccupancyTypeFields();
    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
};
export default handler;
