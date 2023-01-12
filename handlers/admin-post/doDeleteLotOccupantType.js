import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
import { getLotOccupantTypes } from '../../helpers/functions.cache.js';
export const handler = (request, response) => {
    const success = deleteRecord('LotOccupantTypes', request.body.lotOccupantTypeId, request.session);
    const lotOccupantTypes = getLotOccupantTypes();
    response.json({
        success,
        lotOccupantTypes
    });
};
export default handler;
