import { clearNextPreviousLotIdCache } from '../../helpers/functions.lots.js';
import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
export async function handler(request, response) {
    const success = await deleteRecord('Maps', request.body.mapId, request.session);
    response.json({
        success
    });
    response.on('finish', () => {
        clearNextPreviousLotIdCache();
    });
}
export default handler;
