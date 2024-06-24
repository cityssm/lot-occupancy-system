import { deleteRecord } from '../../database/deleteRecord.js';
import { getLotOccupantTypes } from '../../helpers/functions.cache.js';
export default async function handler(request, response) {
    const success = await deleteRecord('LotOccupantTypes', request.body.lotOccupantTypeId, request.session.user);
    const lotOccupantTypes = await getLotOccupantTypes();
    response.json({
        success,
        lotOccupantTypes
    });
}
