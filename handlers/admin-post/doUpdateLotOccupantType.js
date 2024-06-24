import updateLotOccupantType from '../../database/updateLotOccupantType.js';
import { getLotOccupantTypes } from '../../helpers/functions.cache.js';
export default async function handler(request, response) {
    const success = await updateLotOccupantType(request.body, request.session.user);
    const lotOccupantTypes = await getLotOccupantTypes();
    response.json({
        success,
        lotOccupantTypes
    });
}
