import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
import { addOccupancyTypePrint } from '../../database/addOccupancyTypePrint.js';
export async function handler(request, response) {
    const success = await addOccupancyTypePrint(request.body, request.session.user);
    const occupancyTypes = await getOccupancyTypes();
    const allOccupancyTypeFields = await getAllOccupancyTypeFields();
    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
}
export default handler;
