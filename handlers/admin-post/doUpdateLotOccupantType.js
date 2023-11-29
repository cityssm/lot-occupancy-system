import { getLotOccupantTypes } from '../../helpers/functions.cache.js';
import { updateLotOccupantType } from '../../helpers/lotOccupancyDB/updateLotOccupantType.js';
export async function handler(request, response) {
    const success = await updateLotOccupantType(request.body, request.session.user);
    const lotOccupantTypes = await getLotOccupantTypes();
    response.json({
        success,
        lotOccupantTypes
    });
}
export default handler;
