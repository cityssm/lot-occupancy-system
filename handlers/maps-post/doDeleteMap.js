import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
export const handler = (request, response) => {
    const success = deleteRecord('Maps', request.body.mapId, request.session);
    response.json({
        success
    });
};
export default handler;
