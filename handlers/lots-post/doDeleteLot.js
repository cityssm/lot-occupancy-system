import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
export async function handler(request, response) {
    const success = await deleteRecord('Lots', request.body.lotId, request.session);
    response.json({
        success
    });
}
export default handler;
