import { copyLotOccupancy } from '../../helpers/lotOccupancyDB/copyLotOccupancy.js';
export const handler = (request, response) => {
    const lotOccupancyId = copyLotOccupancy(request.body.lotOccupancyId, request.session);
    response.json({
        success: true,
        lotOccupancyId
    });
};
export default handler;
