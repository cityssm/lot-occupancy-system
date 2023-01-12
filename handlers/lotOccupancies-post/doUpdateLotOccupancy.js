import { updateLotOccupancy } from '../../helpers/lotOccupancyDB/updateLotOccupancy.js';
export const handler = (request, response) => {
    const success = updateLotOccupancy(request.body, request.session);
    response.json({
        success,
        lotOccupancyId: request.body.lotOccupancyId
    });
};
export default handler;
