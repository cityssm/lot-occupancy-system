import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
import { deleteOccupancyTypePrint } from '../../helpers/lotOccupancyDB/deleteOccupancyTypePrint.js';
export async function handler(request, response) {
    const success = await deleteOccupancyTypePrint(request.body.occupancyTypeId, request.body.printEJS, request.session.user);
    const occupancyTypes = await getOccupancyTypes();
    const allOccupancyTypeFields = await getAllOccupancyTypeFields();
    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
}
export default handler;
