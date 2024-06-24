import addOccupancyTypePrint from '../../database/addOccupancyTypePrint.js';
import { getAllOccupancyTypeFields, getOccupancyTypes } from '../../helpers/functions.cache.js';
export default async function handler(request, response) {
    const success = await addOccupancyTypePrint(request.body, request.session.user);
    const occupancyTypes = await getOccupancyTypes();
    const allOccupancyTypeFields = await getAllOccupancyTypeFields();
    response.json({
        success,
        occupancyTypes,
        allOccupancyTypeFields
    });
}
