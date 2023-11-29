import { clearNextPreviousLotIdCache } from '../../helpers/functions.lots.js';
import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
export async function handler(request, response) {
    const success = await deleteRecord('Maps', request.body.mapId, request.session.user);
    response.json({
        success
    });
    response.on('finish', () => {
        clearNextPreviousLotIdCache(-1);
    });
}
export default handler;
