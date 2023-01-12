import { deleteRecord } from '../../helpers/lotOccupancyDB/deleteRecord.js';
export const handler = (request, response) => {
    const success = deleteRecord('Lots', request.body.lotId, request.session);
    response.json({
        success
    });
};
export default handler;
