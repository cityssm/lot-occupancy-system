import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
export async function handler(request, response) {
    const success = await deleteRecord('LotOccupancies', request.body.lotOccupancyId, request.session);
    response.json({
        success
    });
}
export default handler;
