import addLotOccupantType from '../../database/addLotOccupantType.js';
import { getLotOccupantTypes } from '../../helpers/functions.cache.js';
export default async function handler(request, response) {
    const lotOccupantTypeId = await addLotOccupantType(request.body, request.session.user);
    const lotOccupantTypes = await getLotOccupantTypes();
    response.json({
        success: true,
        lotOccupantTypeId,
        lotOccupantTypes
    });
}
